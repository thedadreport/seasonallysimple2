'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChefHat, Cookie, Flame, Zap, Timer, Wind, Snowflake, Utensils, Leaf, Save, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
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

interface UserPreferences {
  cookingSkill: string;
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  cookingMethods: string[];
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
    cookingMethods: [],
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

  const toggleCookingMethod = (method: string) => {
    if (preferences.cookingMethods.includes(method)) {
      const filtered = preferences.cookingMethods.filter(m => m !== method);
      setPreferences(prev => ({ ...prev, cookingMethods: filtered }));
    } else {
      setPreferences(prev => ({ 
        ...prev, 
        cookingMethods: [...preferences.cookingMethods, method] 
      }));
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-warmGray-900 mb-4">Your Culinary Journey</h1>
          <p className="text-xl text-warmGray-600 font-body">
            Share your cooking story to create personalized recipes that feel authentically yours
          </p>
        </div>

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

          {/* Cooking Methods */}
          <div>
            <label className="label">Preferred Cooking Methods</label>
            <p className="text-sm text-gray-600 mb-3">Select your favorite cooking methods and equipment</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
              {cookingMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = preferences.cookingMethods.includes(method.value);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[
                  "I love Julia Child's French techniques",
                  "Simple, rustic farm-to-table style",
                  "Bold, spicy flavors like in Mexican cuisine", 
                  "Minimalist Japanese-inspired cooking",
                  "Comfort food that feeds a crowd",
                  "Fresh, Mediterranean-style dishes"
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setPreferences(prev => ({ ...prev, cookingStyle: example }))}
                    className={`p-3 text-left text-sm rounded-xl border-2 transition-all hover:border-stone-300 ${
                      preferences.cookingStyle === example
                        ? 'bg-stone-100 border-stone-300 text-stone-700'
                        : 'bg-white/60 border-stone-200/50 text-stone-600 hover:bg-white'
                    }`}
                  >
                    {example}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full p-4 border border-stone-200 rounded-xl bg-white/80 text-stone-700 placeholder-stone-400 text-sm resize-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all"
                rows={3}
                placeholder="Or describe your cooking style in your own words... e.g., 'I love making one-pot meals that are healthy but don't require too many steps. Think Ina Garten meets weeknight convenience.'"
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
                  <button
                    onClick={() => router.push('/meal-plan?welcome=true')}
                    className="px-8 py-3 bg-stone-700 text-white rounded-full font-light hover:bg-stone-800 transition-all flex items-center space-x-2"
                  >
                    <span>Continue to Meal Planning</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
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