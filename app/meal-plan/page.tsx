'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, ShoppingCart, Clock, DollarSign, Users, CheckCircle, Star, ChefHat, BookOpen, Lock, Crown, Loader2, Plus, Minus, ExternalLink, Cookie, Flame, Zap, Timer, Wind, Snowflake, Utensils, Leaf, Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getRemainingMealPlans, formatSubscriptionTier } from '../../lib/subscription';
import SubscriptionUpgrade from '../../components/SubscriptionUpgrade';

// Force this page to be dynamic
export const dynamic = 'force-dynamic';

// Test meal plan data removed - now using real AI-generated meal plans

const dietaryRestrictions = [
  'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Soy-Free', 'Egg-Free', 'Keto', 'Low-Carb', 'Paleo', 'Whole30',
  'Mediterranean', 'Low-Sodium', 'Diabetic-Friendly', 'Heart-Healthy', 'Kosher', 'Halal'
];

const cookingMethods = [
  { value: 'Pots and Pans', label: 'Pots & Pans', icon: ChefHat, color: 'bg-sage-50 border-sage-200 text-sage-700' },
  { value: 'Sheet Pan', label: 'Sheet Pan', icon: Cookie, color: 'bg-terracotta-50 border-terracotta-200 text-terracotta-700' },
  { value: 'One Pot', label: 'One Pot', icon: Utensils, color: 'bg-sage-50 border-sage-200 text-sage-700' },
  { value: 'Instant Pot', label: 'Instant Pot', icon: Zap, color: 'bg-navy-50 border-navy-200 text-navy-700' },
  { value: 'Slow Cooker', label: 'Slow Cooker', icon: Timer, color: 'bg-cream-50 border-cream-200 text-cream-700' },
  { value: 'Air Fryer', label: 'Air Fryer', icon: Wind, color: 'bg-sage-50 border-sage-200 text-sage-700' },
  { value: 'Oven Baked', label: 'Oven Baked', icon: Flame, color: 'bg-terracotta-50 border-terracotta-200 text-terracotta-700' },
  { value: 'Grill', label: 'Grill', icon: Flame, color: 'bg-copper-50 border-copper-200 text-copper-700' },
  { value: 'Cast Iron', label: 'Cast Iron', icon: ChefHat, color: 'bg-warmGray-50 border-warmGray-200 text-warmGray-700' },
  { value: 'No Cook', label: 'No Cook', icon: Snowflake, color: 'bg-cream-50 border-cream-200 text-cream-700' }
];

const cuisineTypes = [
  'No Preference', 'American', 'Italian', 'Mexican', 'Asian', 'Chinese', 'Japanese', 
  'Thai', 'Indian', 'French', 'Greek', 'Spanish', 'Middle Eastern', 'Korean', 
  'Vietnamese', 'Brazilian', 'Moroccan', 'German', 'British', 'Caribbean'
];


