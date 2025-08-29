import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Subscription, SubscriptionTier } from '@/types';
import { prisma } from '@/lib/prisma';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

// GET /api/subscription - Get user's subscription
export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If no subscription exists, create a free tier
    if (!user.subscription) {
      const dbSubscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          tier: 'free',
          status: 'active',
          currentPeriodStart: new Date(),
        },
      });

      const subscription: Subscription = {
        tier: dbSubscription.tier as SubscriptionTier,
        status: dbSubscription.status as any,
        startDate: dbSubscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
        endDate: dbSubscription.currentPeriodEnd?.toISOString() || null,
        autoRenew: !dbSubscription.cancelAtPeriodEnd,
      };

      return NextResponse.json({ subscription });
    }

    // Transform database subscription to frontend format
    const subscription: Subscription = {
      tier: user.subscription.tier as SubscriptionTier,
      status: user.subscription.status as any,
      startDate: user.subscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
      endDate: user.subscription.currentPeriodEnd?.toISOString() || null,
      autoRenew: !user.subscription.cancelAtPeriodEnd,
    };

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/subscription - Update user's subscription
export async function PUT(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }
    
    const session = await getServerSession(authOptions);
    
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

    const subscriptionData: Subscription = await request.json();

    // Update or create subscription
    const dbSubscription = await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        tier: subscriptionData.tier,
        status: subscriptionData.status,
        currentPeriodStart: subscriptionData.startDate ? new Date(subscriptionData.startDate) : undefined,
        currentPeriodEnd: subscriptionData.endDate ? new Date(subscriptionData.endDate) : null,
        cancelAtPeriodEnd: !subscriptionData.autoRenew,
      },
      create: {
        userId: user.id,
        tier: subscriptionData.tier,
        status: subscriptionData.status,
        currentPeriodStart: subscriptionData.startDate ? new Date(subscriptionData.startDate) : new Date(),
        currentPeriodEnd: subscriptionData.endDate ? new Date(subscriptionData.endDate) : null,
        cancelAtPeriodEnd: !subscriptionData.autoRenew,
      },
    });

    // Transform back to frontend format
    const subscription: Subscription = {
      tier: dbSubscription.tier as SubscriptionTier,
      status: dbSubscription.status as any,
      startDate: dbSubscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
      endDate: dbSubscription.currentPeriodEnd?.toISOString() || null,
      autoRenew: !dbSubscription.cancelAtPeriodEnd,
    };

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}