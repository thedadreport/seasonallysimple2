import { NextRequest, NextResponse } from 'next/server';
import { generateMealPlanWithAI, validateAnthropicConfig } from '@/lib/claude';
import { generateId, formatDate } from '@/lib/storage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getPrismaClient } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Get user session for meal plan history
    const session = await getServerSession(authOptions);
    let recentMealPlans: any[] = [];
    
    if (session?.user?.email) {
      const prisma = getPrismaClient();
      if (prisma) {
        try {
          // Get the last 3 meal plans for the user (to avoid repetition)
          const userMealPlans = await prisma.mealPlan.findMany({
            where: {
              user: {
                email: session.user.email
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 3,
            select: {
              title: true,
              content: true,
              createdAt: true,
            }
          });

          // Transform the data for the AI
          recentMealPlans = userMealPlans.map(plan => {
            const content = plan.content as any;
            return {
              title: plan.title,
              meals: content.meals || [],
              createdAt: new Date(plan.createdAt).toLocaleDateString()
            };
          });
        } catch (error) {
          console.error('Error fetching user meal plan history:', error);
          // Continue without meal plan history if there's an error
        }
      }
    }
    
    // Validate required form data
    const requiredFields = ['planningFocus', 'numDinners', 'familySize', 'weeklyBudget', 'prepTime', 'skillLevel'];
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

    // Generate meal plan using AI with meal plan history
    const aiMealPlan = await generateMealPlanWithAI({
      ...formData,
      userId: session?.user?.email || undefined,
      recentMealPlans
    });
    
    // Format meal plan for frontend compatibility
    const mealPlan = {
      id: generateId(),
      title: aiMealPlan.title,
      description: aiMealPlan.description,
      totalCost: aiMealPlan.totalCost,
      prepTime: aiMealPlan.prepTime,
      servings: aiMealPlan.servings,
      focus: aiMealPlan.focus || formData.planningFocus,
      numMeals: aiMealPlan.numMeals || formData.numDinners,
      meals: aiMealPlan.meals,
      shoppingList: aiMealPlan.shoppingList,
      prepSchedule: aiMealPlan.prepSchedule,
      notes: aiMealPlan.notes || '',
      dateAdded: formatDate(new Date())
    };

    return NextResponse.json({
      success: true,
      mealPlan
    });

  } catch (error) {
    console.error('Meal plan generation error:', error);
    
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
          { success: false, error: 'AI returned invalid meal plan format' },
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
      { success: false, error: 'Failed to generate meal plan. Please try again.' },
      { status: 500 }
    );
  }
}