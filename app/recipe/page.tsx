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
  { value: 'No Preference', label: 'No Preference', icon: Globe, color: 'bg-warmGray-50 border-warmGray-200 text-warmGray-700' },
  { value: 'American', label: 'American', icon: Star, color: 'bg-terracotta-50 border-terracotta-200 text-terracotta-700' },
  { value: 'Italian', label: 'Italian', icon: Utensils, color: 'bg-sage-50 border-sage-200 text-sage-700' },
  { value: 'Mexican', label: 'Mexican', icon: Flame, color: 'bg-copper-50 border-copper-200 text-copper-700' },
  { value: 'Asian', label: 'Asian', icon: ChefHat, color: 'bg-cream-50 border-cream-200 text-cream-700' },
  { value: 'Mediterranean', label: 'Mediterranean', icon: Fish, color: 'bg-navy-50 border-navy-200 text-navy-700' },
  { value: 'Indian', label: 'Indian', icon: Flame, color: 'bg-copper-50 border-copper-200 text-copper-700' },
  { value: 'Thai', label: 'Thai', icon: Timer, color: 'bg-sage-50 border-sage-200 text-sage-700' },
  { value: 'French', label: 'French', icon: Star, color: 'bg-navy-50 border-navy-200 text-navy-700' },
  { value: 'Middle Eastern', label: 'Middle Eastern', icon: MapPin, color: 'bg-cream-50 border-cream-200 text-cream-700' },
  { value: 'Southern', label: 'Southern', icon: Wheat, color: 'bg-terracotta-50 border-terracotta-200 text-terracotta-700' },
  { value: 'BBQ', label: 'BBQ', icon: Flame, color: 'bg-warmGray-50 border-warmGray-200 text-warmGray-700' }
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

const difficultyLevels = [
  { value: 'Easy', label: 'Easy', icon: Star, color: 'bg-sage-50 border-sage-200 text-sage-700', description: 'Simple recipes with basic techniques' },
  { value: 'Intermediate', label: 'Intermediate', icon: ChefHat, color: 'bg-cream-50 border-cream-200 text-cream-700', description: 'Moderate complexity, some cooking skills needed' },
  { value: 'Advanced', label: 'Advanced', icon: Flame, color: 'bg-terracotta-50 border-terracotta-200 text-terracotta-700', description: 'Advanced techniques and longer prep time' }
];

