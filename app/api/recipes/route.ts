import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Recipe } from '@/types';
import { prisma } from '@/lib/prisma';

// GET /api/recipes - Get all recipes for the authenticated user
export async function GET(request: NextRequest) {
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

    // Get all recipes for this user
    const dbRecipes = await prisma.recipe.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Transform database recipes to frontend format
    const recipes: Recipe[] = dbRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description || '',
      dateAdded: recipe.createdAt.toISOString(),
      notes: recipe.notes || '',
      tags: recipe.tags,
      situation: recipe.situation || '',
      feedback: recipe.feedback || null,
      ...(recipe.content as any), // Spread the JSON content
    }));

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
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

    const recipeData: Recipe = await request.json();

    // Extract fields for database storage
    const { id, title, description, dateAdded, notes, tags, situation, feedback, ...content } = recipeData;

    // Create recipe in database
    const dbRecipe = await prisma.recipe.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        content: content as any, // Store remaining fields as JSON
        tags: tags || [],
        situation: situation || null,
        notes: notes || null,
        feedback: feedback || null,
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
      feedback: dbRecipe.feedback || null,
      ...(dbRecipe.content as any),
    };

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}