'use client';

import React, { useState } from 'react';
import { Clock, Users, ChefHat, Utensils, CheckCircle, BookOpen, Star, Lock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getRemainingRecipes } from '../../lib/subscription';

const testRecipe = {
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
  const { subscription, usage, canGenerateRecipe, incrementRecipeUsage } = useApp();
  const [showRecipe, setShowRecipe] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState(['None']);

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

  const handleGenerateRecipe = async () => {
    const success = await incrementRecipeUsage();
    if (success) {
      setShowRecipe(true);
    }
  };

  const remainingRecipes = getRemainingRecipes(subscription, usage);
  const canGenerate = canGenerateRecipe();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recipe Generator</h1>
          <p className="text-xl text-gray-600">
            Tell us your situation and we'll create the perfect recipe for your family
          </p>
        </div>
        
        {!showRecipe ? (
          // Recipe Generation Form
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Your Cooking Situation?</h2>
              
              {/* Cooking Situation - Full Width at Top */}
              <div className="mb-6">
                <label className="label">Cooking Situation</label>
                <select className="input">
                  <option>Protein + random stuff in fridge</option>
                  <option>Need to stretch small portions</option>
                  <option>Want minimal cleanup</option>
                  <option>Making tomorrow's lunch too</option>
                </select>
              </div>

              {/* Other fields in 2x2 grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="label">Family Size</label>
                    <select className="input">
                      <option>2-3 people</option>
                      <option>4-5 people</option>
                      <option>6+ people</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label">Available Time</label>
                    <select className="input">
                      <option>15-20 minutes</option>
                      <option>30-45 minutes</option>
                      <option>1 hour+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">What protein do you have?</label>
                    <input type="text" className="input" placeholder="Chicken thighs, ground beef, etc." />
                  </div>

                  <div>
                    <label className="label">Vegetables in your fridge</label>
                    <textarea className="input h-24 resize-none" placeholder="Carrots, bell peppers, onions, frozen peas..."></textarea>
                  </div>
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
                disabled={!canGenerate}
                className={`btn-primary flex items-center space-x-3 ${
                  !canGenerate ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChefHat className="h-5 w-5" />
                <span>{canGenerate ? 'Generate My Recipe' : 'Limit Reached'}</span>
              </button>
              <button className="btn-ghost">
                <BookOpen className="h-5 w-5 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          // Recipe Display
          <div className="space-y-6">
            {/* Recipe Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                    <Utensils className="h-4 w-4 mr-2" />
                    {testRecipe.situation}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{testRecipe.title}</h1>
                  <p className="text-lg text-gray-700 mb-6">{testRecipe.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {testRecipe.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="ml-6 text-right">
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">{testRecipe.cookTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="font-medium">{testRecipe.servings}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Star className="h-5 w-5 mr-2" />
                    <span className="font-medium">{testRecipe.difficulty}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowRecipe(false)}
                  className="btn-ghost"
                >
                  ← Generate Another
                </button>
                <button className="btn-primary">
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
                  {testRecipe.ingredients.map((ingredient, index) => (
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
                  {testRecipe.instructions.map((step, index) => (
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
                {testRecipe.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;