import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MenuCategory } from "@prisma/client";

const MENU_CATEGORIES = Object.values(MenuCategory);

// GET - Get all menu items with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const isPopular = searchParams.get('isPopular');
    const isNew = searchParams.get('isNew');
    const isVegetarian = searchParams.get('isVegetarian');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    
    // Build where clause
    const where: {
      category?: MenuCategory;
      isPopular?: boolean;
      isNew?: boolean;
      isVegetarian?: boolean;
      isAvailable?: boolean;
      OR?: Array<{ name: { contains: string; mode: 'insensitive' } } | { description: { contains: string; mode: 'insensitive' } }>;
    } = {
      isAvailable: true,
    };
    
    if (category && MENU_CATEGORIES.includes(category as MenuCategory)) {
      where.category = category as MenuCategory;
    }
    
    if (isPopular === 'true') {
      where.isPopular = true;
    }
    
    if (isNew === 'true') {
      where.isNew = true;
    }
    
    if (isVegetarian === 'true') {
      where.isVegetarian = true;
    } else if (isVegetarian === 'false') {
      where.isVegetarian = false;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: [
        { isPopular: 'desc' },
        { isNew: 'desc' },
        { name: 'asc' },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
