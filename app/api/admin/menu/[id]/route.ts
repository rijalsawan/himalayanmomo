import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single menu item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const item = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
  }
}

// PUT - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    // If slug is being changed, check it doesn't conflict
    if (body.slug && body.slug !== existingItem.slug) {
      const slugConflict = await prisma.menuItem.findUnique({
        where: { slug: body.slug },
      });
      if (slugConflict) {
        return NextResponse.json({ error: 'An item with this slug already exists' }, { status: 400 });
      }
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        slug: body.slug || existingItem.slug,
        name: body.name,
        description: body.description,
        longDescription: body.longDescription || null,
        price: parseFloat(body.price),
        category: body.category,
        image: body.image || existingItem.image,
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

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE - Remove menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}

// PATCH - Toggle availability or other single field updates
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const item = await prisma.menuItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}
