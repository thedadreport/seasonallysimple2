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
  cookingStyle?: string;
}) {
  if (!validateAnthropicConfig()) {
    throw new Error('Anthropic API key not configured');
  }

  const seasonalNote = formData.seasonal ? `
**SEASONAL FOCUS:** Use fresh, in-season ingredients and seasonal cooking themes. Consider what's fresh and available during the current season (late August) - think late summer produce like tomatoes, corn, eggplant, peppers, stone fruits, and herbs.` : '';

  const cookingStyleNote = formData.cookingStyle ? `
**COOKING STYLE PREFERENCE:** ${formData.cookingStyle}
Please incorporate this cooking philosophy and style into the recipe approach, techniques, and overall feel.` : '';

  const prompt = `Create a detailed, family-friendly recipe based on these requirements:

**Family Size:** ${formData.familySize}
**Available Time:** ${formData.availableTime}
**Cooking Situation:** ${formData.cookingSituation}
**Preferred Protein:** ${formData.protein}
**Vegetables to Include:** ${formData.vegetables}
**Cooking Method:** ${formData.cookingMethod}
**Cuisine Style:** ${formData.cuisineType}
**Difficulty Level:** ${formData.difficulty}
**Dietary Restrictions:** ${formData.dietaryRestrictions.join(', ') || 'None'}${seasonalNote}${cookingStyleNote}

Please generate a complete recipe with:
1. A creative, descriptive title
2. Brief description (2-3 sentences)
3. Cooking time (realistic estimate)
4. Servings (match family size)
5. Difficulty level (Easy/Intermediate/Advanced)
6. Estimated total cost (realistic grocery cost for all ingredients)
7. 3-5 relevant tags
8. Complete ingredient list with measurements
9. Step-by-step instructions
10. 3-4 helpful tips or variations
11. Personal notes or suggestions

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
  "cost": "$XX",
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
  cookingStyle?: string;
}) {
  if (!validateAnthropicConfig()) {
    throw new Error('Anthropic API key not configured');
  }

  const cookingStyleNote = formData.cookingStyle ? `
**COOKING STYLE PREFERENCE:** ${formData.cookingStyle}
Please incorporate this cooking philosophy and style into all meal planning decisions, recipe selection, and preparation approaches.` : '';

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
**Pantry Items Available:** ${formData.pantryItems || 'Standard pantry staples'}${cookingStyleNote}

Please generate a complete meal plan with:
1. Creative title reflecting the focus
2. Brief description (2-3 sentences)
3. Total estimated cost
4. Prep time summary
5. Servings info
6. Detailed meals for each day including:
   - Day name
   - Complete dinner with 1 main dish + 2 side dishes
   - Prep time
   - Cook time
   - Estimated cost
   - Key ingredients list for all components
   - Prep notes/tips
7. Organized shopping list by category with estimated prices
8. Sunday prep schedule with time estimates
9. Personal notes or tips for success

Make it practical, budget-conscious, and achievable for the specified skill level. 

CRITICAL VARIETY REQUIREMENTS - AVOID REPETITION:
🚫 **NO DUPLICATE PROTEINS:** Each meal MUST use a different primary protein. Do not repeat chicken, beef, pork, fish, etc. across meals.
🚫 **NO DUPLICATE COOKING METHODS:** Each meal should use a different primary cooking method (grilled, roasted, stir-fried, braised, baked, pan-seared, etc.)
🚫 **NO REPETITIVE SIDES:** Avoid repeating the same side dishes. No more than 1 roasted vegetable dish, 1 rice dish, 1 potato dish across the entire plan.
🚫 **NO SIMILAR FLAVOR PROFILES:** Vary seasonings and cuisines - don't default to basic herbs like rosemary/garlic for multiple meals.

MANDATORY PROTEIN VARIETY (choose different ones):
- Chicken (but vary: thighs, breast, whole pieces - only use ONCE)
- Beef (ground, steak, stew meat, etc. - only use ONCE) 
- Pork (chops, tenderloin, ground, etc. - only use ONCE)
- Fish/Seafood (salmon, white fish, shrimp, etc. - only use ONCE)
- Vegetarian proteins (beans, lentils, tofu, eggs, etc. - only use ONCE)
- Turkey, lamb, or other proteins if needed for variety

IMPORTANT MEAL STRUCTURE: Each dinner should consist of:
- 1 MAIN DISH (protein-focused: meat, fish, vegetarian protein, etc.)
- 2 SIDE DISHES (vegetables, starches, grains, salads - should complement the main)

🍽️ **CLASSIC DINNER PRESENTATION - AVOID "BOWL" FORMATS:**
Create traditional, familiar dinner plates that families recognize, NOT trendy bowl meals.

PREFERRED FORMATS:
✅ "Baked Salmon with Lemon Herb Potatoes and Green Beans"
✅ "Chicken Parmesan with Spaghetti and Caesar Salad"  
✅ "Beef Stir-Fry with Steamed Rice and Egg Rolls"
✅ "Pork Chops with Mashed Potatoes and Roasted Carrots"
✅ "Taco Tuesday with Ground Beef Tacos, Spanish Rice, and Refried Beans"

AVOID THESE TRENDY FORMATS:
❌ "Ginger-Soy Glazed Salmon Bowl"
❌ "Chili-Lime Chicken Fiesta Bowl" 
❌ "Mediterranean Grain Bowl"
❌ "Asian Fusion Bowl"
❌ "Buddha Bowl" or any "__ Bowl" naming

Use classic main-and-sides presentation that feels like traditional home cooking, not restaurant trends.

COOKING METHOD DISTRIBUTION: Distribute meals across different cooking methods (${formData.cookingMethods.join(', ')}) - ensure each meal uses a DIFFERENT primary method. Examples: grilled, roasted, stir-fried, braised, pan-seared, slow-cooked, baked, etc.

CUISINE INTEGRATION: When "No specific preference" is selected, create a DIVERSE mix of cuisine styles across the meal plan. Include different global flavors like Italian, Mexican, Asian, Mediterranean, American, etc. When specific cuisines are preferred (${formData.cuisinePreferences.join(', ')}), distribute them evenly but still ensure variety within each cuisine style.

EXAMPLE CLASSIC DINNER FORMATS (DO NOT COPY - CREATE YOUR OWN VARIED MEALS):
- Monday: Italian - Chicken Parmesan with Spaghetti and Garlic Breadsticks
- Tuesday: Mexican - Ground Beef Tacos with Spanish Rice and Refried Beans  
- Wednesday: American - Baked Meatloaf with Mashed Potatoes and Green Bean Casserole
- Thursday: Mediterranean - Herb-Crusted Salmon with Rice Pilaf and Roasted Zucchini
- Friday: Asian - Beef and Broccoli Stir-Fry with Jasmine Rice and Spring Rolls

**FOCUS ON FAMILIAR CLASSICS:** Think traditional family dinners, comfort food, and recognizable combinations that feel like home cooking - NOT trendy restaurant concepts or "bowl" meals.

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
      "main": "Main Dish Name",
      "sides": ["Side Dish 1", "Side Dish 2"],
      "recipe": "Complete Dinner Name (for display)",
      "prepTime": "X min",
      "cookTime": "X min", 
      "cost": "$X",
      "ingredients": ["main ingredients", "side 1 ingredients", "side 2 ingredients"],
      "prepNotes": "Prep instructions for main and sides"
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

// Generate recipe from image using Claude Vision
export async function generateRecipeFromImageWithAI(data: {
  image: string;
  familySize: string;
  dietaryRestrictions: string[];
}) {
  if (!validateAnthropicConfig()) {
    throw new Error('Anthropic API key not configured');
  }

  // Extract base64 data from data URL
  const imageData = data.image.split(',')[1] || data.image;
  const mimeType = data.image.startsWith('data:') 
    ? data.image.split(';')[0].split(':')[1] 
    : 'image/jpeg';

  const prompt = `Please analyze this recipe image and extract all the recipe information you can see. Then create a complete, well-formatted recipe based on what you observe.

**Target Audience:**
- Family Size: ${data.familySize}
- Dietary Restrictions: ${data.dietaryRestrictions.join(', ') || 'None'}

If there are any dietary restrictions specified, please modify the recipe accordingly to accommodate them while staying true to the original recipe's intent.

Please examine the image carefully and:
1. Read all visible text (ingredients, instructions, title, etc.)
2. Identify any cooking methods or techniques mentioned
3. Note any timing information
4. Look for serving size information
5. Extract any tips or notes mentioned
6. If the image quality makes some text unclear, make reasonable assumptions based on what you can see

Generate a complete recipe with:
1. A descriptive title (use the original if visible, or create one based on the dish)
2. Brief description (2-3 sentences about the dish)
3. Realistic cooking time
4. Serving size (adjusted for the specified family size if needed)
5. Difficulty level based on the complexity observed
6. Estimated total cost for ingredients
7. 3-5 relevant tags
8. Complete ingredient list with measurements (scale if needed for family size)
9. Step-by-step instructions (based on what's visible or inferred)
10. 3-4 helpful tips or variations

IMPORTANT: If you cannot clearly read parts of the recipe, make reasonable culinary assumptions based on:
- The type of dish you can identify
- Standard cooking methods for that type of food
- Common ingredient proportions
- Typical cooking times and techniques

If dietary restrictions are specified, modify ingredients and instructions accordingly while maintaining the essence of the original recipe.

Format the response as valid JSON with this exact structure:
{
  "title": "Recipe Title",
  "description": "Brief description",
  "cookTime": "XX minutes",
  "servings": "X people",
  "difficulty": "Easy|Intermediate|Advanced",
  "cost": "$XX",
  "tags": ["tag1", "tag2", "tag3"],
  "situation": "Recipe from Image",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "tips": ["tip 1", "tip 2"],
  "notes": "Generated from uploaded recipe image. Some details may have been inferred based on culinary best practices."
}`;

  try {
    const completion = await retryApiCall(() => anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
      temperature: 0.5,
      system: 'You are a professional chef and recipe developer who excels at reading recipe images and creating comprehensive, well-formatted recipes. You have expertise in identifying dishes, ingredients, and cooking techniques from visual information. When text is unclear, you make informed culinary decisions based on your knowledge of cooking methods and flavor combinations.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as any,
                data: imageData
              }
            }
          ]
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
    console.error('Claude recipe generation from image error:', error);
    if (error instanceof Error && error.message.includes('JSON')) {
      throw new Error('AI returned invalid recipe format from image');
    }
    throw new Error('Failed to generate recipe from image with AI');
  }
}