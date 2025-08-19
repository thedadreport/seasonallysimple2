'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { Recipe, MealPlan, AppState, AppContextType, Subscription, UsageStats, SubscriptionLimits } from '@/types';
import {
  getRecipes,
  getMealPlans,
  addRecipe as saveRecipe,
  updateRecipe as saveRecipeUpdate,
  deleteRecipe as removeRecipe,
  addMealPlan as saveMealPlan,
  updateMealPlan as saveMealPlanUpdate,
  deleteMealPlan as removeMealPlan,
} from '@/lib/storage';
import {
  getSubscription,
  getUsageStats,
  saveSubscription,
  saveUsageStats,
  incrementRecipeUsage as incrementRecipeUsageStorage,
  incrementMealPlanUsage as incrementMealPlanUsageStorage,
  canGenerateRecipe,
  canGenerateMealPlan,
  canEditRecipe,
  getSubscriptionLimits,
} from '@/lib/subscription';

// Action types
type AppAction =
  | { type: 'LOAD_DATA'; payload: { recipes: Recipe[]; mealPlans: MealPlan[]; subscription: Subscription; usage: UsageStats } }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: { id: string; updates: Partial<Recipe> } }
  | { type: 'DELETE_RECIPE'; payload: string }
  | { type: 'ADD_MEAL_PLAN'; payload: MealPlan }
  | { type: 'UPDATE_MEAL_PLAN'; payload: { id: string; updates: Partial<MealPlan> } }
  | { type: 'DELETE_MEAL_PLAN'; payload: string }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: Subscription }
  | { type: 'UPDATE_USAGE'; payload: UsageStats }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  recipes: [],
  mealPlans: [],
  subscription: {
    tier: 'free',
    status: 'active', 
    startDate: new Date().toISOString(),
    endDate: null,
    autoRenew: false,
  },
  usage: {
    recipesGenerated: 0,
    mealPlansGenerated: 0,
    currentMonth: new Date().toISOString().slice(0, 7),
    lastReset: new Date().toISOString(),
  },
  isLoading: false,
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        recipes: action.payload.recipes,
        mealPlans: action.payload.mealPlans,
        subscription: action.payload.subscription,
        usage: action.payload.usage,
        isLoading: false,
      };

    case 'ADD_RECIPE':
      return {
        ...state,
        recipes: [action.payload, ...state.recipes],
      };

    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id
            ? { ...recipe, ...action.payload.updates }
            : recipe
        ),
      };

    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload),
      };

    case 'ADD_MEAL_PLAN':
      return {
        ...state,
        mealPlans: [action.payload, ...state.mealPlans],
      };

    case 'UPDATE_MEAL_PLAN':
      return {
        ...state,
        mealPlans: state.mealPlans.map(plan =>
          plan.id === action.payload.id
            ? { ...plan, ...action.payload.updates }
            : plan
        ),
      };

    case 'DELETE_MEAL_PLAN':
      return {
        ...state,
        mealPlans: state.mealPlans.filter(plan => plan.id !== action.payload),
      };

    case 'UPDATE_SUBSCRIPTION':
      return {
        ...state,
        subscription: action.payload,
      };

    case 'UPDATE_USAGE':
      return {
        ...state,
        usage: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data on mount
  useEffect(() => {
    try {
      const recipes = getRecipes();
      const mealPlans = getMealPlans();
      const subscription = getSubscription();
      const usage = getUsageStats();
      dispatch({ type: 'LOAD_DATA', payload: { recipes, mealPlans, subscription, usage } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved data' });
    }
  }, []);

  // Action creators
  const addRecipe = (recipe: Recipe) => {
    try {
      saveRecipe(recipe);
      dispatch({ type: 'ADD_RECIPE', payload: recipe });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save recipe' });
    }
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    try {
      saveRecipeUpdate(id, updates);
      dispatch({ type: 'UPDATE_RECIPE', payload: { id, updates } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update recipe' });
    }
  };

  const deleteRecipe = (id: string) => {
    try {
      removeRecipe(id);
      dispatch({ type: 'DELETE_RECIPE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete recipe' });
    }
  };

  const addMealPlan = (mealPlan: MealPlan) => {
    try {
      saveMealPlan(mealPlan);
      dispatch({ type: 'ADD_MEAL_PLAN', payload: mealPlan });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save meal plan' });
    }
  };

  const updateMealPlan = (id: string, updates: Partial<MealPlan>) => {
    try {
      saveMealPlanUpdate(id, updates);
      dispatch({ type: 'UPDATE_MEAL_PLAN', payload: { id, updates } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update meal plan' });
    }
  };

  const deleteMealPlan = (id: string) => {
    try {
      removeMealPlan(id);
      dispatch({ type: 'DELETE_MEAL_PLAN', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete meal plan' });
    }
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // Subscription methods
  const incrementRecipeUsage = (): boolean => {
    try {
      if (!canGenerateRecipe(state.subscription, state.usage)) {
        return false;
      }
      const updatedUsage = incrementRecipeUsageStorage();
      dispatch({ type: 'UPDATE_USAGE', payload: updatedUsage });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update usage' });
      return false;
    }
  };

  const incrementMealPlanUsage = (): boolean => {
    try {
      if (!canGenerateMealPlan(state.subscription, state.usage)) {
        return false;
      }
      const updatedUsage = incrementMealPlanUsageStorage();
      dispatch({ type: 'UPDATE_USAGE', payload: updatedUsage });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update usage' });
      return false;
    }
  };

  const updateSubscription = (subscription: Subscription) => {
    try {
      saveSubscription(subscription);
      dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: subscription });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update subscription' });
    }
  };

  const getSubscriptionLimitsMethod = (): SubscriptionLimits => {
    return getSubscriptionLimits(state.subscription);
  };

  const canGenerateRecipeMethod = (): boolean => {
    return canGenerateRecipe(state.subscription, state.usage);
  };

  const canGenerateMealPlanMethod = (): boolean => {
    return canGenerateMealPlan(state.subscription, state.usage);
  };

  const canEditRecipeMethod = (): boolean => {
    return canEditRecipe(state.subscription);
  };

  const value: AppContextType = {
    ...state,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    addMealPlan,
    updateMealPlan,
    deleteMealPlan,
    setLoading,
    setError,
    incrementRecipeUsage,
    incrementMealPlanUsage,
    updateSubscription,
    getSubscriptionLimits: getSubscriptionLimitsMethod,
    canGenerateRecipe: canGenerateRecipeMethod,
    canGenerateMealPlan: canGenerateMealPlanMethod,
    canEditRecipe: canEditRecipeMethod,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};