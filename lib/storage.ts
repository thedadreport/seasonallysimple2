import { Recipe, MealPlan } from '@/types';

const RECIPES_KEY = 'seasonally-simple-recipes';
const MEAL_PLANS_KEY = 'seasonally-simple-meal-plans';
const CALENDAR_KEY = 'seasonally-simple-calendar';

// Recipe storage functions
export const getRecipes = (): Recipe[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECIPES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
};

export const saveRecipes = (recipes: Recipe[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes:', error);
  }
};

export const addRecipe = (recipe: Recipe): void => {
  const recipes = getRecipes();
  recipes.unshift(recipe); // Add to beginning
  saveRecipes(recipes);
};

export const updateRecipe = (id: string, updates: Partial<Recipe>): void => {
  const recipes = getRecipes();
  const index = recipes.findIndex(r => r.id === id);
  if (index !== -1) {
    recipes[index] = { ...recipes[index], ...updates };
    saveRecipes(recipes);
  }
};

export const deleteRecipe = (id: string): void => {
  const recipes = getRecipes();
  const filtered = recipes.filter(r => r.id !== id);
  saveRecipes(filtered);
};

// Meal plan storage functions
export const getMealPlans = (): MealPlan[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(MEAL_PLANS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading meal plans:', error);
    return [];
  }
};

export const saveMealPlans = (mealPlans: MealPlan[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(mealPlans));
  } catch (error) {
    console.error('Error saving meal plans:', error);
  }
};

export const addMealPlan = (mealPlan: MealPlan): void => {
  const mealPlans = getMealPlans();
  mealPlans.unshift(mealPlan); // Add to beginning
  saveMealPlans(mealPlans);
};

export const updateMealPlan = (id: string, updates: Partial<MealPlan>): void => {
  const mealPlans = getMealPlans();
  const index = mealPlans.findIndex(mp => mp.id === id);
  if (index !== -1) {
    mealPlans[index] = { ...mealPlans[index], ...updates };
    saveMealPlans(mealPlans);
  }
};

export const deleteMealPlan = (id: string): void => {
  const mealPlans = getMealPlans();
  const filtered = mealPlans.filter(mp => mp.id !== id);
  saveMealPlans(filtered);
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calendar assignment storage functions
export const getCalendarAssignments = (): Record<string, Recipe> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(CALENDAR_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading calendar assignments:', error);
    return {};
  }
};

export const saveCalendarAssignments = (assignments: Record<string, Recipe>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error('Error saving calendar assignments:', error);
  }
};

export const assignRecipeToDate = (dateKey: string, recipe: Recipe): void => {
  const assignments = getCalendarAssignments();
  assignments[dateKey] = recipe;
  saveCalendarAssignments(assignments);
};

export const removeRecipeFromDate = (dateKey: string): void => {
  const assignments = getCalendarAssignments();
  delete assignments[dateKey];
  saveCalendarAssignments(assignments);
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 21) return '2 weeks ago';
  if (diffDays < 28) return '3 weeks ago';
  return `${Math.floor(diffDays / 7)} weeks ago`;
};