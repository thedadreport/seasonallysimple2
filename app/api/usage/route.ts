import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { UsageStats } from '@/types';
import { prisma } from '@/lib/prisma';

// GET /api/usage - Get user's current usage stats
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

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    // Get or create current month usage stats
    const dbUsageStats = await prisma.usageStats.upsert({
      where: {
        userId_month: {
          userId: user.id,
          month: currentMonth,
        },
      },
      update: {},
      create: {
        userId: user.id,
        month: currentMonth,
        recipesGenerated: 0,
        mealPlansGenerated: 0,
      },
    });

    // Transform to frontend format
    const usage: UsageStats = {
      recipesGenerated: dbUsageStats.recipesGenerated,
      mealPlansGenerated: dbUsageStats.mealPlansGenerated,
      currentMonth: dbUsageStats.month,
      lastReset: dbUsageStats.lastReset.toISOString(),
    };

    return NextResponse.json({ usage });
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/usage - Update usage stats (increment counters)
export async function PUT(request: NextRequest) {
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

    const { type }: { type: 'recipe' | 'mealPlan' } = await request.json();

    if (!type || !['recipe', 'mealPlan'].includes(type)) {
      return NextResponse.json({ error: 'Invalid usage type' }, { status: 400 });
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    // Update usage stats
    const dbUsageStats = await prisma.usageStats.upsert({
      where: {
        userId_month: {
          userId: user.id,
          month: currentMonth,
        },
      },
      update: {
        ...(type === 'recipe' && { recipesGenerated: { increment: 1 } }),
        ...(type === 'mealPlan' && { mealPlansGenerated: { increment: 1 } }),
      },
      create: {
        userId: user.id,
        month: currentMonth,
        recipesGenerated: type === 'recipe' ? 1 : 0,
        mealPlansGenerated: type === 'mealPlan' ? 1 : 0,
      },
    });

    // Transform to frontend format
    const usage: UsageStats = {
      recipesGenerated: dbUsageStats.recipesGenerated,
      mealPlansGenerated: dbUsageStats.mealPlansGenerated,
      currentMonth: dbUsageStats.month,
      lastReset: dbUsageStats.lastReset.toISOString(),
    };

    return NextResponse.json({ usage });
  } catch (error) {
    console.error('Error updating usage stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}