import { Recipe, MealPlan, Subscription, UsageStats } from '@/types';

// API client for database operations

// Recipe API functions
export const apiGetRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch('/api/recipes');
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to access your recipes');
    }
    throw new Error('Failed to fetch recipes');
  }
  
  const data = await response.json();
  return data.recipes;
};

export const apiCreateRecipe = async (recipe: Recipe): Promise<Recipe> => {
  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to save recipes');
    }
    throw new Error('Failed to save recipe');
  }

  const data = await response.json();
  return data.recipe;
};

export const apiUpdateRecipe = async (id: string, updates: Partial<Recipe>): Promise<Recipe> => {
  const response = await fetch(`/api/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to edit recipes');
    }
    if (response.status === 404) {
      throw new Error('Recipe not found');
    }
    throw new Error('Failed to update recipe');
  }

  const data = await response.json();
  return data.recipe;
};

export const apiDeleteRecipe = async (id: string): Promise<void> => {
  const response = await fetch(`/api/recipes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to delete recipes');
    }
    if (response.status === 404) {
      throw new Error('Recipe not found');
    }
    throw new Error('Failed to delete recipe');
  }
};

// Meal Plan API functions
export const apiGetMealPlans = async (): Promise<MealPlan[]> => {
  const response = await fetch('/api/meal-plans');
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to access your meal plans');
    }
    throw new Error('Failed to fetch meal plans');
  }
  
  const data = await response.json();
  return data.mealPlans;
};

export const apiCreateMealPlan = async (mealPlan: MealPlan): Promise<MealPlan> => {
  const response = await fetch('/api/meal-plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mealPlan),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to save meal plans');
    }
    throw new Error('Failed to save meal plan');
  }

  const data = await response.json();
  return data.mealPlan;
};

export const apiUpdateMealPlan = async (id: string, updates: Partial<MealPlan>): Promise<MealPlan> => {
  const response = await fetch(`/api/meal-plans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to edit meal plans');
    }
    if (response.status === 404) {
      throw new Error('Meal plan not found');
    }
    throw new Error('Failed to update meal plan');
  }

  const data = await response.json();
  return data.mealPlan;
};

export const apiDeleteMealPlan = async (id: string): Promise<void> => {
  const response = await fetch(`/api/meal-plans/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to delete meal plans');
    }
    if (response.status === 404) {
      throw new Error('Meal plan not found');
    }
    throw new Error('Failed to delete meal plan');
  }
};

// Subscription API functions
export const apiGetSubscription = async (): Promise<Subscription> => {
  const response = await fetch('/api/subscription');
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to access subscription');
    }
    throw new Error('Failed to fetch subscription');
  }
  
  const data = await response.json();
  return data.subscription;
};

export const apiUpdateSubscription = async (subscription: Subscription): Promise<Subscription> => {
  const response = await fetch('/api/subscription', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to update subscription');
    }
    throw new Error('Failed to update subscription');
  }

  const data = await response.json();
  return data.subscription;
};

// Usage API functions
export const apiGetUsage = async (): Promise<UsageStats> => {
  const response = await fetch('/api/usage');
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to access usage stats');
    }
    throw new Error('Failed to fetch usage stats');
  }
  
  const data = await response.json();
  return data.usage;
};

export const apiIncrementUsage = async (type: 'recipe' | 'mealPlan'): Promise<UsageStats> => {
  const response = await fetch('/api/usage', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please sign in to track usage');
    }
    throw new Error('Failed to update usage stats');
  }

  const data = await response.json();
  return data.usage;
};