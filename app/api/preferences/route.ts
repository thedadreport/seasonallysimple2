import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET user preferences
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Find user by email, create if doesn't exist (for demo users)
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    });

    if (!user) {
      // Create user if it doesn't exist (for demo/OAuth users)
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || 'User',
          image: session.user.image || null,
        },
        include: { preferences: true }
      });
    }

    // If user has no preferences, create default ones
    let preferences = user.preferences;
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId: user.id,
          cookingSkill: "Intermediate (some techniques)",
          dietaryRestrictions: ["None"],
          cuisinePreferences: ["No Preference"],
          cookingMethods: [],
          useSeasonalIngredients: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        cookingSkill: preferences.cookingSkill,
        dietaryRestrictions: preferences.dietaryRestrictions,
        cuisinePreferences: preferences.cuisinePreferences,
        cookingMethods: preferences.cookingMethods,
        useSeasonalIngredients: preferences.useSeasonalIngredients
      }
    });

  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST/PUT update user preferences
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const {
      cookingSkill,
      dietaryRestrictions,
      cuisinePreferences,
      cookingMethods,
      useSeasonalIngredients
    } = await request.json();

    // Validate required fields
    if (!cookingSkill || !dietaryRestrictions || !cuisinePreferences) {
      return NextResponse.json(
        { success: false, error: 'Missing required preference fields' },
        { status: 400 }
      );
    }

    // Find user by email, create if doesn't exist (for demo users)
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      // Create user if it doesn't exist (for demo/OAuth users)
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || 'User',
          image: session.user.image || null,
        }
      });
    }

    // Upsert preferences (update if exists, create if not)
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        cookingSkill,
        dietaryRestrictions,
        cuisinePreferences,
        cookingMethods: cookingMethods || [],
        useSeasonalIngredients: useSeasonalIngredients || false
      },
      create: {
        userId: user.id,
        cookingSkill,
        dietaryRestrictions,
        cuisinePreferences,
        cookingMethods: cookingMethods || [],
        useSeasonalIngredients: useSeasonalIngredients || false
      }
    });

    return NextResponse.json({
      success: true,
      preferences: {
        cookingSkill: preferences.cookingSkill,
        dietaryRestrictions: preferences.dietaryRestrictions,
        cuisinePreferences: preferences.cuisinePreferences,
        cookingMethods: preferences.cookingMethods,
        useSeasonalIngredients: preferences.useSeasonalIngredients
      }
    });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update preferences' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}