import { NextRequest, NextResponse } from 'next/server';
import { generateRecipeFromImageWithAI, validateAnthropicConfig } from '@/lib/claude';
import { generateId, formatDate } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { image, familySize, dietaryRestrictions } = await request.json();
    
    // Validate required data
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }

    // Check if Claude is configured
    if (!validateAnthropicConfig()) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured. Please add ANTHROPIC_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    // Generate recipe using AI with image
    const aiRecipe = await generateRecipeFromImageWithAI({
      image,
      familySize: familySize || '4 people',
      dietaryRestrictions: dietaryRestrictions || []
    });
    
    // Format recipe for frontend compatibility
    const recipe = {
      id: generateId(),
      title: aiRecipe.title,
      description: aiRecipe.description,
      cookTime: aiRecipe.cookTime,
      servings: aiRecipe.servings,
      difficulty: aiRecipe.difficulty,
      cost: aiRecipe.cost,
      tags: aiRecipe.tags,
      situation: aiRecipe.situation || 'Recipe from Image',
      ingredients: aiRecipe.ingredients,
      instructions: aiRecipe.instructions,
      tips: aiRecipe.tips,
      notes: aiRecipe.notes || 'Generated from uploaded recipe image',
      dateAdded: formatDate(new Date())
    };

    return NextResponse.json({
      success: true,
      recipe
    });

  } catch (error) {
    console.error('Recipe generation from image error:', error);
    
    // Return specific error messages for better debugging
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, error: 'Anthropic API key is invalid or missing' },
          { status: 503 }
        );
      }
      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { success: false, error: 'AI returned invalid recipe format' },
          { status: 502 }
        );
      }
      if (error.message.includes('image')) {
        return NextResponse.json(
          { success: false, error: 'Unable to process the uploaded image. Please try a different image with clear text.' },
          { status: 400 }
        );
      }
    }
    
    // Check for API overload errors
    if (error && typeof error === 'object' && 'status' in error) {
      if (error.status === 404) {
        return NextResponse.json(
          { success: false, error: 'AI model configuration error. Please try again or contact support.' },
          { status: 503 }
        );
      }
      if (error.status === 529) {
        return NextResponse.json(
          { success: false, error: 'The AI service is currently experiencing high demand. Please try again in a few moments.' },
          { status: 503 }
        );
      }
      if (error.status === 401) {
        return NextResponse.json(
          { success: false, error: 'Authentication failed with AI service' },
          { status: 503 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded. Please wait a moment before trying again.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate recipe from image. Please try again.' },
      { status: 500 }
    );
  }
}