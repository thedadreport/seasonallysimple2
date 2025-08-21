// Anthropic API integration
// This file will be used when we add the actual API integration

export interface AnthropicConfig {
  apiKey: string;
  maxTokens?: number;
  model?: string;
}

export interface RecipeGenerationRequest {
  situation: string;
  userProfile: {
    adults: number;
    kids: number;
    dietaryPrefs: string[];
    timeAvailable: string;
    cookingLevel: string;
    ingredients: string;
    cookingMethod: string;
    seasonal: boolean;
    cuisine: string;
    mealType: string;
  };
}

export interface MealPlanGenerationRequest {
  planType: string;
  weeklyProfile: {
    adults: number;
    kids: number;
    kidAges: string;
    cookingLevel: string;
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
  };
}

// TODO: Implement actual Anthropic client
export class AnthropicClient {
  private config: AnthropicConfig;

  constructor(config: AnthropicConfig) {
    this.config = config;
  }

  async generateRecipe(request: RecipeGenerationRequest) {
    // TODO: Implement actual API call
    throw new Error('Anthropic integration not yet implemented');
  }

  async generateMealPlan(request: MealPlanGenerationRequest) {
    // TODO: Implement actual API call
    throw new Error('Anthropic integration not yet implemented');
  }
}

// Prompt templates for consistent AI responses
export const RECIPE_PROMPT_TEMPLATES = {
  general: `Create a family recipe for {adults} adults and {kids} kids...`,
  'protein-random': `I need help creating a dinner recipe with what I have on hand...`,
  'stretch-protein': `I need to stretch a small amount of protein to feed more people...`,
  'tomorrow-lunch': `I need to cook dinner tonight that will also provide good leftovers...`,
  'one-pot': `I need a complete dinner that can be made in one pot...`,
  'dump-bake': `I need a complete dinner that can be made on one sheet pan...`
};

export const MEAL_PLAN_PROMPT_TEMPLATES = {
  general: `I need help planning dinners for my family this week...`,
  budget: `I need to create a weekly meal plan that keeps my grocery costs as low as possible...`,
  'time-saving': `I need a weekly meal plan focused on saving time during busy weeknights...`
};