const RecipePage = () => {
  const { subscription, usage, canGenerateRecipe, incrementRecipeUsage, addRecipe, preferences } = useApp();
  const [showRecipe, setShowRecipe] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState(['None']);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedRecipe, setSavedRecipe] = useState<any>(null);
  const [showGuidance, setShowGuidance] = useState(() => {
    // Show guidance for first-time visitors
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('recipe-guidance-seen');
    }
    return false;
  });
  
  // Form state
  const [formData, setFormData] = useState({
    familySize: 4, // Now a number for the picker
    availableTime: '30 minutes',
    cookingSituation: "Tonight's Dinner",
    protein: '',
    vegetables: '',
    cookingMethod: '',
    cuisineType: 'No Preference',
    difficulty: 'Easy',
    seasonal: false
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

  const hideGuidance = () => {
    setShowGuidance(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recipe-guidance-seen', 'true');
    }
  };

  // Fun cooking-related loading messages
  const cookingSteps = [
    { icon: '🥬', message: 'Inspecting your ingredients...', duration: 2000 },
    { icon: '👨‍🍳', message: 'Consulting our chef network...', duration: 2500 },
    { icon: '🔥', message: 'Heating up the creative process...', duration: 2000 },
    { icon: '🥄', message: 'Stirring in some culinary magic...', duration: 2000 },
    { icon: '🌿', message: 'Adding a pinch of inspiration...', duration: 2000 },
    { icon: '⏰', message: 'Timing the perfect flavor balance...', duration: 2000 },
    { icon: '📖', message: 'Writing your personalized recipe...', duration: 2500 },
    { icon: '✨', message: 'Adding the finishing touches...', duration: 1500 },
  ];

  const funMessages = [
    'Did you know? The average home cook uses only 9-12 recipes regularly!',
    'Cooking tip: Salt enhances sweetness and reduces bitterness.',
    'Fun fact: Mise en place means "everything in its place" in French.',
    'Pro tip: Let meat rest after cooking to redistribute juices.',
    'Kitchen wisdom: Taste as you go - your palate is your best guide.',
    'Chef secret: A little acid (lemon/vinegar) brightens most dishes.',
    'Cooking magic: Caramelization starts around 320°F (160°C).',
    'Food science: Resting dough develops gluten for better texture.',
  ];


  const handleGenerateRecipe = async (isRegeneration = false) => {
    if (!isRegeneration) {
      const success = await incrementRecipeUsage();
      if (!success) return;
    }

    setIsGenerating(true);
    setError(null);
    setSavedRecipe(null);
    setCurrentStep(0);
    setCurrentMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
    
    try {
      // Animate through cooking steps
      let totalTime = 0;
      cookingSteps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentStep(index);
          setGenerationProgress(step.message);
          if (index < cookingSteps.length - 1) {
            // Change fun message occasionally
            if (Math.random() < 0.4) {
              setCurrentMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
            }
          }
        }, totalTime);
        totalTime += step.duration;
      });

      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          familySize: `${formData.familySize} people`,
          dietaryRestrictions: selectedDiets.filter(d => d !== 'None'),
          cookingStyle: preferences?.cookingStyle || ''
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setGeneratedRecipe(data.recipe);
      setShowRecipe(true);
      setGenerationProgress('');
      setCurrentStep(0);
      setCurrentMessage('');
    } catch (error) {
      console.error('Recipe generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate recipe');
      setGenerationProgress('');
      setCurrentStep(0);
      setCurrentMessage('');
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50/30 to-amber-50/40 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-light text-stone-700 mb-6 italic">Recipe magic maker</h1>
          <p className="text-base text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
            Share your kitchen moment and we'll craft something wonderful for your family
          </p>
        </div>
        
        {showGuidance && (
          <div className="bg-gradient-to-r from-sage-50/90 via-white/80 to-terracotta-50/70 border border-sage-200/50 rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sage-100 rounded-full mb-4">
                <ChefHat className="h-6 w-6 text-sage-600" />
              </div>
              <h3 className="text-xl font-serif font-medium text-sage-800 mb-2">How Recipe Generation Works</h3>
              <p className="text-sage-600 font-light leading-relaxed max-w-xl mx-auto">
                Tell us what's in your kitchen and what you're feeling, and we'll create a personalized recipe just for you.
              </p>
            </div>
            
            <div className="bg-white/60 rounded-xl p-6 mb-6">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sage-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-warmGray-800">Share your ingredients</p>
                    <p className="text-warmGray-600 mt-1">Tell us what proteins and veggies you have</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-terracotta-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-warmGray-800">Set your preferences</p>
                    <p className="text-warmGray-600 mt-1">Choose difficulty, time, and cooking method</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-copper-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-copper-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-warmGray-800">Get your custom recipe</p>
                    <p className="text-warmGray-600 mt-1">Complete with instructions, tips, and variations</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={hideGuidance}
                className="px-6 py-2 bg-sage-600 text-white rounded-full text-sm font-medium hover:bg-sage-700 transition-colors"
              >
                Got it, let me try!
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-rose-50/50 border border-rose-200/50 rounded-2xl p-6 mb-8">
            <p className="text-rose-700 font-light">{error}</p>
          </div>
        )}
        
        {savedRecipe && (
          <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-stone-600 mt-0.5" />
                <div>
                  <h3 className="font-light text-stone-700">Recipe saved successfully!</h3>
                  <p className="text-stone-600 text-sm mt-1 font-light">
                    "{savedRecipe.title}" has been saved to My Recipes.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <a
                  href="/saved"
                  className="inline-flex items-center px-3 py-1 text-sm bg-sage-100 text-sage-700 border border-sage-300 rounded-lg hover:bg-sage-200 transition-colors font-body"
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
                  {["Tonight's Dinner", "Minimal Cleanup", "Stretch a Protein", "Make Tomorrow's Lunch", "Special Occasion"].map((situation) => (
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
                    <span>What protein do you have? <span className="text-gray-500 font-normal">(optional)</span></span>
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
                  <span>Vegetables in your fridge <span className="text-gray-500 font-normal">(optional)</span></span>
                </label>
                <textarea 
                  className="input h-20 resize-none mt-2" 
                  placeholder="Carrots, bell peppers, onions, frozen peas, spinach, mushrooms..."
                  value={formData.vegetables}
                  onChange={(e) => setFormData({...formData, vegetables: e.target.value})}
                ></textarea>
              </div>

              {/* Recipe Difficulty - Full Width */}
              <div className="mt-6">
                <label className="label">What difficulty level do you prefer?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  {difficultyLevels.map((level) => {
                    const Icon = level.icon;
                    const isSelected = formData.difficulty === level.value;
                    return (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({...formData, difficulty: level.value})}
                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 text-left ${
                          isSelected
                            ? `${level.color} border-current shadow-md scale-105`
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className={`h-5 w-5 ${isSelected ? '' : 'text-gray-500'}`} />
                          <span className="text-lg font-semibold">{level.label}</span>
                        </div>
                        <p className={`text-sm ${isSelected ? '' : 'text-gray-500'}`}>
                          {level.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seasonal Toggle */}
              <div className="mt-6">
                <label className="label">Recipe Focus</label>
                <div className="flex items-center space-x-4 mt-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, seasonal: !formData.seasonal})}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.seasonal
                        ? 'bg-green-50 border-green-300 text-green-700 shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.seasonal
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-400'
                    }`}>
                      {formData.seasonal && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Use Seasonal Ingredients</span>
                      <p className="text-sm text-gray-500 mt-1">
                        Focus on fresh, in-season produce for the best flavors
                      </p>
                    </div>
                  </button>
                </div>
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
                onClick={() => handleGenerateRecipe()}
                disabled={!canGenerate || isGenerating}
                className={`btn-primary flex items-center space-x-3 ${
                  (!canGenerate || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="text-lg animate-bounce">
                      {cookingSteps[currentStep]?.icon || '👨‍🍳'}
                    </span>
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
            {/* Enhanced Cooking Animation Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-br from-sage-50/95 via-white/90 to-terracotta-50/95 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                <div className="bg-white/90 rounded-2xl shadow-xl border border-sage-200/50 p-8 max-w-md mx-4 text-center">
                  {/* Animated Icon */}
                  <div className="mb-6 relative">
                    <div className="text-6xl animate-bounce">
                      {cookingSteps[currentStep]?.icon || '👨‍🍳'}
                    </div>
                    <div className="absolute inset-0 animate-ping">
                      <div className="w-20 h-20 bg-sage-200/30 rounded-full mx-auto mt-2"></div>
                    </div>
                  </div>
                  
                  {/* Main Progress Message */}
                  <div className="mb-4">
                    <p className="text-xl font-serif font-medium text-sage-800 mb-2">
                      {generationProgress || 'Cooking up something special...'}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-sage-100 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-sage-500 to-terracotta-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${Math.min(((currentStep + 1) / cookingSteps.length) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Fun Message */}
                  {currentMessage && (
                    <div className="bg-sage-50/80 rounded-xl p-4 border border-sage-200/50">
                      <p className="text-sm text-sage-700 font-light italic">
                        💡 {currentMessage}
                      </p>
                    </div>
                  )}
                  
                  {/* Cooking Steps Indicator */}
                  <div className="flex justify-center space-x-2 mt-6">
                    {cookingSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index <= currentStep
                            ? 'bg-sage-500 scale-110'
                            : 'bg-sage-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Recipe Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-3">
                  <Utensils className="h-3 w-3 mr-2" />
                  {generatedRecipe?.situation}
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{generatedRecipe?.title}</h1>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{generatedRecipe?.description}</p>
                
                {/* Mobile Recipe Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Clock className="h-4 w-4 mx-auto text-gray-500 mb-1" />
                    <div className="text-xs text-gray-600 font-medium">{generatedRecipe.cookTime}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Users className="h-4 w-4 mx-auto text-gray-500 mb-1" />
                    <div className="text-xs text-gray-600 font-medium">{generatedRecipe.servings}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Star className="h-4 w-4 mx-auto text-green-500 mb-1" />
                    <div className="text-xs text-gray-600 font-medium">{generatedRecipe.difficulty}</div>
                  </div>
                </div>
                
                {/* Mobile Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {generatedRecipe.tags?.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:block">
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
                      <span className="animate-bounce">
                        {cookingSteps[currentStep]?.icon || '👨‍🍳'}
                      </span>
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