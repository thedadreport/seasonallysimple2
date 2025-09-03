'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChefHat, Leaf, Save, Loader2, CheckCircle, ArrowRight, Calendar, BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

// Force this page to be dynamic
export const dynamic = 'force-dynamic';

const dietaryRestrictions = [
  'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Soy-Free', 'Egg-Free', 'Keto', 'Low-Carb', 'Paleo', 'Whole30',
  'Mediterranean', 'Low-Sodium', 'Diabetic-Friendly', 'Heart-Healthy', 'Kosher', 'Halal'
];

const cuisineTypes = [
  'No Preference', 'American', 'Italian', 'Mexican', 'Asian', 'Chinese', 'Japanese', 
  'Thai', 'Indian', 'French', 'Greek', 'Spanish', 'Middle Eastern', 'Korean', 
  'Vietnamese', 'Brazilian', 'Moroccan', 'German', 'British', 'Caribbean'
];

interface UserPreferences {
  cookingSkill: string;
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  useSeasonalIngredients: boolean;
  cookingStyle?: string; // New field for cooking philosophy/style
}

// Component that uses useSearchParams - must be wrapped in Suspense
function PreferencesContent() {
  const { data: session } = useSession();
  const { refreshUserData } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams?.get('onboarding') === 'true';
  const [preferences, setPreferences] = useState<UserPreferences>({
    cookingSkill: "Intermediate (some techniques)",
    dietaryRestrictions: ["None"],
    cuisinePreferences: ["No Preference"],
    useSeasonalIngredients: false,
    cookingStyle: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences on component mount
  useEffect(() => {
    if (session?.user) {
      loadPreferences();
    }
  }, [session]);

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/preferences');
      const data = await response.json();
      
      if (data.success) {
        setPreferences(data.preferences);
      } else {
        console.error('Failed to load preferences:', data.error);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (data.success) {
        setSaveSuccess(true);
        // Refresh user data in context to update preferences
        await refreshUserData();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDiet = (diet: string) => {
    if (diet === 'None') {
      setPreferences(prev => ({ ...prev, dietaryRestrictions: ['None'] }));
    } else {
      const newDiets = preferences.dietaryRestrictions.filter(d => d !== 'None');
      if (preferences.dietaryRestrictions.includes(diet)) {
        const filtered = newDiets.filter(d => d !== diet);
        setPreferences(prev => ({ 
          ...prev, 
          dietaryRestrictions: filtered.length === 0 ? ['None'] : filtered 
        }));
      } else {
        setPreferences(prev => ({ 
          ...prev, 
          dietaryRestrictions: [...newDiets, diet] 
        }));
      }
    }
  };

  const toggleCuisine = (cuisine: string) => {
    if (cuisine === 'No Preference') {
      setPreferences(prev => ({ ...prev, cuisinePreferences: ['No Preference'] }));
    } else {
      const newCuisines = preferences.cuisinePreferences.filter(c => c !== 'No Preference');
      if (preferences.cuisinePreferences.includes(cuisine)) {
        const filtered = newCuisines.filter(c => c !== cuisine);
        setPreferences(prev => ({ 
          ...prev, 
          cuisinePreferences: filtered.length === 0 ? ['No Preference'] : filtered 
        }));
      } else {
        setPreferences(prev => ({ 
          ...prev, 
          cuisinePreferences: [...newCuisines, cuisine] 
        }));
      }
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmCream via-sage-50 to-cream-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {isOnboarding ? (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-full mb-4">
              <ChefHat className="h-8 w-8 text-sage-600" />
            </div>
            <h1 className="text-4xl font-display font-bold text-warmGray-900 mb-4">Welcome to Seasonally Simple!</h1>
            <p className="text-xl text-warmGray-600 font-body mb-6">
              Let's personalize your cooking experience in just a few steps
            </p>
            
            {/* How it Works Guide */}
            <div className="bg-white/80 backdrop-blur-sm border border-sage-200 rounded-2xl p-6 mb-8 text-left max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-warmGray-800 mb-4 text-center">Here's what you can do with Seasonally Simple:</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChefHat className="h-4 w-4 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-warmGray-800 mb-1">Generate Custom Recipes</h3>
                    <p className="text-sm text-warmGray-600">Get personalized recipes based on your pantry ingredients, dietary needs, and cooking style</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4 text-terracotta-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-warmGray-800 mb-1">Weekly Meal Plans</h3>
                    <p className="text-sm text-warmGray-600">Create complete meal plans with shopping lists and prep guides (Pro+ feature)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-copper-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="h-4 w-4 text-copper-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-warmGray-800 mb-1">Save & Organize</h3>
                    <p className="text-sm text-warmGray-600">Keep all your favorite recipes and meal plans in one place for easy access</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Leaf className="h-4 w-4 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-warmGray-800 mb-1">Seasonal Focus</h3>
                    <p className="text-sm text-warmGray-600">Recipes that celebrate fresh, in-season ingredients for better flavor and value</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-warmGray-900 mb-4">Your Culinary Journey</h1>
            <p className="text-xl text-warmGray-600 font-body">
              Share your cooking story to create personalized recipes that feel authentically yours
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">Preferences saved successfully!</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-8">
          {/* Cooking Skill Level */}
          <div>
            <label className="label flex items-center space-x-2">
              <ChefHat className="h-4 w-4 text-orange-600" />
              <span>Cooking Skill Level</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {[
                { value: "Beginner (simple meals)", label: "Beginner", desc: "Simple recipes with basic techniques" },
                { value: "Intermediate (some techniques)", label: "Intermediate", desc: "Moderate complexity, some skills needed" },
                { value: "Advanced (any complexity)", label: "Advanced", desc: "Complex techniques and longer prep time" }
              ].map((skill) => (
                <button
                  key={skill.value}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, cookingSkill: skill.value }))}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    preferences.cookingSkill === skill.value
                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold">{skill.label}</div>
                  <div className="text-sm mt-1">{skill.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="label">Dietary Restrictions</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
              {dietaryRestrictions.map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleDiet(diet)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    preferences.dietaryRestrictions.includes(diet)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Preferences */}
          <div>
            <label className="label">Cuisine Preferences</label>
            <p className="text-sm text-gray-600 mb-3">Select the cuisines you enjoy cooking and eating</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 mt-3">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    preferences.cuisinePreferences.includes(cuisine)
                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>


          {/* Cooking Style & Philosophy */}
          <div>
            <label className="label flex items-center space-x-2 mb-3">
              <ChefHat className="h-4 w-4 text-stone-600" />
              <span>How do you like to cook?</span>
            </label>
            <div className="bg-gradient-to-r from-stone-50 to-rose-50/30 border border-stone-200/50 rounded-2xl p-6">
              <p className="text-sm text-stone-600 font-light mb-4 leading-relaxed">
                Share your cooking philosophy, favorite chef styles, preferred techniques, or types of dishes you love. 
                This helps us create recipes that truly match your approach to cooking.
              </p>
              <textarea
                className="w-full p-4 border border-stone-200 rounded-xl bg-white/80 text-stone-700 placeholder-stone-400 text-sm resize-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all"
                rows={4}
                placeholder="Describe your cooking style... e.g., 'I love making one-pot meals that are healthy but don't require too many steps. Think Ina Garten meets weeknight convenience.' or 'I enjoy Julia Child's French techniques and bold flavors.'"
                value={preferences.cookingStyle || ''}
                onChange={(e) => setPreferences(prev => ({ ...prev, cookingStyle: e.target.value }))}
              />
            </div>
          </div>

          {/* Seasonal Ingredients Toggle */}
          <div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Use Seasonal Ingredients</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Prefer fresh, in-season produce for better flavor and lower costs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreferences(prev => ({ 
                  ...prev, 
                  useSeasonalIngredients: !prev.useSeasonalIngredients 
                }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.useSeasonalIngredients ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.useSeasonalIngredients ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-4 border-t border-gray-200">
            {isOnboarding ? (
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`btn-primary flex items-center space-x-3 ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Saving Preferences...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Save Preferences</span>
                    </>
                  )}
                </button>
                
                {saveSuccess && (
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <button
                      onClick={() => router.push('/meal-plan?welcome=true')}
                      className="px-8 py-4 bg-sage-600 text-white rounded-full font-medium hover:bg-sage-700 transition-all flex items-center space-x-2 shadow-lg"
                    >
                      <span>Create Your First Meal Plan</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <span className="text-warmGray-400 font-light">or</span>
                    <button
                      onClick={() => router.push('/recipe')}
                      className="px-6 py-3 bg-white border-2 border-sage-200 text-sage-700 rounded-full font-medium hover:border-sage-300 hover:bg-sage-50 transition-all flex items-center space-x-2"
                    >
                      <ChefHat className="h-4 w-4" />
                      <span>Generate a Recipe</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`btn-primary flex items-center space-x-3 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving Preferences...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the content in Suspense
const PreferencesPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-warmCream via-sage-50 to-cream-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-sage-600 mx-auto mb-4" />
          <p className="text-warmGray-600 font-body">Loading your preferences...</p>
        </div>
      </div>
    }>
      <PreferencesContent />
    </Suspense>
  );
};

export default PreferencesPage;