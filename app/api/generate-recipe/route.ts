import { NextRequest, NextResponse } from 'next/server';
import { generateRecipeWithAI, validateAnthropicConfig } from '@/lib/claude';
import { generateId, formatDate } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required form data
    const requiredFields = ['familySize', 'availableTime', 'cookingSituation'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if Claude is configured
    if (!validateAnthropicConfig()) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured. Please add ANTHROPIC_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    // Generate recipe using AI
    const aiRecipe = await generateRecipeWithAI(formData);
    
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
      situation: aiRecipe.situation || formData.cookingSituation,
      ingredients: aiRecipe.ingredients,
      instructions: aiRecipe.instructions,
      tips: aiRecipe.tips,
      notes: aiRecipe.notes || '',
      dateAdded: formatDate(new Date())
    };

    return NextResponse.json({
      success: true,
      recipe
    });

  } catch (error) {
    console.error('Recipe generation error:', error);
    
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
      { success: false, error: 'Failed to generate recipe. Please try again.' },
      { status: 500 }
    );
  }
}