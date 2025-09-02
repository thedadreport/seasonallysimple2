import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { MealPlan } from '@/types';
import { getPrismaClient } from '@/lib/prisma';

// GET /api/meal-plans - Get all meal plans for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }
    
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all meal plans for this user
    const dbMealPlans = await prisma.mealPlan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Transform database meal plans to frontend format
    const mealPlans: MealPlan[] = dbMealPlans.map(mealPlan => ({
      id: mealPlan.id,
      title: mealPlan.title,
      description: mealPlan.description || '',
      dateAdded: mealPlan.createdAt.toISOString(),
      notes: mealPlan.notes || '',
      focus: mealPlan.focus || '',
      numMeals: mealPlan.numMeals || 0,
      totalCost: mealPlan.totalCost || '',
      ...(mealPlan.content as any), // Spread the JSON content
    }));

    return NextResponse.json({ mealPlans });
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/meal-plans - Create a new meal plan
export async function POST(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }
    
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const mealPlanData: MealPlan = await request.json();

    // Extract fields for database storage
    const { id, title, description, dateAdded, notes, focus, numMeals, totalCost, ...content } = mealPlanData;

    // Create meal plan in database
    const dbMealPlan = await prisma.mealPlan.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        content: content as any, // Store remaining fields as JSON
        focus: focus || null,
        numMeals: numMeals || null,
        totalCost: totalCost || null,
        notes: notes || null,
      },
    });

    // Transform back to frontend format
    const mealPlan: MealPlan = {
      id: dbMealPlan.id,
      title: dbMealPlan.title,
      description: dbMealPlan.description || '',
      dateAdded: dbMealPlan.createdAt.toISOString(),
      notes: dbMealPlan.notes || '',
      focus: dbMealPlan.focus || '',
      numMeals: dbMealPlan.numMeals || 0,
      totalCost: dbMealPlan.totalCost || '',
      ...(dbMealPlan.content as any),
    };

    return NextResponse.json({ mealPlan }, { status: 201 });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}