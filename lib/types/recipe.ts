export interface UserProfile {
  adults: number;
  kids: number;
  dietaryPrefs: string[];
  timeAvailable: string;
  cookingLevel: CookingLevel;
  ingredients: string;
  cookingMethod: string;
  seasonal: boolean;
  cuisine: string;
  mealType: string;
}

export interface Recipe {
  id: string;
  title: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  notes: string;
  isFavorite: boolean;
  cookingMethod?: string;
  seasonal?: boolean;
  cuisine?: string;
  mealType?: string;
  situation?: string;
  createdAt: Date;
}

export interface SituationOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  subtitle: string;
}

export interface TimeOption {
  value: string;
  label: string;
  desc: string;
  icon: string;
}

export type CookingLevel = 'beginner' | 'intermediate' | 'advanced';

export interface MealType {
  value: string;
  label: string;
  desc: string;
  icon: string;
}

export interface CookingMethod {
  value: string;
  label: string;
  desc: string;
  icon: string;
}

export interface Cuisine {
  value: string;
  label: string;
  desc: string;
  icon: string;
}

export interface WeeklyProfile {
  adults: number;
  kids: number;
  kidAges: string;
  cookingLevel: CookingLevel;
  dinnersNeeded: number;
  weeknightTimeLimit: number;
  prepTimeAvailable: number;
  proteins: string;
  kitchenEquipment: string[];
  shoppingFrequency: string;
  weeklyBudget: string;
  dietaryRestrictions: string[];
  cuisinePreference: string;
  prepMethods: string[];
}

export interface DayMeal {
  day: string;
  title: string;
  description: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients?: string[];
  instructions?: string[];
  tips?: string[];
  prepAhead?: string[];
  isExpanded?: boolean;
}

export interface ShoppingItem {
  item: string;
  quantity: string;
  estimatedCost?: string;
}

export interface ShoppingSection {
  section: string;
  items: ShoppingItem[];
}

export interface PrepTask {
  day: string;
  tasks: string[];
  timeNeeded: string;
}

export interface MealPlan {
  id: string;
  planType: string;
  meals: DayMeal[];
  shoppingList: ShoppingSection[];
  totalCost?: string;
  prepSchedule?: PrepTask[];
  notes: string;
  createdAt: Date;
}