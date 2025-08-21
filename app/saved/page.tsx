'use client';

import React, { useState } from 'react';
import { Calendar, ChefHat, Clock, Users, Star, Search, Filter, BookOpen, Trash2, Edit3, Printer } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { createTestRecipe, createTestMealPlan } from '../../lib/testData';
import { SubscriptionTier, Recipe } from '@/types';


const SavedPage = () => {
  const { recipes, mealPlans, deleteRecipe, deleteMealPlan, addRecipe, addMealPlan, subscription, usage, canEditRecipe, updateSubscription, updateRecipe } = useApp();
  const [activeTab, setActiveTab] = useState('recipes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCookTime, setFilterCookTime] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Debug logging
  console.log('SavedPage: Current recipes count:', recipes.length);
  console.log('SavedPage: Current recipes:', recipes);

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

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handlePrintRecipe = () => {
    window.print();
  };

  const handleEditRecipe = (recipe: Recipe) => {
    if (canEdit) {
      setEditingRecipe(recipe);
      setEditedRecipe({ ...recipe }); // Create a copy for editing
    }
  };

  const handleSaveRecipe = async () => {
    if (editedRecipe && editingRecipe) {
      try {
        await updateRecipe(editingRecipe.id, editedRecipe);
        setEditingRecipe(null);
        setEditedRecipe(null);
      } catch (error) {
        console.error('Error updating recipe:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
    setEditedRecipe(null);
  };

  const updateEditedRecipe = (field: keyof Recipe, value: any) => {
    if (editedRecipe) {
      setEditedRecipe({
        ...editedRecipe,
        [field]: value
      });
    }
  };

  const addIngredient = () => {
    if (editedRecipe) {
      setEditedRecipe({
        ...editedRecipe,
        ingredients: [...editedRecipe.ingredients, '']
      });
    }
  };

  const removeIngredient = (index: number) => {
    if (editedRecipe) {
      setEditedRecipe({
        ...editedRecipe,
        ingredients: editedRecipe.ingredients.filter((_, i) => i !== index)
      });
    }
  };

  const updateIngredient = (index: number, value: string) => {
    if (editedRecipe) {
      const newIngredients = [...editedRecipe.ingredients];
      newIngredients[index] = value;
      setEditedRecipe({
        ...editedRecipe,
        ingredients: newIngredients
      });
    }
  };

  const addInstruction = () => {
    if (editedRecipe) {
      setEditedRecipe({
        ...editedRecipe,
        instructions: [...editedRecipe.instructions, '']
      });
    }
  };

  const removeInstruction = (index: number) => {
    if (editedRecipe) {
      setEditedRecipe({
        ...editedRecipe,
        instructions: editedRecipe.instructions.filter((_, i) => i !== index)
      });
    }
  };

  const updateInstruction = (index: number, value: string) => {
    if (editedRecipe) {
      const newInstructions = [...editedRecipe.instructions];
      newInstructions[index] = value;
      setEditedRecipe({
        ...editedRecipe,
        instructions: newInstructions
      });
    }
  };

  const filteredRecipes = recipes
    .filter(recipe => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.instructions.some(instruction => instruction.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.situation.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Difficulty filter
      const matchesDifficulty = filterDifficulty === 'all' || recipe.difficulty.toLowerCase() === filterDifficulty;
      
      // Cook time filter
      let matchesCookTime = true;
      if (filterCookTime !== 'all') {
        const cookTimeNum = parseInt(recipe.cookTime.match(/\d+/)?.[0] || '0');
        if (filterCookTime === 'quick' && cookTimeNum > 30) matchesCookTime = false;
        if (filterCookTime === 'medium' && (cookTimeNum <= 30 || cookTimeNum > 60)) matchesCookTime = false;
        if (filterCookTime === 'long' && cookTimeNum <= 60) matchesCookTime = false;
      }
      
      return matchesSearch && matchesDifficulty && matchesCookTime;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'cooktime':
          const aTime = parseInt(a.cookTime.match(/\d+/)?.[0] || '0');
          const bTime = parseInt(b.cookTime.match(/\d+/)?.[0] || '0');
          return aTime - bTime;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Intermediate': 2, 'Expert': 3 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 2) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 2);
        default:
          return 0;
      }
    });

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
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, ingredients, instructions, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full input pl-10"
              />
            </div>
            
            {/* Filters - Only show for recipes tab */}
            {activeTab === 'recipes' && (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
                  >
                    <option value="all">Any Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                  
                  <select
                    value={filterCookTime}
                    onChange={(e) => setFilterCookTime(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
                  >
                    <option value="all">Any Cook Time</option>
                    <option value="quick">Quick (≤30 min)</option>
                    <option value="medium">Medium (30-60 min)</option>
                    <option value="long">Long (60+ min)</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="cooktime">Cook Time</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                  
                  {/* Clear filters button */}
                  {(filterDifficulty !== 'all' || filterCookTime !== 'all' || sortBy !== 'recent' || searchTerm !== '') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterDifficulty('all');
                        setFilterCookTime('all');
                        setSortBy('recent');
                      }}
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Tab Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-200 pt-4">
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
              filteredRecipes.map((recipe) => {
                // Check if recipe was added recently (within last 5 minutes)
                const isRecentlyAdded = new Date(recipe.dateAdded).getTime() > Date.now() - 5 * 60 * 1000;
                return (
                <div key={recipe.id} className={`bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-shadow ${
                  isRecentlyAdded ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}>
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
                      <button 
                        onClick={() => handleViewRecipe(recipe)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <BookOpen className="h-4 w-4 inline mr-2" />
                        View Recipe
                      </button>
                      <button 
                        onClick={() => handleEditRecipe(recipe)}
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
                );
              })
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

        {/* View Recipe Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:bg-white print:relative print:p-0">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-w-full print:max-h-full print:rounded-none print:shadow-none">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedRecipe.title}</h1>
                    <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedRecipe.cookTime}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedRecipe.servings}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {selectedRecipe.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 print:hidden">
                    <button 
                      onClick={handlePrintRecipe}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                      title="Print Recipe"
                    >
                      <Printer className="h-4 w-4" />
                      <span className="text-sm font-medium">Print</span>
                    </button>
                    <button 
                      onClick={() => setSelectedRecipe(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
                    <ol className="space-y-3">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700">
                          <span className="font-semibold text-blue-600 mr-2">{index + 1}.</span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                
                {selectedRecipe.notes && (
                  <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Your Notes:</h3>
                    <p className="text-yellow-800">{selectedRecipe.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Recipe Modal */}
        {editingRecipe && editedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Edit Recipe</h1>
                  <button 
                    onClick={handleCancelEdit}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title</label>
                    <input 
                      type="text" 
                      value={editedRecipe.title}
                      onChange={(e) => updateEditedRecipe('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input 
                      type="text" 
                      value={editedRecipe.description}
                      onChange={(e) => updateEditedRecipe('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Recipe Details */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time</label>
                    <input 
                      type="text" 
                      value={editedRecipe.cookTime}
                      onChange={(e) => updateEditedRecipe('cookTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 30 minutes"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                    <input 
                      type="text" 
                      value={editedRecipe.servings}
                      onChange={(e) => updateEditedRecipe('servings', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 4 people"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select 
                      value={editedRecipe.difficulty}
                      onChange={(e) => updateEditedRecipe('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                    <button 
                      onClick={addIngredient}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      + Add Ingredient
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input 
                          type="text" 
                          value={ingredient}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 1 cup flour"
                        />
                        <button 
                          onClick={() => removeIngredient(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Instructions</label>
                    <button 
                      onClick={addInstruction}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      + Add Step
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editedRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                          {index + 1}
                        </span>
                        <textarea 
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Describe this step..."
                        />
                        <button 
                          onClick={() => removeInstruction(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Personal Notes</label>
                  <textarea 
                    value={editedRecipe.notes || ''}
                    onChange={(e) => updateEditedRecipe('notes', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add your personal notes, modifications, or tips..."
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveRecipe}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;