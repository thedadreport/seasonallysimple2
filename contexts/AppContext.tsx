'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Recipe, MealPlan, AppState, AppContextType, Subscription, UsageStats, SubscriptionLimits, UserPreferences } from '@/types';
import {
  apiGetRecipes,
  apiCreateRecipe,
  apiUpdateRecipe,
  apiDeleteRecipe,
  apiGetMealPlans,
  apiCreateMealPlan,
  apiUpdateMealPlan,
  apiDeleteMealPlan,
  apiGetSubscription,
  apiUpdateSubscription,
  apiGetUsage,
  apiIncrementUsage,
} from '@/lib/api';
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

// Action types
type AppAction =
  | { type: 'LOAD_DATA'; payload: { recipes: Recipe[]; mealPlans: MealPlan[]; subscription: Subscription; usage: UsageStats; preferences: UserPreferences | null } }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: { id: string; updates: Partial<Recipe> } }
  | { type: 'DELETE_RECIPE'; payload: string }
  | { type: 'ADD_MEAL_PLAN'; payload: MealPlan }
  | { type: 'UPDATE_MEAL_PLAN'; payload: { id: string; updates: Partial<MealPlan> } }
  | { type: 'DELETE_MEAL_PLAN'; payload: string }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: Subscription }
  | { type: 'UPDATE_USAGE'; payload: UsageStats }
  | { type: 'UPDATE_PREFERENCES'; payload: UserPreferences }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  recipes: [],
  mealPlans: [],
  subscription: {
    tier: 'pro',
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
  preferences: null,
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
        preferences: action.payload.preferences,
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

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: action.payload,
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
  const { data: session, status } = useSession();

  // Load data when session is available
  useEffect(() => {
    const loadData = async () => {
      if (status === 'loading') return; // Still loading session
      
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        if (session?.user) {
          // User is signed in - load from database with localStorage fallback
          const [dbRecipes, dbMealPlans, dbSubscription, dbUsage, dbPreferences] = await Promise.all([
            apiGetRecipes().catch((error) => {
              console.warn('Failed to load recipes from database, will merge with localStorage:', error);
              return [];
            }),
            apiGetMealPlans().catch((error) => {
              console.warn('Failed to load meal plans from database, will merge with localStorage:', error);
              return [];
            }),
            apiGetSubscription().catch(() => ({ tier: 'pro' as const, status: 'active' as const, startDate: new Date().toISOString(), endDate: null, autoRenew: false })),
            apiGetUsage().catch(() => ({ recipesGenerated: 0, mealPlansGenerated: 0, currentMonth: new Date().toISOString().slice(0, 7), lastReset: new Date().toISOString() })),
            fetch('/api/preferences').then(res => res.json()).then(data => data.success ? data.preferences : null).catch(() => null)
          ]);
          
          // For signed-in users, ONLY use database data to ensure data isolation
          console.log('AppContext: Loaded user-specific database data:', {
            dbRecipes: dbRecipes.length,
            dbMealPlans: dbMealPlans.length,
            user: session?.user?.email
          });
          
          // Clear localStorage to prevent data leakage between users
          if (typeof window !== 'undefined') {
            localStorage.removeItem('seasonally-simple-recipes');
            localStorage.removeItem('seasonally-simple-meal-plans');
            console.log('AppContext: Cleared localStorage to prevent data leakage');
          }
          
          dispatch({ type: 'LOAD_DATA', payload: { 
            recipes: dbRecipes, 
            mealPlans: dbMealPlans, 
            subscription: dbSubscription, 
            usage: dbUsage,
            preferences: dbPreferences
          } });
        } else {
          // User is not signed in - load from localStorage for demo/offline usage
          const recipes = getRecipes();
          const mealPlans = getMealPlans();
          const subscription = getSubscription();
          const usage = getUsageStats();
          console.log('AppContext: Loaded localStorage data:', {
            recipes: recipes.length,
            mealPlans: mealPlans.length
          });
          dispatch({ type: 'LOAD_DATA', payload: { recipes, mealPlans, subscription, usage, preferences: null } });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved data' });
      }
    };

    loadData();
  }, [session, status]);

  // Action creators
  const addRecipe = async (recipe: Recipe) => {
    try {
      console.log('AppContext: Starting to save recipe:', recipe.title);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (session?.user) {
        console.log('AppContext: User is signed in, using database API');
        // Use database API only - no localStorage fallback to ensure data isolation
        const savedRecipe = await apiCreateRecipe(recipe);
        dispatch({ type: 'ADD_RECIPE', payload: savedRecipe });
        console.log('AppContext: Recipe saved to database successfully');
      } else {
        console.log('AppContext: No user session, using localStorage');
        // Use localStorage
        saveRecipe(recipe);
        dispatch({ type: 'ADD_RECIPE', payload: recipe });
        console.log('AppContext: Recipe saved to localStorage successfully');
      }
    } catch (error) {
      console.error('AppContext: Error saving recipe:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to save recipe' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (session?.user) {
        // Use database API
        const updatedRecipe = await apiUpdateRecipe(id, updates);
        dispatch({ type: 'UPDATE_RECIPE', payload: { id, updates: updatedRecipe } });
      } else {
        // Use localStorage
        saveRecipeUpdate(id, updates);
        dispatch({ type: 'UPDATE_RECIPE', payload: { id, updates } });
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update recipe' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (session?.user) {
        // Use database API
        await apiDeleteRecipe(id);
        dispatch({ type: 'DELETE_RECIPE', payload: id });
      } else {
        // Use localStorage
        removeRecipe(id);
        dispatch({ type: 'DELETE_RECIPE', payload: id });
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete recipe' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addMealPlan = async (mealPlan: MealPlan) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (session?.user) {
        // Use database API
        const savedMealPlan = await apiCreateMealPlan(mealPlan);
        dispatch({ type: 'ADD_MEAL_PLAN', payload: savedMealPlan });
      } else {
        // Use localStorage
        saveMealPlan(mealPlan);
        dispatch({ type: 'ADD_MEAL_PLAN', payload: mealPlan });
      }
    } catch (error) {
      console.error('Error saving meal plan:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to save meal plan' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateMealPlan = async (id: string, updates: Partial<MealPlan>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (session?.user) {
        // Use database API
        const updatedMealPlan = await apiUpdateMealPlan(id, updates);
        dispatch({ type: 'UPDATE_MEAL_PLAN', payload: { id, updates: updatedMealPlan } });
      } else {
        // Use localStorage
        saveMealPlanUpdate(id, updates);
        dispatch({ type: 'UPDATE_MEAL_PLAN', payload: { id, updates } });
      }
    } catch (error) {
      console.error('Error updating meal plan:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update meal plan' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (session?.user) {
        // Use database API
        await apiDeleteMealPlan(id);
        dispatch({ type: 'DELETE_MEAL_PLAN', payload: id });
      } else {
        // Use localStorage
        removeMealPlan(id);
        dispatch({ type: 'DELETE_MEAL_PLAN', payload: id });
      }
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete meal plan' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // Subscription methods
  const incrementRecipeUsage = async (): Promise<boolean> => {
    try {
      if (!canGenerateRecipe(state.subscription, state.usage)) {
        return false;
      }
      
      if (session?.user) {
        try {
          // Try database API first
          const updatedUsage = await apiIncrementUsage('recipe');
          dispatch({ type: 'UPDATE_USAGE', payload: updatedUsage });
        } catch (apiError) {
          console.warn('Database API failed, falling back to localStorage:', apiError);
          // Fallback to localStorage if database API fails
          const updatedUsage = incrementRecipeUsageStorage();
          dispatch({ type: 'UPDATE_USAGE', payload: updatedUsage });
        }
      } else {
        // Use localStorage
        const updatedUsage = incrementRecipeUsageStorage();
        dispatch({ type: 'UPDATE_USAGE', payload: updatedUsage });
      }
      return true;
    } catch (error) {
      console.error('Error updating usage:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update usage' });
      return false;
    }
  };

  const incrementMealPlanUsage = async (): Promise<boolean> => {
    try {
      if (!canGenerateMealPlan(state.subscription, state.usage)) {
        return false;
      }
      
      if (session?.user) {
        try {
          // Try database API first
          const updatedUsage = await apiIncrementUsage('mealPlan');
          dispatch({ type: 'UPDATE_USAGE', payload: updatedUsage });
        } catch (apiError) {
          console.warn('Database API failed, falling back to localStorage:', apiError);
          // Fallback to localStorage if database API fails
          const updatedUsage = incrementMealPlanUsageStorage();
          dispatch({ type: 'UPDATE_USAGE', payload: updatedUsage });
        }
      } else {
        // Use localStorage
        const updatedUsage = incrementMealPlanUsageStorage();
        dispatch({ type: 'UPDATE_USAGE', payload: updatedUsage });
      }
      return true;
    } catch (error) {
      console.error('Error updating usage:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update usage' });
      return false;
    }
  };

  const updateSubscription = async (subscription: Subscription) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (session?.user) {
        try {
          // Try database API first
          const updatedSubscription = await apiUpdateSubscription(subscription);
          dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: updatedSubscription });
        } catch (apiError) {
          console.warn('Database API failed, falling back to localStorage:', apiError);
          // Fallback to localStorage if database API fails
          saveSubscription(subscription);
          dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: subscription });
        }
      } else {
        // Use localStorage
        saveSubscription(subscription);
        dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: subscription });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update subscription' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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

  const refreshUserData = async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch('/api/preferences');
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: data.preferences });
      }
    } catch (error) {
      console.error('Error refreshing user preferences:', error);
    }
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
    refreshUserData,
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