'use client';

import React, { useState } from 'react';
import { Clock, Users, ChefHat, Utensils, CheckCircle, BookOpen, Star, Lock, Loader2, Cookie, Flame, Zap, Timer, Wind, Snowflake, Globe, Fish, Wheat, MapPin, Printer, Plus, Minus, ExternalLink } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getRemainingRecipes } from '../../lib/subscription';
import { Recipe } from '@/types';

const generatedRecipe = {
  title: "One-Pot Chicken & Rice with Whatever's in Your Fridge",
  description: "Perfect for those 'protein + random stuff' situations. This forgiving recipe works with whatever vegetables you have on hand.",
  cookTime: "25 minutes",
  servings: "4-6 people",
  difficulty: "Easy",
  tags: ["One-Pot", "Family-Friendly", "Flexible", "Comfort Food"],
  ingredients: [
    "1½ lbs chicken thighs (or whatever protein you have)",
    "1½ cups jasmine rice",
    "3 cups chicken broth (or water + bouillon)",
    "1 large onion, diced",
    "3 cloves garlic, minced",
    "2 carrots, diced (or any hard vegetables)",
    "1 bell pepper, diced (optional)",
    "1 cup frozen peas (or any quick-cooking vegetables)",
    "2 tbsp olive oil",
    "1 tsp paprika",
    "1 tsp dried thyme",
    "Salt and pepper to taste"
  ],
  instructions: [
    "Heat olive oil in a large pot or dutch oven over medium-high heat. Season chicken with salt, pepper, and paprika.",
    "Brown chicken pieces on both sides (about 6 minutes total). Remove and set aside - they don't need to be fully cooked.",
    "In the same pot, sauté onion and garlic until fragrant (2-3 minutes). Add harder vegetables like carrots.",
    "Add rice and stir for 1 minute to lightly toast. Pour in broth and add thyme.",
    "Nestle chicken back into the rice mixture. Bring to a boil, then reduce heat to low and cover.",
    "Simmer for 18-20 minutes until rice is tender and chicken is cooked through.",
    "In the last 5 minutes, add quick-cooking vegetables like bell peppers and frozen peas.",
    "Let rest for 5 minutes before serving. Taste and adjust seasoning."
  ],
  tips: [
    "No chicken thighs? Use chicken breasts (reduce cooking time) or even leftover rotisserie chicken (add in the last 10 minutes).",
    "Vegetable flexibility: Use what you have - zucchini, green beans, corn, spinach all work great.",
    "Make it yours: Add curry powder for Indian flavors, or diced tomatoes and Italian herbs for a Mediterranean twist.",
    "Leftovers work great for lunch tomorrow - add a fried egg on top!"
  ],
  situation: "Tonight's Dinner Crisis"
};

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
  { value: 'No Preference', label: 'No Preference', icon: Globe, color: 'bg-gray-50 border-gray-200 text-gray-700' },
  { value: 'American', label: 'American', icon: Star, color: 'bg-red-50 border-red-200 text-red-700' },
  { value: 'Italian', label: 'Italian', icon: Utensils, color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'Mexican', label: 'Mexican', icon: Flame, color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { value: 'Asian', label: 'Asian', icon: ChefHat, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { value: 'Mediterranean', label: 'Mediterranean', icon: Fish, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'Indian', label: 'Indian', icon: Flame, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { value: 'Thai', label: 'Thai', icon: Timer, color: 'bg-lime-50 border-lime-200 text-lime-700' },
  { value: 'French', label: 'French', icon: Star, color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { value: 'Middle Eastern', label: 'Middle Eastern', icon: MapPin, color: 'bg-teal-50 border-teal-200 text-teal-700' },
  { value: 'Southern', label: 'Southern', icon: Wheat, color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { value: 'BBQ', label: 'BBQ', icon: Flame, color: 'bg-slate-50 border-slate-200 text-slate-700' }
];

const dietaryRestrictions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Soy-Free',
  'Egg-Free',
  'Keto',
  'Low-Carb',
  'Paleo',
  'Whole30',
  'Mediterranean',
  'Low-Sodium',
  'Diabetic-Friendly',
  'Heart-Healthy',
  'Kosher',
  'Halal'
];

const RecipePage = () => {
  const { subscription, usage, canGenerateRecipe, incrementRecipeUsage, addRecipe } = useApp();
  const [showRecipe, setShowRecipe] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState(['None']);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedRecipe, setSavedRecipe] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    familySize: 4, // Now a number for the picker
    availableTime: '30 minutes',
    cookingSituation: "Tonight's Dinner",
    protein: 'Chicken',
    vegetables: '',
    cookingMethod: 'Pots and Pans',
    cuisineType: 'No Preference'
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

  const handleGenerateRecipe = async (isRegeneration = false) => {
    if (!isRegeneration) {
      const success = await incrementRecipeUsage();
      if (!success) return;
    }

    setIsGenerating(true);
    setError(null);
    setSavedRecipe(null);
    setGenerationProgress('Analyzing your preferences...');
    
    try {
      // Progress updates
      setTimeout(() => setGenerationProgress('Creating your custom recipe...'), 1000);
      setTimeout(() => setGenerationProgress('Adding final touches...'), 8000);

      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          familySize: `${formData.familySize} people`,
          dietaryRestrictions: selectedDiets.filter(d => d !== 'None')
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setGeneratedRecipe(data.recipe);
      setShowRecipe(true);
      setGenerationProgress('');
    } catch (error) {
      console.error('Recipe generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate recipe');
      setGenerationProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (generatedRecipe) {
      try {
        await addRecipe(generatedRecipe);
        setSavedRecipe({
          title: generatedRecipe.title,
          recipeId: generatedRecipe.id
        });
      } catch (error) {
        console.error('Failed to save recipe:', error);
        setError('Failed to save recipe');
      }
    }
  };

  const handlePrintRecipe = () => {
    window.print();
  };

  const remainingRecipes = getRemainingRecipes(subscription, usage);
  const canGenerate = canGenerateRecipe();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Recipe Generator</h1>
          <p className="text-xl text-gray-600">
            Tell us your situation and we'll create the perfect recipe for your family
          </p>
        </div>
        
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
                    "{savedRecipe.title}" has been saved to your recipe collection.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <a
                  href="/saved"
                  className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 border border-green-300 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  View All Recipes
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

        {!showRecipe ? (
          // Recipe Generation Form
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's Your Cooking Situation?</h2>
              
              {/* Cooking Situation - Full Width at Top */}
              <div className="mb-6">
                <label className="label">Cooking Situation</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {["Tonight's Dinner", "Protein + random stuff in fridge", "Need to stretch small portions", "Want minimal cleanup", "Making tomorrow's lunch too", "Special occasion meal"].map((situation) => (
                    <button
                      key={situation}
                      type="button"
                      onClick={() => setFormData({...formData, cookingSituation: situation})}
                      className={`px-4 py-3 text-sm rounded-lg border transition-all text-left ${
                        formData.cookingSituation === situation
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {situation}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields in improved layout */}
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

                {/* Available Time */}
                <div>
                  <label className="label flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Available Time</span>
                  </label>
                  <select 
                    className="input mt-2"
                    value={formData.availableTime}
                    onChange={(e) => setFormData({...formData, availableTime: e.target.value})}
                  >
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">45 minutes</option>
                    <option value="1 hour">1 hour</option>
                  </select>
                </div>

                {/* Protein - span 2 columns */}
                <div className="md:col-span-2">
                  <label className="label flex items-center space-x-2">
                    <ChefHat className="h-4 w-4 text-red-600" />
                    <span>What protein do you have?</span>
                  </label>
                  <input 
                    type="text" 
                    className="input mt-2" 
                    placeholder="Chicken thighs, ground beef, salmon, tofu..." 
                    value={formData.protein}
                    onChange={(e) => setFormData({...formData, protein: e.target.value})}
                  />
                </div>
              </div>

              {/* Vegetables - Full Width */}
              <div className="mt-6">
                <label className="label flex items-center space-x-2">
                  <Utensils className="h-4 w-4 text-green-600" />
                  <span>Vegetables in your fridge</span>
                </label>
                <textarea 
                  className="input h-20 resize-none mt-2" 
                  placeholder="Carrots, bell peppers, onions, frozen peas, spinach, mushrooms..."
                  value={formData.vegetables}
                  onChange={(e) => setFormData({...formData, vegetables: e.target.value})}
                ></textarea>
              </div>

              {/* Cooking Method - Full Width */}
              <div className="mt-6">
                <label className="label">How do you want to cook?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                  {cookingMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.cookingMethod === method.value;
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setFormData({...formData, cookingMethod: method.value})}
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

              {/* Cuisine Type - Full Width */}
              <div className="mt-6">
                <label className="label">What type of cuisine are you in the mood for?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                  {cuisineTypes.map((cuisine) => {
                    const Icon = cuisine.icon;
                    const isSelected = formData.cuisineType === cuisine.value;
                    return (
                      <button
                        key={cuisine.value}
                        type="button"
                        onClick={() => setFormData({...formData, cuisineType: cuisine.value})}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center space-y-2 text-center ${
                          isSelected
                            ? `${cuisine.color} border-current shadow-md scale-105`
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? '' : 'text-gray-500'}`} />
                        <span className="text-xs font-medium">{cuisine.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Restrictions - Full Width at Bottom */}
              <div className="mt-6">
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
            </div>

            {/* Usage Information */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Recipe Generations Remaining
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{remainingRecipes}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="font-medium text-gray-900 capitalize">{subscription.tier}</p>
                </div>
              </div>
              {!canGenerate && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <Lock className="h-4 w-4 inline mr-2" />
                    You've reached your monthly limit. Upgrade to Pro for unlimited recipes!
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleGenerateRecipe}
                disabled={!canGenerate || isGenerating}
                className={`btn-primary flex items-center space-x-3 ${
                  (!canGenerate || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{generationProgress || 'Creating Your Recipe...'}</span>
                  </>
                ) : (
                  <>
                    <ChefHat className="h-5 w-5" />
                    <span>{canGenerate ? 'Generate My Recipe' : 'Limit Reached'}</span>
                  </>
                )}
              </button>
              <button className="btn-ghost">
                <BookOpen className="h-5 w-5 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        ) : generatedRecipe ? (
          // Recipe Display
          <div className="space-y-6 relative">
            {/* Loading Overlay for Regeneration */}
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900">Creating New Recipe</p>
                    <p className="text-sm text-gray-600">{generationProgress || 'Please wait...'}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Recipe Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                    <Utensils className="h-4 w-4 mr-2" />
                    {generatedRecipe?.situation}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{generatedRecipe?.title}</h1>
                  <p className="text-lg text-gray-700 mb-6">{generatedRecipe?.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {generatedRecipe.tags?.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="ml-6 text-right">
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">{generatedRecipe.cookTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="font-medium">{generatedRecipe.servings}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Star className="h-5 w-5 mr-2" />
                    <span className="font-medium">{generatedRecipe.difficulty}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowRecipe(false)}
                  className="btn-ghost"
                >
                  ← Back to Form
                </button>
                <button 
                  onClick={() => handleGenerateRecipe(true)}
                  disabled={isGenerating}
                  className={`btn-ghost flex items-center space-x-2 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <ChefHat className="h-4 w-4" />
                      <span>Try Again</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handlePrintRecipe}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Recipe</span>
                </button>
                <button 
                  onClick={handleSaveRecipe}
                  disabled={isGenerating}
                  className={`btn-primary ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Save Recipe
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Ingredients */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {generatedRecipe.ingredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ChefHat className="h-5 w-5 mr-2 text-blue-600" />
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {generatedRecipe.instructions?.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-green-600" />
                Pro Tips & Variations
              </h2>
              <ul className="space-y-3">
                {generatedRecipe.tips?.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          // Loading or error state
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Generate a recipe to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;