// Component that uses useSearchParams - must be wrapped in Suspense
function MealPlanContent() {
  const { subscription, usage, canGenerateMealPlan, incrementMealPlanUsage, addMealPlan, addRecipe, preferences } = useApp();
  const searchParams = useSearchParams();
  const isWelcome = searchParams?.get('welcome') === 'true';
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    if (isWelcome) {
      setShowWelcome(true);
      // Hide welcome message after 5 seconds
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isWelcome]);
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [showCustomizePreferences, setShowCustomizePreferences] = useState(false);
  // Override preferences for this meal plan (optional)
  const [overrideDiets, setOverrideDiets] = useState<string[]>([]);
  const [overrideCuisines, setOverrideCuisines] = useState<string[]>([]);
  const [overrideCookingMethods, setOverrideCookingMethods] = useState<string[]>([]);
  const [overrideSeasonalIngredients, setOverrideSeasonalIngredients] = useState<boolean | null>(null);
  const [generatedMealPlan, setGeneratedMealPlan] = useState<{
    title: string;
    description: string;
    totalCost: string;
    prepTime: string;
    servings: string;
    focus?: string;
    meals: {
      day: string;
      recipe: string;
      main?: string;
      sides?: string[];
      prepTime: string;
      cookTime: string;
      cost: string;
      ingredients: string[];
      prepNotes: string;
    }[];
    shoppingList: Record<string, string[]>;
    prepSchedule: string[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingRecipe, setGeneratingRecipe] = useState<string | null>(null);
  const [savedRecipe, setSavedRecipe] = useState<any>(null);
  const [savedMealPlan, setSavedMealPlan] = useState<any>(null);
  const [generatedRecipes, setGeneratedRecipes] = useState<Set<string>>(new Set());
  
  // Form state
  const [formData, setFormData] = useState({
    numDinners: 5, // Back to simple number selection
    familySize: 4, // Now a number instead of string
    weeklyBudget: 150, // Now a number for slider
    pantryItems: ''
  });

  // Override toggle functions
  const toggleOverrideDiet = (diet: string) => {
    if (diet === 'None') {
      setOverrideDiets(['None']);
    } else {
      const newDiets = overrideDiets.filter(d => d !== 'None');
      if (overrideDiets.includes(diet)) {
        const filtered = newDiets.filter(d => d !== diet);
        setOverrideDiets(filtered.length === 0 ? ['None'] : filtered);
      } else {
        setOverrideDiets([...newDiets, diet]);
      }
    }
  };

  const toggleOverrideCuisine = (cuisine: string) => {
    if (cuisine === 'No Preference') {
      setOverrideCuisines(['No Preference']);
    } else {
      const newCuisines = overrideCuisines.filter(c => c !== 'No Preference');
      if (overrideCuisines.includes(cuisine)) {
        const filtered = newCuisines.filter(c => c !== cuisine);
        setOverrideCuisines(filtered.length === 0 ? ['No Preference'] : filtered);
      } else {
        setOverrideCuisines([...newCuisines, cuisine]);
      }
    }
  };

  const toggleOverrideCookingMethod = (method: string) => {
    if (overrideCookingMethods.includes(method)) {
      const filtered = overrideCookingMethods.filter(m => m !== method);
      setOverrideCookingMethods(filtered);
    } else {
      setOverrideCookingMethods([...overrideCookingMethods, method]);
    }
  };

  const handleGenerateMealPlan = async () => {
    const success = await incrementMealPlanUsage();
    if (!success) return;

    setIsGenerating(true);
    setError(null);
    setSavedRecipe(null);
    
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          familySize: `${formData.familySize} people`,
          weeklyBudget: `$${formData.weeklyBudget}`,
          prepTime: '1-2 hours', // Default value since we removed the UI
          planningFocus: 'Balanced nutrition and convenience', // Default value since we removed the UI
          // Use user preferences with optional overrides
          dietaryRestrictions: overrideDiets.length > 0 
            ? overrideDiets.filter(d => d !== 'None')
            : (preferences?.dietaryRestrictions?.filter(d => d !== 'None') || []),
          cuisinePreferences: overrideCuisines.length > 0
            ? overrideCuisines.filter(c => c !== 'No Preference')
            : (preferences?.cuisinePreferences?.filter(c => c !== 'No Preference') || []),
          cookingMethods: overrideCookingMethods.length > 0
            ? overrideCookingMethods
            : ['Pots and Pans', 'Sheet Pan', 'One Pot', 'Oven Baked'], // Default cooking methods
          useSeasonalIngredients: overrideSeasonalIngredients !== null
            ? overrideSeasonalIngredients
            : (preferences?.useSeasonalIngredients || false),
          skillLevel: preferences?.cookingSkill || 'Intermediate (some techniques)'
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate meal plan');
      }

      setGeneratedMealPlan(data.mealPlan);
      setGeneratedRecipes(new Set()); // Reset generated recipes for new meal plan
      
      // Automatically save the generated meal plan
      try {
        await addMealPlan(data.mealPlan);
        console.log('Meal plan saved successfully');
        
        // Show success notification
        setSavedMealPlan({
          title: data.mealPlan.title,
          id: data.mealPlan.id
        });
      } catch (error) {
        console.error('Error saving meal plan:', error);
        // Don't block the UI if saving fails, just log it
      }
      
      setShowMealPlan(true);
    } catch (error) {
      console.error('Meal plan generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate meal plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateRecipe = async (meal: {
    day: string;
    recipe: string;
    main?: string;
    sides?: string[];
    prepTime: string;
    cookTime: string;
    cost: string;
    ingredients: string[];
    prepNotes: string;
  }) => {
    setGeneratingRecipe(meal.day);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familySize: `${formData.familySize} people`,
          availableTime: meal.cookTime || '30 minutes',
          cookingSituation: `${meal.day} dinner from meal plan`,
          protein: meal.main || meal.ingredients.find(ing => ing.toLowerCase().includes('chicken') || ing.toLowerCase().includes('beef') || ing.toLowerCase().includes('turkey') || ing.toLowerCase().includes('sausage') || ing.toLowerCase().includes('fish')) || 'protein from main dish',
          vegetables: meal.sides?.join(', ') || meal.ingredients.filter(ing => ing.toLowerCase().includes('pepper') || ing.toLowerCase().includes('onion') || ing.toLowerCase().includes('carrot') || ing.toLowerCase().includes('vegetable')).join(', ') || 'vegetables and sides',
          cookingMethod: 'Pots and Pans', // Default cooking method
          cuisineType: preferences?.cuisinePreferences?.[0] || 'No Preference',
          dietaryRestrictions: preferences?.dietaryRestrictions?.filter(d => d !== 'None') || [],
          difficulty: preferences?.cookingSkill?.includes('Beginner') ? 'Easy' : preferences?.cookingSkill?.includes('Expert') ? 'Advanced' : 'Intermediate'
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      // Save the generated recipe
      console.log('Recipe generated successfully:', data.recipe);
      await addRecipe(data.recipe);
      console.log('Recipe saved to collection');
      
      // Mark this recipe as generated
      setGeneratedRecipes(prev => new Set(prev.add(meal.day)));
      
      // Show success notification with recipe info
      setSavedRecipe({
        title: data.recipe.title,
        mealName: meal.recipe,
        recipeId: data.recipe.id
      });
      
    } catch (error) {
      console.error('Recipe generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate recipe');
    } finally {
      setGeneratingRecipe(null);
    }
  };

  const canGenerate = canGenerateMealPlan();
  const remainingMealPlans = getRemainingMealPlans(subscription, usage);
  const hasAccessToMealPlans = subscription.tier !== 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmCream via-sage-50 to-cream-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-warmGray-900 mb-4">Weekly Nourishment Planner</h1>
          <p className="text-xl text-warmGray-600 font-body">
            Create your week's rhythm in one thoughtful session. Gentle recipes, mindful shopping, and peaceful prep.
          </p>
        </div>
        
        {showWelcome && (
          <div className="bg-stone-50/80 border border-stone-200/50 rounded-2xl p-8 mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-stone-600 mr-3" />
              <h3 className="text-xl font-serif font-light text-stone-700 italic">Welcome to your meal planning journey!</h3>
            </div>
            <p className="text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
              You've completed your preferences - now let's create your first weekly meal plan. 
              This thoughtful approach will help you plan nourishing meals for your family while reducing dinner stress.
            </p>
          </div>
        )}
        
        {!hasAccessToMealPlans ? (
          <SubscriptionUpgrade feature="meal planning" />
        ) : !showMealPlan ? (
          // Meal Plan Generation Form
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {savedRecipe && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900">Recipe Saved Successfully!</h3>
                      <p className="text-green-800 text-sm mt-1">
                        "{savedRecipe.title}" has been generated and saved to My Recipes.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <a
                      href="/saved"
                      className="inline-flex items-center px-4 py-2 text-sm bg-green-600 text-white border border-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View in My Recipes
                    </a>
                    <button
                      onClick={() => setSavedRecipe(null)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {savedMealPlan && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Meal Plan Saved Successfully!</h3>
                      <p className="text-blue-800 text-sm mt-1">
                        "{savedMealPlan.title}" has been saved to your meal plan collection.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <a
                      href="/saved?tab=meal-plans"
                      className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View in My Meal Plans
                    </a>
                    <button
                      onClick={() => setSavedMealPlan(null)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Plan Your Perfect Week</h2>
              

              {/* Number of Dinners */}
              <div className="mb-6">
                <label className="label">How many dinners do you need this week?</label>
                <select
                  value={formData.numDinners}
                  onChange={(e) => setFormData({...formData, numDinners: parseInt(e.target.value)})}
                  className="input w-full mt-2"
                >
                  <option value={2}>2 dinners</option>
                  <option value={3}>3 dinners</option>
                  <option value={4}>4 dinners</option>
                  <option value={5}>5 dinners</option>
                  <option value={6}>6 dinners</option>
                  <option value={7}>7 dinners</option>
                </select>
              </div>

              {/* Planning Details in balanced layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Family Size */}
                <div>
                  <label className="label flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Family Size</span>
                  </label>
                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, familySize: Math.max(1, formData.familySize - 1)})}
                      className="w-8 h-8 rounded-full border-2 border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      disabled={formData.familySize <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <div className="bg-white border-2 border-blue-300 rounded-lg px-3 py-2 min-w-[60px] text-center">
                      <span className="text-xl font-bold text-blue-600">{formData.familySize}</span>
                      <div className="text-xs text-gray-500">people</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, familySize: Math.min(12, formData.familySize + 1)})}
                      className="w-8 h-8 rounded-full border-2 border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                      disabled={formData.familySize >= 12}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Weekly Budget */}
                <div className="md:col-span-2">
                  <label className="label flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>Weekly Budget Target</span>
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">$50</span>
                      <div className="bg-white border-2 border-green-300 rounded-lg px-3 py-1">
                        <span className="text-lg font-bold text-green-600">${formData.weeklyBudget}</span>
                      </div>
                      <span className="text-sm text-gray-600">$500</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={formData.weeklyBudget}
                      onChange={(e) => setFormData({...formData, weeklyBudget: parseInt(e.target.value)})}
                      className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #87a96b 0%, #87a96b ${((formData.weeklyBudget - 50) / (500 - 50)) * 100}%, #e5e7eb ${((formData.weeklyBudget - 50) / (500 - 50)) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>


              {/* Preferences Status */}
              {preferences ? (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Using Your Saved Preferences</h3>
                      <div className="text-sm text-green-800 space-y-1">
                        <p><strong>Cooking Level:</strong> {preferences.cookingSkill}</p>
                        <p><strong>Dietary Restrictions:</strong> {preferences.dietaryRestrictions.join(', ')}</p>
                        <p><strong>Cuisines:</strong> {preferences.cuisinePreferences.join(', ')}</p>
                        <p><strong>Seasonal Ingredients:</strong> {preferences.useSeasonalIngredients ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    <a
                      href="/preferences"
                      className="text-sm text-green-700 hover:text-green-900 underline"
                    >
                      Edit Preferences
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">No Preferences Set</h3>
                      <p className="text-sm text-blue-800">
                        Set your cooking preferences to streamline meal planning and get personalized recommendations.
                      </p>
                    </div>
                    <a
                      href="/preferences"
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Set Preferences
                    </a>
                  </div>
                </div>
              )}

              {/* Optional Preferences Override */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowCustomizePreferences(!showCustomizePreferences)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {showCustomizePreferences ? '← Use saved preferences' : 'Customize preferences for this meal plan'}
                </button>
              </div>

              {showCustomizePreferences && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Override Preferences (Optional)</h4>
                  
                  {/* Override Dietary Restrictions */}
                  <div className="mb-4">
                    <label className="label text-sm">Dietary Restrictions for this plan</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {dietaryRestrictions.slice(0, 6).map((diet) => (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => toggleOverrideDiet(diet)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                            overrideDiets.includes(diet)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {diet}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Override Cuisines */}
                  <div className="mb-4">
                    <label className="label text-sm">Cuisines for this plan</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {cuisineTypes.slice(0, 8).map((cuisine) => (
                        <button
                          key={cuisine}
                          type="button"
                          onClick={() => toggleOverrideCuisine(cuisine)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                            overrideCuisines.includes(cuisine)
                              ? 'bg-orange-100 border-orange-300 text-orange-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Override Seasonal Ingredients */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="label text-sm">Use seasonal ingredients for this plan</label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setOverrideSeasonalIngredients(true)}
                          className={`px-3 py-1 text-sm rounded ${
                            overrideSeasonalIngredients === true
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setOverrideSeasonalIngredients(false)}
                          className={`px-3 py-1 text-sm rounded ${
                            overrideSeasonalIngredients === false
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pantry Items */}
              <div className="mt-6">
                <label className="label">What's already in your pantry/fridge?</label>
                <textarea 
                  className="input h-20 resize-none" 
                  placeholder="Rice, pasta, canned beans, frozen vegetables, chicken breast, ground beef..."
                  value={formData.pantryItems}
                  onChange={(e) => setFormData({...formData, pantryItems: e.target.value})}
                ></textarea>
              </div>
            </div>

            {/* Usage Information */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Meal Plans Remaining
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{remainingMealPlans}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="font-medium text-gray-900">{formatSubscriptionTier(subscription.tier)}</p>
                </div>
              </div>
              {!canGenerate && hasAccessToMealPlans && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <Lock className="h-4 w-4 inline mr-2" />
                    You've reached your monthly meal plan limit. Upgrade to Family for more plans!
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleGenerateMealPlan}
                disabled={!canGenerate || isGenerating}
                className={`btn-primary flex items-center space-x-3 ${
                  (!canGenerate || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Your Meal Plan...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    <span>{canGenerate ? 'Generate My Meal Plan' : 'Limit Reached'}</span>
                  </>
                )}
              </button>
              <button className="btn-ghost">
                <BookOpen className="h-5 w-5 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
          </>
        ) : (
          // Meal Plan Display
          <div className="space-y-6">
            {/* Meal Plan Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
              {/* Mobile-first layout - stacked */}
              <div className="space-y-4 md:space-y-0 md:flex md:items-start md:justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {generatedMealPlan?.focus || 'Weekly Meal Plan'}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{generatedMealPlan?.title}</h1>
                  <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">{generatedMealPlan?.description}</p>
                </div>
                
                {/* Stats - horizontal on mobile, vertical on desktop */}
                <div className="flex justify-between md:block md:ml-6 md:text-right space-x-4 md:space-x-0">
                  <div className="flex items-center text-gray-600 mb-0 md:mb-2">
                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                    <span className="font-medium text-sm md:text-base">{generatedMealPlan?.totalCost}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-0 md:mb-2">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                    <span className="font-medium text-sm md:text-base">{generatedMealPlan?.prepTime}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Users className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                    <span className="font-medium text-sm md:text-base">{generatedMealPlan?.servings}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    setShowMealPlan(false);
                    setSavedMealPlan(null); // Clear the success notification when generating new plan
                  }}
                  className="btn-ghost"
                >
                  ← Generate Another Plan
                </button>
                <a
                  href="/saved?tab=meal-plans"
                  className="btn-secondary inline-flex items-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View All My Meal Plans
                </a>
              </div>
            </div>

            {/* Weekly Meals */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ChefHat className="h-4 w-4 md:h-5 md:w-5 mr-2 text-orange-600" />
                This Week's Dinners
              </h2>
              <div className="space-y-4">
                {generatedMealPlan?.meals?.map((meal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-gray-300 transition-colors">
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="space-y-3 md:space-y-0 md:flex md:items-start md:justify-between">
                      <div className="flex-1">
                        {/* Day and meal name - mobile friendly */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">{meal.day}</span>
                            <span className="text-green-600 font-medium text-sm md:hidden">{meal.cost}</span>
                          </div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">{meal.recipe}</h3>
                          {meal.main && meal.sides && (
                            <div className="text-xs md:text-sm text-gray-600 mt-1">
                              <span className="font-medium">Main:</span> {meal.main}
                              <br className="md:hidden" />
                              <span className="hidden md:inline"> | </span>
                              <span className="font-medium">Sides:</span> {meal.sides.join(', ')}
                            </div>
                          )}
                        </div>
                        {/* Time and cost info - mobile friendly */}
                        <div className="flex items-center flex-wrap gap-3 text-xs md:text-sm text-gray-600 mb-2">
                          <span>Prep: {meal.prepTime}</span>
                          <span>Cook: {meal.cookTime}</span>
                          <span className="text-green-600 font-medium hidden md:inline">{meal.cost}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">
                          <strong>Prep note:</strong> {meal.prepNotes}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3 md:mb-0">
                          {meal.ingredients.slice(0, 6).map((ingredient, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {ingredient}
                            </span>
                          ))}
                          {meal.ingredients.length > 6 && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded text-xs">
                              +{meal.ingredients.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Button - full width on mobile, positioned right on desktop */}
                      <div className="md:ml-4 md:flex-shrink-0">
                        <button 
                          onClick={() => handleGenerateRecipe(meal)}
                          disabled={generatingRecipe === meal.day}
                          className={`w-full md:w-auto px-3 py-2 text-xs md:text-sm border rounded-lg transition-colors flex items-center justify-center md:justify-start space-x-2 ${
                            generatedRecipes.has(meal.day)
                              ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                              : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
                          } ${
                            generatingRecipe === meal.day ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {generatingRecipe === meal.day ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : generatedRecipes.has(meal.day) ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Recipe Generated</span>
                            </>
                          ) : (
                            <span>View Full Recipe</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
              {/* Shopping List */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
                  Shopping List
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {Object.entries(generatedMealPlan?.shoppingList || {}).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{category}</h3>
                      <ul className="space-y-1">
                        {items.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 text-xs md:text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sunday Prep Schedule */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="h-4 w-4 md:h-5 md:w-5 mr-2 text-purple-600" />
                  Sunday Prep Schedule
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-4">Complete these tasks on Sunday to set yourself up for success:</p>
                <ol className="space-y-2 md:space-y-3">
                  {generatedMealPlan?.prepSchedule?.map((task, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-purple-100 text-purple-600 rounded-full text-xs md:text-sm font-medium flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-xs md:text-sm leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs md:text-sm text-green-800">
                    <strong>Total prep time:</strong> About 2 hours. Spread throughout Sunday or do in batches!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component that wraps the content in Suspense
const MealPlanPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-warmCream via-sage-50 to-cream-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-sage-600 mx-auto mb-4" />
          <p className="text-warmGray-600 font-body">Loading your meal planning workspace...</p>
        </div>
      </div>
    }>
      <MealPlanContent />
    </Suspense>
  );
};

export default MealPlanPage;