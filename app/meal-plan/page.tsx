'use client';

import React, { useState } from 'react';
import { Calendar, ShoppingCart, Clock, DollarSign, Users, CheckCircle, Star, ChefHat, BookOpen, Lock, Crown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getRemainingMealPlans, formatSubscriptionTier } from '../../lib/subscription';
import SubscriptionUpgrade from '../../components/SubscriptionUpgrade';

const testMealPlan = {
  title: "Budget-Friendly Family Week",
  description: "A complete 5-day meal plan designed for a family of 4, focusing on affordable ingredients and minimal prep time.",
  totalCost: "$87",
  prepTime: "2 hours Sunday prep",
  servings: "4 people, 5 dinners",
  focus: "Budget-Focused",
  meals: [
    {
      day: "Monday",
      recipe: "One-Pot Chicken & Rice Skillet",
      prepTime: "5 min",
      cookTime: "25 min",
      cost: "$12",
      ingredients: ["Chicken thighs", "Rice", "Frozen vegetables", "Onion", "Garlic"],
      prepNotes: "Dice onion and garlic Sunday"
    },
    {
      day: "Tuesday", 
      recipe: "Slow Cooker Beef & Bean Chili",
      prepTime: "10 min",
      cookTime: "6 hours",
      cost: "$15",
      ingredients: ["Ground beef", "Canned beans", "Diced tomatoes", "Onion", "Chili powder"],
      prepNotes: "Brown beef Sunday, add to slow cooker Tuesday morning"
    },
    {
      day: "Wednesday",
      recipe: "Pasta with Turkey Meatballs", 
      prepTime: "15 min",
      cookTime: "20 min",
      cost: "$18",
      ingredients: ["Ground turkey", "Pasta", "Marinara sauce", "Breadcrumbs", "Parmesan"],
      prepNotes: "Make meatballs Sunday, freeze until needed"
    },
    {
      day: "Thursday",
      recipe: "Sheet Pan Sausage & Vegetables",
      prepTime: "10 min", 
      cookTime: "30 min",
      cost: "$16",
      ingredients: ["Italian sausage", "Bell peppers", "Zucchini", "Red onion", "Potatoes"],
      prepNotes: "Chop all vegetables Sunday"
    },
    {
      day: "Friday",
      recipe: "Leftover Remix: Chili Mac",
      prepTime: "5 min",
      cookTime: "15 min", 
      cost: "$8",
      ingredients: ["Tuesday's leftover chili", "Pasta", "Cheese", "Green onions"],
      prepNotes: "Use Tuesday's chili + fresh pasta"
    }
  ],
  shoppingList: {
    "Proteins": [
      "2 lbs chicken thighs ($8)",
      "1 lb ground beef ($6)",
      "1 lb ground turkey ($5)",
      "1 lb Italian sausage ($7)"
    ],
    "Pantry": [
      "2 lbs jasmine rice ($3)",
      "1 lb pasta ($2)",
      "Marinara sauce ($3)",
      "Canned beans x2 ($3)",
      "Diced tomatoes ($2)"
    ],
    "Produce": [
      "Yellow onions x3 ($2)", 
      "Bell peppers x3 ($4)",
      "Zucchini x2 ($3)",
      "Small potatoes 2lbs ($3)"
    ],
    "Dairy/Other": [
      "Parmesan cheese ($4)",
      "Shredded cheese ($4)",
      "Breadcrumbs ($2)",
      "Frozen mixed vegetables ($3)"
    ]
  },
  prepSchedule: [
    "Dice all onions and garlic (15 min)",
    "Chop vegetables for sheet pan dinner (20 min)", 
    "Brown ground beef for chili (10 min)",
    "Make and freeze turkey meatballs (30 min)",
    "Cook rice for Monday (20 min)"
  ]
};

const dietaryRestrictions = [
  'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Soy-Free', 'Egg-Free', 'Keto', 'Low-Carb', 'Paleo', 'Whole30',
  'Mediterranean', 'Low-Sodium', 'Diabetic-Friendly', 'Heart-Healthy', 'Kosher', 'Halal'
];

const planningFocus = [
  'Budget-focused (minimize cost)',
  'Time-saving (quick meals & prep)', 
  'Healthy eating (balanced nutrition)',
  'Family favorites (crowd-pleasers)',
  'Use what I have (pantry cleanout)'
];

const MealPlanPage = () => {
  const { subscription, usage, canGenerateMealPlan, incrementMealPlanUsage } = useApp();
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState(['None']);
  const [selectedFocus, setSelectedFocus] = useState('Budget-focused (minimize cost)');
  const [numDinners, setNumDinners] = useState(5);

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

  const handleGenerateMealPlan = () => {
    const success = incrementMealPlanUsage();
    if (success) {
      setShowMealPlan(true);
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan Your Week</h2>
              
              {/* Planning Focus - Full Width at Top */}
              <div className="mb-6">
                <label className="label">What's your planning focus?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {planningFocus.map((focus) => (
                    <button
                      key={focus}
                      type="button"
                      onClick={() => setSelectedFocus(focus)}
                      className={`px-4 py-3 text-sm rounded-lg border transition-all text-left ${
                        selectedFocus === focus
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
                      onClick={() => setNumDinners(num)}
                      className={`w-12 h-12 rounded-lg border transition-all font-semibold ${
                        numDinners === num
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Planning Details in 2x2 grid */}
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
                    <label className="label">Weekly Budget Target</label>
                    <select className="input">
                      <option>$50-75 per week</option>
                      <option>$75-100 per week</option>
                      <option>$100-150 per week</option>
                      <option>No budget limit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Available prep time on Sunday</label>
                    <select className="input">
                      <option>30 minutes</option>
                      <option>1-2 hours</option>
                      <option>2-3 hours</option>
                      <option>No Sunday prep</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Cooking skill level</label>
                    <select className="input">
                      <option>Beginner (simple meals)</option>
                      <option>Intermediate (some techniques)</option>
                      <option>Advanced (any complexity)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dietary Restrictions - Full Width */}
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

              {/* Pantry Items */}
              <div className="mt-6">
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
                disabled={!canGenerate}
                className={`btn-primary flex items-center space-x-3 ${
                  !canGenerate ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>{canGenerate ? 'Generate My Meal Plan' : 'Limit Reached'}</span>
              </button>
              <button className="btn-ghost">
                <BookOpen className="h-5 w-5 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          // Meal Plan Display
          <div className="space-y-6">
            {/* Meal Plan Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    {testMealPlan.focus}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{testMealPlan.title}</h1>
                  <p className="text-lg text-gray-700 mb-6">{testMealPlan.description}</p>
                </div>
                
                <div className="ml-6 text-right">
                  <div className="flex items-center text-gray-600 mb-2">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="font-medium">{testMealPlan.totalCost}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">{testMealPlan.prepTime}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="font-medium">{testMealPlan.servings}</span>
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
                {testMealPlan.meals.map((meal, index) => (
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
                        <button className="px-3 py-2 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors">
                          View Full Recipe
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
                  {Object.entries(testMealPlan.shoppingList).map(([category, items]) => (
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
                  {testMealPlan.prepSchedule.map((task, index) => (
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