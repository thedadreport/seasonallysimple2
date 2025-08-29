// Core data models for the application

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  servings: string;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  cost?: string;
  tags: string[];
  situation: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  dateAdded: string;
  notes: string;
  feedback?: string | null; // 'thumbs_up', 'thumbs_down', or null
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  totalCost: string;
  prepTime: string;
  servings: string;
  focus: string;
  numMeals: number;
  meals: MealPlanDay[];
  shoppingList: ShoppingList;
  prepSchedule: string[];
  dateAdded: string;
  notes: string;
}

export interface MealPlanDay {
  day: string;
  recipe: string;
  main?: string; // Main dish name
  sides?: string[]; // Array of side dish names
  prepTime: string;
  cookTime: string;
  cost: string;
  ingredients: string[];
  prepNotes: string;
}

export interface ShoppingList {
  [category: string]: string[];
}

// Form data interfaces
export interface RecipeFormData {
  familySize: string;
  availableTime: string;
  cookingSituation: string;
  protein: string;
  vegetables: string;
  dietaryRestrictions: string[];
}

export interface MealPlanFormData {
  planningFocus: string;
  numDinners: number;
  familySize: string;
  weeklyBudget: string;
  prepTime: string;
  skillLevel: string;
  dietaryRestrictions: string[];
  pantryItems: string;
}

// Subscription interfaces
export type SubscriptionTier = 'free' | 'pro' | 'family';

export interface Subscription {
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
}

export interface UsageStats {
  recipesGenerated: number;
  mealPlansGenerated: number;
  currentMonth: string; // YYYY-MM format
  lastReset: string;
}

export interface SubscriptionLimits {
  recipesPerMonth: number;
  mealPlansPerMonth: number;
  canEditRecipes: boolean;
  canAccessMealPlans: boolean;
  canSaveUnlimited: boolean;
}

export interface UserPreferences {
  cookingSkill: string;
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  cookingMethods: string[];
  useSeasonalIngredients: boolean;
  cookingStyle?: string;
}

// Context interfaces
export interface AppState {
  recipes: Recipe[];
  mealPlans: MealPlan[];
  subscription: Subscription;
  usage: UsageStats;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppContextType extends AppState {
  addRecipe: (recipe: Recipe) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  addMealPlan: (mealPlan: MealPlan) => Promise<void>;
  updateMealPlan: (id: string, updates: Partial<MealPlan>) => Promise<void>;
  deleteMealPlan: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Subscription methods
  incrementRecipeUsage: () => Promise<boolean>;
  incrementMealPlanUsage: () => Promise<boolean>;
  updateSubscription: (subscription: Subscription) => Promise<void>;
  getSubscriptionLimits: () => SubscriptionLimits;
  canGenerateRecipe: () => boolean;
  canGenerateMealPlan: () => boolean;
  canEditRecipe: () => boolean;
  refreshUserData: () => Promise<void>;
}