import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { feedback } = await request.json();
    
    // Validate feedback value
    if (feedback && !['thumbs_up', 'thumbs_down'].includes(feedback)) {
      return NextResponse.json(
        { success: false, error: 'Invalid feedback value' },
        { status: 400 }
      );
    }

    // Find the user first
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the recipe feedback
    const recipe = await prisma.recipe.update({
      where: {
        id: params.id,
        userId: user.id, // Ensure user can only update their own recipes
      },
      data: {
        feedback: feedback || null, // Allow clearing feedback by passing null/undefined
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      recipe: {
        id: recipe.id,
        feedback: recipe.feedback,
      }
    });

  } catch (error) {
    console.error('Recipe feedback error:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { success: false, error: 'Recipe not found or access denied' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update recipe feedback' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find the user first
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the recipe feedback
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
      select: {
        id: true,
        feedback: true,
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      recipe: {
        id: recipe.id,
        feedback: recipe.feedback,
      }
    });

  } catch (error) {
    console.error('Recipe feedback fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipe feedback' },
      { status: 500 }
    );
  }
}