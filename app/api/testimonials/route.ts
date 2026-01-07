import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { testimonials as defaultTestimonials } from '@/app/data/testimonials';

// GET - Fetch all active testimonials (public)
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // If no testimonials in DB, return the default ones
    if (testimonials.length === 0) {
      const response = NextResponse.json(defaultTestimonials.map((t, index) => ({
        id: t.id,
        name: t.name,
        avatar: t.avatar,
        rating: t.rating,
        text: t.text,
        location: t.location || null,
        isActive: true,
        order: index,
        createdAt: new Date(t.date).toISOString(),
        updatedAt: new Date(t.date).toISOString(),
      })));
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    const response = NextResponse.json(testimonials);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // Fallback to default testimonials on error
    const response = NextResponse.json(defaultTestimonials.map((t, index) => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      rating: t.rating,
      text: t.text,
      location: t.location || null,
      isActive: true,
      order: index,
      createdAt: new Date(t.date).toISOString(),
      updatedAt: new Date(t.date).toISOString(),
    })));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }
}
