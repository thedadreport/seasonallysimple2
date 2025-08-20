import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { MealPlan } from '@/types';

// Initialize Prisma client with proper singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET /api/meal-plans/[id] - Get a specific meal plan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Get the specific meal plan
    const dbMealPlan = await prisma.mealPlan.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!dbMealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }

    // Transform to frontend format
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

    return NextResponse.json({ mealPlan });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/meal-plans/[id] - Update a specific meal plan
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const updates: Partial<MealPlan> = await request.json();

    // Check if meal plan exists and belongs to user
    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingMealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }

    // Extract fields for database update
    const { id, dateAdded, ...updateData } = updates;
    const { title, description, notes, focus, numMeals, totalCost, ...content } = updateData;

    // Update meal plan in database
    const dbMealPlan = await prisma.mealPlan.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(focus !== undefined && { focus: focus || null }),
        ...(numMeals !== undefined && { numMeals: numMeals || null }),
        ...(totalCost !== undefined && { totalCost: totalCost || null }),
        ...(Object.keys(content).length > 0 && {
          content: {
            ...(existingMealPlan.content as any),
            ...content,
          } as any,
        }),
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

    return NextResponse.json({ mealPlan });
  } catch (error) {
    console.error('Error updating meal plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/meal-plans/[id] - Delete a specific meal plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Check if meal plan exists and belongs to user
    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingMealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }

    // Delete the meal plan
    await prisma.mealPlan.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}