import { Subscription, SubscriptionTier, SubscriptionLimits, UsageStats } from '@/types';

const SUBSCRIPTION_KEY = 'seasonally-simple-subscription';
const USAGE_KEY = 'seasonally-simple-usage';

// Subscription tier configurations
export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    recipesPerMonth: 5,
    mealPlansPerMonth: 0,
    canEditRecipes: false,
    canAccessMealPlans: false,
    canSaveUnlimited: false,
  },
  pro: {
    recipesPerMonth: 50,
    mealPlansPerMonth: 10,
    canEditRecipes: true,
    canAccessMealPlans: true,
    canSaveUnlimited: true,
  },
  family: {
    recipesPerMonth: 100,
    mealPlansPerMonth: 25,
    canEditRecipes: true,
    canAccessMealPlans: true,
    canSaveUnlimited: true,
  },
};

// Get current month in YYYY-MM format
export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
};

// Initialize default subscription (free tier)
export const getDefaultSubscription = (): Subscription => ({
  tier: 'free',
  status: 'active',
  startDate: new Date().toISOString(),
  endDate: null,
  autoRenew: false,
});

// Initialize default usage stats
export const getDefaultUsage = (): UsageStats => ({
  recipesGenerated: 0,
  mealPlansGenerated: 0,
  currentMonth: getCurrentMonth(),
  lastReset: new Date().toISOString(),
});

// Subscription storage functions
export const getSubscription = (): Subscription => {
  if (typeof window === 'undefined') return getDefaultSubscription();
  
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY);
    return stored ? JSON.parse(stored) : getDefaultSubscription();
  } catch (error) {
    console.error('Error loading subscription:', error);
    return getDefaultSubscription();
  }
};

export const saveSubscription = (subscription: Subscription): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
};

// Usage tracking functions
export const getUsageStats = (): UsageStats => {
  if (typeof window === 'undefined') return getDefaultUsage();
  
  try {
    const stored = localStorage.getItem(USAGE_KEY);
    const usage = stored ? JSON.parse(stored) : getDefaultUsage();
    
    // Reset usage if it's a new month
    const currentMonth = getCurrentMonth();
    if (usage.currentMonth !== currentMonth) {
      const resetUsage = {
        recipesGenerated: 0,
        mealPlansGenerated: 0,
        currentMonth,
        lastReset: new Date().toISOString(),
      };
      saveUsageStats(resetUsage);
      return resetUsage;
    }
    
    return usage;
  } catch (error) {
    console.error('Error loading usage stats:', error);
    return getDefaultUsage();
  }
};

export const saveUsageStats = (usage: UsageStats): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
  } catch (error) {
    console.error('Error saving usage stats:', error);
  }
};

// Usage increment functions
export const incrementRecipeUsage = (): UsageStats => {
  const current = getUsageStats();
  const updated = {
    ...current,
    recipesGenerated: current.recipesGenerated + 1,
  };
  saveUsageStats(updated);
  return updated;
};

export const incrementMealPlanUsage = (): UsageStats => {
  const current = getUsageStats();
  const updated = {
    ...current,
    mealPlansGenerated: current.mealPlansGenerated + 1,
  };
  saveUsageStats(updated);
  return updated;
};

// Permission check functions
export const canGenerateRecipe = (subscription: Subscription, usage: UsageStats): boolean => {
  const limits = SUBSCRIPTION_LIMITS[subscription.tier];
  return usage.recipesGenerated < limits.recipesPerMonth;
};

export const canGenerateMealPlan = (subscription: Subscription, usage: UsageStats): boolean => {
  const limits = SUBSCRIPTION_LIMITS[subscription.tier];
  return limits.canAccessMealPlans && usage.mealPlansGenerated < limits.mealPlansPerMonth;
};

export const canEditRecipe = (subscription: Subscription): boolean => {
  const limits = SUBSCRIPTION_LIMITS[subscription.tier];
  return limits.canEditRecipes;
};

// Subscription management
export const upgradeSubscription = (tier: SubscriptionTier): Subscription => {
  const subscription: Subscription = {
    tier,
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: tier === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    autoRenew: tier !== 'free',
  };
  
  saveSubscription(subscription);
  return subscription;
};

// Utility functions
export const getSubscriptionLimits = (subscription: Subscription): SubscriptionLimits => {
  return SUBSCRIPTION_LIMITS[subscription.tier];
};

export const getRemainingRecipes = (subscription: Subscription, usage: UsageStats): number => {
  const limits = SUBSCRIPTION_LIMITS[subscription.tier];
  return Math.max(0, limits.recipesPerMonth - usage.recipesGenerated);
};

export const getRemainingMealPlans = (subscription: Subscription, usage: UsageStats): number => {
  const limits = SUBSCRIPTION_LIMITS[subscription.tier];
  return Math.max(0, limits.mealPlansPerMonth - usage.mealPlansGenerated);
};

export const formatSubscriptionTier = (tier: SubscriptionTier): string => {
  switch (tier) {
    case 'free':
      return 'Free';
    case 'pro':
      return 'Pro';
    case 'family':
      return 'Family';
    default:
      return 'Unknown';
  }
};

export const getSubscriptionPrice = (tier: SubscriptionTier): string => {
  switch (tier) {
    case 'free':
      return '$0';
    case 'pro':
      return '$9.99';
    case 'family':
      return '$19.99';
    default:
      return '$0';
  }
};