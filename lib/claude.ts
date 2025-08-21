import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Retry wrapper for API calls
async function retryApiCall<T>(fn: () => Promise<T>, maxRetries = 2, delayMs = 2000): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      // Check if it's an overload error and we have retries left
      if (error.status === 529 && error.error?.error?.type === 'overloaded_error' && attempt <= maxRetries) {
        console.log(`Claude API overloaded, retrying attempt ${attempt + 1}/${maxRetries + 1} after ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt)); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  throw new Error('All retry attempts failed');
}

// Validate API key availability
export function validateAnthropicConfig(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Generate recipe using Claude
export async function generateRecipeWithAI(formData: {
  familySize: string;
  availableTime: string;
  cookingSituation: string;
  protein: string;
  vegetables: string;
  cookingMethod: string;
  cuisineType: string;
  dietaryRestrictions: string[];
  difficulty: string;
  seasonal?: boolean;
}) {
  if (!validateAnthropicConfig()) {
    throw new Error('Anthropic API key not configured');
  }

  const seasonalNote = formData.seasonal ? `
**SEASONAL FOCUS:** Use fresh, in-season ingredients and seasonal cooking themes. Consider what's fresh and available during the current season (late August) - think late summer produce like tomatoes, corn, eggplant, peppers, stone fruits, and herbs.` : '';

  const prompt = `Create a detailed, family-friendly recipe based on these requirements:

**Family Size:** ${formData.familySize}
**Available Time:** ${formData.availableTime}
**Cooking Situation:** ${formData.cookingSituation}
**Preferred Protein:** ${formData.protein}
**Vegetables to Include:** ${formData.vegetables}
**Cooking Method:** ${formData.cookingMethod}
**Cuisine Style:** ${formData.cuisineType}
**Difficulty Level:** ${formData.difficulty}
**Dietary Restrictions:** ${formData.dietaryRestrictions.join(', ') || 'None'}${seasonalNote}

Please generate a complete recipe with:
1. A creative, descriptive title
2. Brief description (2-3 sentences)
3. Cooking time (realistic estimate)
4. Servings (match family size)
5. Difficulty level (Easy/Intermediate/Advanced)
6. 3-5 relevant tags
7. Complete ingredient list with measurements
8. Step-by-step instructions
9. 3-4 helpful tips or variations
10. Personal notes or suggestions

Make it practical, achievable, and tailored to the cooking situation and method. Focus on real-world flexibility and family appeal. Ensure the recipe is specifically designed for the chosen cooking method (${formData.cookingMethod}) and reflects ${formData.cuisineType} cuisine style with appropriate flavors, ingredients, and cooking techniques. If "No Preference" is selected for cuisine, create a versatile recipe that could work for various tastes.${formData.seasonal ? ' IMPORTANT: Prioritize seasonal, fresh ingredients that are currently in peak season for the best flavors and value.' : ''}

IMPORTANT: Adjust the recipe complexity based on the difficulty level:
- **Easy**: Use simple techniques, common ingredients, minimal steps, basic seasoning. Perfect for beginners or busy weeknights.
- **Intermediate**: Include some cooking techniques like sautéing, braising, or reduction. May require 1-2 specialty ingredients or equipment.
- **Expert**: Advanced techniques like tempering, emulsification, or complex flavor building. Multiple cooking stages, specialized equipment, or restaurant-style presentations are appropriate.

Format the response as valid JSON with this exact structure:
{
  "title": "Recipe Title",
  "description": "Brief description",
  "cookTime": "XX minutes",
  "servings": "X people",
  "difficulty": "Easy|Intermediate|Advanced",
  "tags": ["tag1", "tag2", "tag3"],
  "situation": "${formData.cookingSituation}",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "tips": ["tip 1", "tip 2"],
  "notes": "Personal notes"
}`;

  try {
    const completion = await retryApiCall(() => anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.7,
      system: 'You are a professional chef and cookbook author who specializes in practical, family-friendly recipes. You understand real cooking situations and provide helpful, achievable recipes with clear instructions.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }));

    const responseText = completion.content[0]?.type === 'text' ? completion.content[0].text : null;
    if (!responseText) {
      throw new Error('No response from Claude');
    }

    // Parse JSON response
    const recipe = JSON.parse(responseText);
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'cookTime', 'servings', 'difficulty', 'tags', 'ingredients', 'instructions', 'tips'];
    for (const field of requiredFields) {
      if (!recipe[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return recipe;
  } catch (error) {
    console.error('Claude recipe generation error:', error);
    throw new Error('Failed to generate recipe with AI');
  }
}

// Generate meal plan using Claude
export async function generateMealPlanWithAI(formData: {
  planningFocus: string;
  numDinners: number;
  familySize: string;
  weeklyBudget: string;
  prepTime: string;
  skillLevel: string;
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  cookingMethods: string[];
  pantryItems: string;
}) {
  if (!validateAnthropicConfig()) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = `Create a comprehensive ${formData.numDinners}-day meal plan based on these requirements:

**Planning Focus:** ${formData.planningFocus}
**Number of Dinners:** ${formData.numDinners}
**Family Size:** ${formData.familySize}
**Weekly Budget:** ${formData.weeklyBudget}
**Available Prep Time:** ${formData.prepTime}
**Cooking Skill Level:** ${formData.skillLevel}
**Preferred Cooking Methods:** ${formData.cookingMethods.join(', ')}
**Dietary Restrictions:** ${formData.dietaryRestrictions.join(', ') || 'None'}
**Cuisine Preferences:** ${formData.cuisinePreferences.join(', ') || 'No specific preference'}
**Pantry Items Available:** ${formData.pantryItems || 'Standard pantry staples'}

Please generate a complete meal plan with:
1. Creative title reflecting the focus
2. Brief description (2-3 sentences)
3. Total estimated cost
4. Prep time summary
5. Servings info
6. Detailed meals for each day including:
   - Day name
   - Recipe name
   - Prep time
   - Cook time
   - Estimated cost
   - Key ingredients list
   - Prep notes/tips
7. Organized shopping list by category with estimated prices
8. Sunday prep schedule with time estimates
9. Personal notes or tips for success

Make it practical, budget-conscious, and achievable for the specified skill level. IMPORTANT: Distribute meals across the preferred cooking methods (${formData.cookingMethods.join(', ')}) - ensure each meal uses one of these methods with appropriate techniques, cooking times, and equipment. If cuisine preferences are specified, ensure that each meal reflects one of the preferred cuisine types (${formData.cuisinePreferences.join(', ')}) with authentic flavors, ingredients, and cooking techniques from those culinary traditions. Distribute both cooking methods and cuisines evenly across the meal plan for variety.

Format the response as valid JSON with this exact structure:
{
  "title": "Meal Plan Title",
  "description": "Brief description",
  "totalCost": "$XX",
  "prepTime": "X hours prep time",
  "servings": "X people, X dinners",
  "focus": "${formData.planningFocus}",
  "numMeals": ${formData.numDinners},
  "meals": [
    {
      "day": "Monday",
      "recipe": "Recipe Name",
      "prepTime": "X min",
      "cookTime": "X min",
      "cost": "$X",
      "ingredients": ["ingredient1", "ingredient2"],
      "prepNotes": "Prep instructions"
    }
  ],
  "shoppingList": {
    "Proteins": ["item ($X)", "item ($X)"],
    "Produce": ["item ($X)", "item ($X)"],
    "Pantry": ["item ($X)", "item ($X)"],
    "Dairy": ["item ($X)", "item ($X)"]
  },
  "prepSchedule": [
    "Task description (X min)",
    "Task description (X min)"
  ],
  "notes": "Success tips and notes"
}`;

  try {
    const completion = await retryApiCall(() => anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      temperature: 0.7,
      system: 'You are a meal planning expert and nutritionist who specializes in practical, budget-friendly meal plans for busy families. You understand real-world constraints and provide achievable, well-organized meal plans.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }));

    const responseText = completion.content[0]?.type === 'text' ? completion.content[0].text : null;
    if (!responseText) {
      throw new Error('No response from Claude');
    }

    // Parse JSON response
    const mealPlan = JSON.parse(responseText);
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'totalCost', 'prepTime', 'servings', 'meals', 'shoppingList', 'prepSchedule'];
    for (const field of requiredFields) {
      if (!mealPlan[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return mealPlan;
  } catch (error) {
    console.error('Claude meal plan generation error:', error);
    throw new Error('Failed to generate meal plan with AI');
  }
}