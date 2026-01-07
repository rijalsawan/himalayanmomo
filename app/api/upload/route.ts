import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload configuration presets for different asset types
const uploadPresets: Record<string, { folder: string; transformation?: object[] }> = {
  menu: {
    folder: 'momo-station/menu',
    transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto:best' }],
  },
  avatar: {
    folder: 'momo-station/avatars',
    transformation: [{ width: 200, height: 200, crop: 'fill', quality: 'auto:best' }],
  },
  logo: {
    folder: 'momo-station/branding',
    transformation: [{ width: 400, quality: 'auto:best' }],
  },
  favicon: {
    folder: 'momo-station/seo/favicons',
    // No transformation for favicons - keep original quality
  },
  faviconSvg: {
    folder: 'momo-station/seo/favicons',
    // No transformation for SVG
  },
  appleTouchIcon: {
    folder: 'momo-station/seo/icons',
    transformation: [{ width: 180, height: 180, crop: 'fill', quality: 'auto:best' }],
  },
  ogImage: {
    folder: 'momo-station/seo/social',
    transformation: [{ width: 1200, height: 630, crop: 'fill', quality: 'auto:best' }],
  },
  twitterImage: {
    folder: 'momo-station/seo/social',
    transformation: [{ width: 1200, height: 600, crop: 'fill', quality: 'auto:best' }],
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'menu';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get preset configuration or default to menu
    const preset = uploadPresets[type] || uploadPresets.menu;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: preset.folder,
          resource_type: 'image',
          ...(preset.transformation && { transformation: preset.transformation }),
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('No result from Cloudinary'));
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

// Get Cloudinary signature for client-side widget
export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: 'momo-station/menu',
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Signature error:', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
