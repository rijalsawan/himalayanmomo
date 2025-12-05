import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all menu items (for admin - no availability filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate slug from name if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check if slug already exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { slug },
    });

    if (existingItem) {
      return NextResponse.json({ error: 'An item with this slug already exists' }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        slug,
        name: body.name,
        description: body.description,
        longDescription: body.longDescription || null,
        price: parseFloat(body.price),
        category: body.category,
        image: body.image || '/images/placeholder-food.jpg',
        spiceLevel: parseInt(body.spiceLevel) || 0,
        isVegetarian: body.isVegetarian || false,
        isPopular: body.isPopular || false,
        isNew: body.isNew || false,
        isAvailable: body.isAvailable ?? true,
        ingredients: body.ingredients || [],
        allergens: body.allergens || [],
        calories: body.calories ? parseInt(body.calories) : null,
        protein: body.protein || null,
        carbs: body.carbs || null,
        fat: body.fat || null,
        preparationTime: body.preparationTime || null,
        servingSize: body.servingSize || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
