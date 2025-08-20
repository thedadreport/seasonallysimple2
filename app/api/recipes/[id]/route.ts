import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Recipe } from '@/types';
import { prisma } from '@/lib/prisma';

// GET /api/recipes/[id] - Get a specific recipe
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Get the specific recipe
    const dbRecipe = await prisma.recipe.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!dbRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Transform to frontend format
    const recipe: Recipe = {
      id: dbRecipe.id,
      title: dbRecipe.title,
      description: dbRecipe.description || '',
      dateAdded: dbRecipe.createdAt.toISOString(),
      notes: dbRecipe.notes || '',
      tags: dbRecipe.tags,
      situation: dbRecipe.situation || '',
      ...(dbRecipe.content as any),
    };

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id] - Update a specific recipe
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const updates: Partial<Recipe> = await request.json();

    // Check if recipe exists and belongs to user
    const existingRecipe = await prisma.recipe.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Extract fields for database update
    const { id, dateAdded, ...updateData } = updates;
    const { title, description, notes, tags, situation, ...content } = updateData;

    // Update recipe in database
    const dbRecipe = await prisma.recipe.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(tags !== undefined && { tags }),
        ...(situation !== undefined && { situation: situation || null }),
        ...(Object.keys(content).length > 0 && {
          content: {
            ...(existingRecipe.content as any),
            ...content,
          } as any,
        }),
      },
    });

    // Transform back to frontend format
    const recipe: Recipe = {
      id: dbRecipe.id,
      title: dbRecipe.title,
      description: dbRecipe.description || '',
      dateAdded: dbRecipe.createdAt.toISOString(),
      notes: dbRecipe.notes || '',
      tags: dbRecipe.tags,
      situation: dbRecipe.situation || '',
      ...(dbRecipe.content as any),
    };

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/[id] - Delete a specific recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Check if recipe exists and belongs to user
    const existingRecipe = await prisma.recipe.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Delete the recipe
    await prisma.recipe.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}