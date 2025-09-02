import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getPrismaClient } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 503 }
      );
    }

    // Get the last 3 meal plans for the user (to avoid repetition)
    const recentMealPlans = await prisma.mealPlan.findMany({
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

    // Transform the data to match the expected format
    const formattedMealPlans = recentMealPlans.map(plan => {
      const content = plan.content as any;
      return {
        title: plan.title,
        meals: content.meals || [],
        createdAt: new Date(plan.createdAt).toLocaleDateString()
      };
    });

    return NextResponse.json({
      success: true,
      recentMealPlans: formattedMealPlans
    });

  } catch (error) {
    console.error('Error fetching user meal plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meal plans' },
      { status: 500 }
    );
  }
}