'use client';

import React, { useState } from 'react';
import { Calendar, ShoppingCart, Clock, DollarSign, Users, CheckCircle, Star, ChefHat, BookOpen, Lock, Crown, Loader2, Plus, Minus, ExternalLink, Cookie, Flame, Zap, Timer, Wind, Snowflake, Utensils } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getRemainingMealPlans, formatSubscriptionTier } from '../../lib/subscription';
import SubscriptionUpgrade from '../../components/SubscriptionUpgrade';

// Test meal plan data removed - now using real AI-generated meal plans

const dietaryRestrictions = [
  'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Soy-Free', 'Egg-Free', 'Keto', 'Low-Carb', 'Paleo', 'Whole30',
  'Mediterranean', 'Low-Sodium', 'Diabetic-Friendly', 'Heart-Healthy', 'Kosher', 'Halal'
];

const cookingMethods = [
  { value: 'Pots and Pans', label: 'Pots & Pans', icon: ChefHat, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'Sheet Pan', label: 'Sheet Pan', icon: Cookie, color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { value: 'One Pot', label: 'One Pot', icon: Utensils, color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'Instant Pot', label: 'Instant Pot', icon: Zap, color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { value: 'Slow Cooker', label: 'Slow Cooker', icon: Timer, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { value: 'Air Fryer', label: 'Air Fryer', icon: Wind, color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  { value: 'Oven Baked', label: 'Oven Baked', icon: Flame, color: 'bg-red-50 border-red-200 text-red-700' },
  { value: 'Grill', label: 'Grill', icon: Flame, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { value: 'Cast Iron', label: 'Cast Iron', icon: ChefHat, color: 'bg-gray-50 border-gray-200 text-gray-700' },
  { value: 'No Cook', label: 'No Cook', icon: Snowflake, color: 'bg-teal-50 border-teal-200 text-teal-700' }
];

const cuisineTypes = [
  'No Preference', 'American', 'Italian', 'Mexican', 'Asian', 'Chinese', 'Japanese', 
  'Thai', 'Indian', 'French', 'Greek', 'Spanish', 'Middle Eastern', 'Korean', 
  'Vietnamese', 'Brazilian', 'Moroccan', 'German', 'British', 'Caribbean'
];

const planningFocus = [
  'Budget-focused (minimize cost)',
  'Time-saving (quick meals & prep)', 
  'Healthy eating (balanced nutrition)',
  'Family favorites (crowd-pleasers)',
  'Use what I have (pantry cleanout)'
];

const MealPlanPage = () => {
  const { subscription, usage, canGenerateMealPlan, incrementMealPlanUsage, addMealPlan, addRecipe } = useApp();
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState(['None']);
  const [selectedCuisines, setSelectedCuisines] = useState(['No Preference']);
  const [selectedCookingMethods, setSelectedCookingMethods] = useState([]);
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
  const [generatedRecipes, setGeneratedRecipes] = useState<Set<string>>(new Set());
  
  // Form state
  const [formData, setFormData] = useState({
    planningFocus: 'Budget-focused (minimize cost)',
    numDinners: 5,
    familySize: 4, // Now a number instead of string
    weeklyBudget: 150, // Now a number for slider
    prepTime: '1-2 hours',
    skillLevel: 'Intermediate (some techniques)',
    pantryItems: ''
  });

  const toggleDiet = (diet: string) => {
    if (diet === 'None') {
      setSelectedDiets(['None']);
    } else {
      const newDiets = selectedDiets.filter(d => d !== 'None');
      if (selectedDiets.includes(diet)) {
        const filtered = newDiets.filter(d => d !== diet);
        setSelectedDiets(filtered.length === 0 ? ['None'] : filtered);
      } else {
        setSelectedDiets([...newDiets, diet]);
      }
    }
  };

  const toggleCuisine = (cuisine: string) => {
    if (cuisine === 'No Preference') {
      setSelectedCuisines(['No Preference']);
    } else {
      const newCuisines = selectedCuisines.filter(c => c !== 'No Preference');
      if (selectedCuisines.includes(cuisine)) {
        const filtered = newCuisines.filter(c => c !== cuisine);
        setSelectedCuisines(filtered.length === 0 ? ['No Preference'] : filtered);
      } else {
        setSelectedCuisines([...newCuisines, cuisine]);
      }
    }
  };

  const toggleCookingMethod = (method: string) => {
    if (selectedCookingMethods.includes(method)) {
      const filtered = selectedCookingMethods.filter(m => m !== method);
      setSelectedCookingMethods(filtered.length === 0 ? ['Pots and Pans'] : filtered);
    } else {
      setSelectedCookingMethods([...selectedCookingMethods, method]);
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
          weeklyBudget: `$${formData.weeklyBudget}`,
          dietaryRestrictions: selectedDiets.filter(d => d !== 'None'),
          cuisinePreferences: selectedCuisines.filter(c => c !== 'No Preference'),
          cookingMethods: selectedCookingMethods
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate meal plan');
      }

      setGeneratedMealPlan(data.mealPlan);
      setGeneratedRecipes(new Set()); // Reset generated recipes for new meal plan
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
          protein: meal.ingredients.find(ing => ing.toLowerCase().includes('chicken') || ing.toLowerCase().includes('beef') || ing.toLowerCase().includes('turkey') || ing.toLowerCase().includes('sausage') || ing.toLowerCase().includes('fish')) || 'protein from ingredients',
          vegetables: meal.ingredients.filter(ing => ing.toLowerCase().includes('pepper') || ing.toLowerCase().includes('onion') || ing.toLowerCase().includes('carrot') || ing.toLowerCase().includes('vegetable')).join(', ') || 'vegetables from ingredients',
          cookingMethod: 'Pots and Pans', // Default cooking method
          cuisineType: 'No Preference', // Default cuisine
          dietaryRestrictions: selectedDiets.filter(d => d !== 'None')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Weekly Meal Planner</h1>
          <p className="text-xl text-gray-600">
            Plan your whole week in one session. Get organized recipes, shopping lists, and prep schedules.
          </p>
        </div>
        
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
                        "{savedRecipe.title}" has been generated and saved to your recipe collection.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <a
                      href="/saved"
                      className="inline-flex items-center px-4 py-2 text-sm bg-green-600 text-white border border-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View in Recipe Collection
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Plan Your Perfect Week</h2>
              
              {/* Planning Focus - Full Width at Top */}
              <div className="mb-6">
                <label className="label">What's your planning focus?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {planningFocus.map((focus) => (
                    <button
                      key={focus}
                      type="button"
                      onClick={() => setFormData({...formData, planningFocus: focus})}
                      className={`px-4 py-3 text-sm rounded-lg border transition-all text-left ${
                        formData.planningFocus === focus
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {focus}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Dinners */}
              <div className="mb-6">
                <label className="label">How many dinners do you need this week?</label>
                <div className="flex gap-2 mt-2">
                  {[2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({...formData, numDinners: num})}
                      className={`w-12 h-12 rounded-lg border transition-all font-semibold ${
                        formData.numDinners === num
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Planning Details in balanced layout */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                {/* Cooking Skill Level */}
                <div>
                  <label className="label flex items-center space-x-2">
                    <ChefHat className="h-4 w-4 text-orange-600" />
                    <span>Skill Level</span>
                  </label>
                  <select 
                    className="input mt-2"
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                  >
                    <option value="Beginner (simple meals)">Beginner</option>
                    <option value="Intermediate (some techniques)">Intermediate</option>
                    <option value="Advanced (any complexity)">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Sunday Prep Time - Full Width */}
              <div className="mt-6">
                <label className="label flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>Available prep time on Sunday</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {['30 minutes', '1-2 hours', '2-3 hours', 'No Sunday prep'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({...formData, prepTime: time})}
                      className={`px-4 py-3 text-sm rounded-lg border transition-all text-center ${
                        formData.prepTime === time
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions - Full Width */}
              <div className="mt-8">
                <label className="label">Dietary restrictions (select all that apply)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {dietaryRestrictions.map((diet) => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => toggleDiet(diet)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        selectedDiets.includes(diet)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine Preferences - Full Width */}
              <div className="mt-6">
                <label className="label">Cuisine preferences (select all that appeal to you)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
                  {cuisineTypes.map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleCuisine(cuisine)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        selectedCuisines.includes(cuisine)
                          ? 'bg-orange-100 border-orange-300 text-orange-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking Methods - Full Width */}
              <div className="mt-6">
                <label className="label">Preferred cooking methods for this week (select all that appeal to you)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                  {cookingMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedCookingMethods.includes(method.value);
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => toggleCookingMethod(method.value)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center space-y-2 text-center ${
                          isSelected
                            ? `${method.color} border-current shadow-md scale-105`
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${isSelected ? '' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pantry Items */}
              <div className="mt-8">
                <label className="label">What's already in your pantry/fridge?</label>
                <textarea 
                  className="input h-20 resize-none" 
                  placeholder="Rice, pasta, canned beans, frozen vegetables, chicken breast, ground beef..."
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    {generatedMealPlan?.focus || formData.planningFocus}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{generatedMealPlan?.title}</h1>
                  <p className="text-lg text-gray-700 mb-6">{generatedMealPlan?.description}</p>
                </div>
                
                <div className="ml-6 text-right">
                  <div className="flex items-center text-gray-600 mb-2">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="font-medium">{generatedMealPlan?.totalCost}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">{generatedMealPlan?.prepTime}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="font-medium">{generatedMealPlan?.servings}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowMealPlan(false)}
                  className="btn-ghost"
                >
                  ← Generate Another Plan
                </button>
                <button className="btn-primary">
                  Save Meal Plan
                </button>
              </div>
            </div>

            {/* Weekly Meals */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
                This Week's Dinners
              </h2>
              <div className="space-y-4">
                {generatedMealPlan?.meals?.map((meal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="w-20 text-sm font-medium text-gray-600 mr-3">{meal.day}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{meal.recipe}</h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>Prep: {meal.prepTime}</span>
                          <span>Cook: {meal.cookTime}</span>
                          <span className="text-green-600 font-medium">{meal.cost}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Prep note:</strong> {meal.prepNotes}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {meal.ingredients.map((ingredient, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button 
                          onClick={() => handleGenerateRecipe(meal)}
                          disabled={generatingRecipe === meal.day}
                          className={`px-3 py-2 text-sm border rounded-lg transition-colors flex items-center space-x-2 ${
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

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Shopping List */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                  Shopping List
                </h2>
                <div className="space-y-4">
                  {Object.entries(generatedMealPlan?.shoppingList || {}).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                      <ul className="space-y-1">
                        {items.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sunday Prep Schedule */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-purple-600" />
                  Sunday Prep Schedule
                </h2>
                <p className="text-gray-600 text-sm mb-4">Complete these tasks on Sunday to set yourself up for success:</p>
                <ol className="space-y-3">
                  {generatedMealPlan?.prepSchedule?.map((task, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-sm font-medium flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{task}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
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
};

export default MealPlanPage;