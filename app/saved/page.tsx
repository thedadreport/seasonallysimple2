'use client';

import React, { useState } from 'react';
import { Calendar, ChefHat, Clock, Users, Star, Search, Filter, BookOpen, Trash2, Edit3 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { createTestRecipe, createTestMealPlan } from '../../lib/testData';
import { SubscriptionTier } from '@/types';


const SavedPage = () => {
  const { recipes, mealPlans, deleteRecipe, deleteMealPlan, addRecipe, addMealPlan, subscription, usage, canEditRecipe, updateSubscription } = useApp();
  const [activeTab, setActiveTab] = useState('recipes');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTestData = () => {
    addRecipe(createTestRecipe());
    addMealPlan(createTestMealPlan());
  };

  const handleUpgrade = (tier: SubscriptionTier) => {
    const newSubscription = {
      tier,
      status: 'active' as const,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      autoRenew: true,
    };
    updateSubscription(newSubscription);
  };

  const canEdit = canEditRecipe();

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredMealPlans = mealPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.focus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Saved Recipes & Plans</h1>
          <p className="text-xl text-gray-600">
            Your collection of favorite recipes and meal plans, ready to cook again
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes and meal plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('recipes')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'recipes' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChefHat className="h-4 w-4 inline mr-2" />
                Recipes ({recipes.length})
              </button>
              <button
                onClick={() => setActiveTab('meal-plans')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'meal-plans' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Meal Plans ({mealPlans.length})
              </button>
              <button
                onClick={handleAddTestData}
                className="px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-lg hover:bg-green-200 transition-all font-medium"
              >
                Add Test Data
              </button>
              <button
                onClick={() => handleUpgrade('pro')}
                className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-all font-medium"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => handleUpgrade('free')}
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Back to Free
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'recipes' ? (
          <div className="space-y-4">
            {filteredRecipes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your search or save some recipes from the recipe generator.</p>
              </div>
            ) : (
              filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mr-3">
                          <ChefHat className="h-3 w-3 mr-1" />
                          {recipe.situation}
                        </div>
                        <span className="text-sm text-gray-500">Saved {recipe.dateAdded}</span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
                      <p className="text-gray-600 mb-4">{recipe.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {recipe.cookTime}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {recipe.servings}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {recipe.difficulty}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {recipe.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Your notes:</strong> {recipe.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col space-y-2">
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                        <BookOpen className="h-4 w-4 inline mr-2" />
                        View Recipe
                      </button>
                      <button 
                        disabled={!canEdit}
                        className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
                          canEdit 
                            ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200' 
                            : 'bg-orange-50 text-orange-700 border-orange-200 cursor-not-allowed'
                        }`}
                      >
                        <Edit3 className="h-4 w-4 inline mr-2" />
                        {canEdit ? 'Edit Recipe' : 'Edit (Pro Feature)'}
                      </button>
                      <button 
                        onClick={() => deleteRecipe(recipe.id)}
                        className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4 inline mr-2" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMealPlans.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No meal plans found</h3>
                <p className="text-gray-600">Try adjusting your search or create some meal plans from the weekly planner.</p>
              </div>
            ) : (
              filteredMealPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          {plan.focus}
                        </div>
                        <span className="text-sm text-gray-500">Saved {plan.dateAdded}</span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h2>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <span className="font-medium text-green-600">{plan.totalCost}</span>
                          <span className="ml-1">total cost</span>
                        </div>
                        <div className="flex items-center">
                          <ChefHat className="h-4 w-4 mr-1" />
                          {plan.numMeals} meals
                        </div>
                      </div>

                      {plan.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Your notes:</strong> {plan.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col space-y-2">
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                        <BookOpen className="h-4 w-4 inline mr-2" />
                        View Plan
                      </button>
                      <button 
                        disabled={!canEdit}
                        className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
                          canEdit 
                            ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200' 
                            : 'bg-orange-50 text-orange-700 border-orange-200 cursor-not-allowed'
                        }`}
                      >
                        <Edit3 className="h-4 w-4 inline mr-2" />
                        {canEdit ? 'Edit Plan' : 'Edit (Pro Feature)'}
                      </button>
                      <button 
                        onClick={() => deleteMealPlan(plan.id)}
                        className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4 inline mr-2" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Empty State for New Users */}
        {recipes.length === 0 && mealPlans.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Building Your Recipe Collection</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save recipes and meal plans from our generator to build your personal collection of family favorites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                <ChefHat className="h-5 w-5 mr-2" />
                Generate a Recipe
              </button>
              <button className="btn-ghost">
                <Calendar className="h-5 w-5 mr-2" />  
                Plan My Week
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;