'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ShoppingCart, Clock, Users, Star, X, ChefHat, Search, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Recipe } from '@/types';

const CalendarPage = () => {
  const { recipes } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [assignedRecipes, setAssignedRecipes] = useState<Record<string, Recipe>>({});
  
  // Modal search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCookTime, setFilterCookTime] = useState('all');

  // Get monthly calendar grid
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    
    // Start from the Monday of the week containing the first day
    const startDate = new Date(firstDay);
    const startDayOfWeek = firstDay.getDay();
    const daysFromMonday = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Sunday = 0, Monday = 1
    startDate.setDate(firstDay.getDate() - daysFromMonday);
    
    // Generate 42 days (6 weeks) to cover the entire month grid
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    
    return { dates, currentMonth: month, currentYear: year };
  };

  const { dates: monthDates, currentMonth: monthIndex, currentYear } = getMonthDates(currentMonth);

  // Navigate months
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Format month/year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Helper functions
  const handleAddRecipe = (date: Date) => {
    setSelectedDate(date);
    setShowRecipeModal(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      setAssignedRecipes(prev => ({
        ...prev,
        [dateKey]: recipe
      }));
      setShowRecipeModal(false);
      setSelectedDate(null);
    }
  };

  const handleRemoveRecipe = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    setAssignedRecipes(prev => {
      const newAssigned = { ...prev };
      delete newAssigned[dateKey];
      return newAssigned;
    });
  };

  const getAssignedRecipe = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return assignedRecipes[dateKey];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === monthIndex;
  };

  // Filter recipes for modal
  const filteredRecipes = recipes.filter(recipe => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase())) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
  });

  const totalCost = 0.00; // Will calculate based on assigned recipes

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dinner Calendar</h1>
          <p className="text-xl text-gray-600">Plan your dinners for the month</p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <h2 className="text-2xl font-semibold text-gray-800">
            {formatMonthYear(currentMonth)}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="px-4 py-2 bg-orange-100 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-200 transition-colors font-medium">
            Browse Recipes
          </button>
          <button className="px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Generate Shopping List
          </button>
        </div>

        {/* Monthly Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="p-4 bg-gray-50 border-r border-gray-200 last:border-r-0 text-center font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {monthDates.map((date, index) => {
              const assignedRecipe = getAssignedRecipe(date);
              const todayHighlight = isToday(date);
              const currentMonthDay = isCurrentMonth(date);
              
              return (
                <div 
                  key={index}
                  className={`border-r border-b border-gray-200 last:border-r-0 min-h-[120px] p-2 ${
                    currentMonthDay ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50'
                  } transition-colors`}
                >
                  {/* Date Number */}
                  <div className={`text-sm font-medium mb-2 ${
                    todayHighlight 
                      ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                      : currentMonthDay 
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                  }`}>
                    {todayHighlight ? (
                      <span className="text-xs">{date.getDate()}</span>
                    ) : (
                      date.getDate()
                    )}
                  </div>

                  {/* Recipe or Add Button */}
                  {currentMonthDay && (
                    <div className="h-full">
                      {assignedRecipe ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 h-[80px] relative group">
                          <button
                            onClick={() => handleRemoveRecipe(date)}
                            className="absolute top-1 right-1 text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <h4 className="font-medium text-blue-900 text-xs leading-tight mb-1 pr-4">
                            {assignedRecipe.title}
                          </h4>
                          <div className="flex items-center text-xs text-blue-600 mt-auto">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{assignedRecipe.cookTime}</span>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleAddRecipe(date)}
                          className="w-full h-[80px] flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors group border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-lg"
                        >
                          <div className="text-center">
                            <Plus className="h-4 w-4 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs">Add Dinner</span>
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {Object.keys(assignedRecipes).filter(key => {
                    const date = new Date(key);
                    return date.getMonth() === monthIndex && date.getFullYear() === currentYear;
                  }).length}
                </div>
                <div className="text-gray-600 font-medium">Dinners Planned</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  ${totalCost.toFixed(2)}
                </div>
                <div className="text-gray-600 font-medium">Estimated Cost</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {new Date(currentYear, monthIndex + 1, 0).getDate() - Object.keys(assignedRecipes).filter(key => {
                    const date = new Date(key);
                    return date.getMonth() === monthIndex && date.getFullYear() === currentYear;
                  }).length}
                </div>
                <div className="text-gray-600 font-medium">Days Remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Selection Modal */}
        {showRecipeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Select a Recipe</h2>
                    {selectedDate && (
                      <p className="text-gray-600 mt-1">
                        Adding dinner for {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowRecipeModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search recipes by name, ingredients, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Filters */}
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
                        <option value="advanced">Advanced</option>
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
                      
                      {/* Clear filters button */}
                      {(filterDifficulty !== 'all' || filterCookTime !== 'all' || searchTerm !== '') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilterDifficulty('all');
                            setFilterCookTime('all');
                          }}
                          className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {recipes.length === 0 ? (
                  <div className="text-center py-12">
                    <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recipes Yet</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't saved any recipes yet. Generate some recipes first!
                    </p>
                    <button
                      onClick={() => setShowRecipeModal(false)}
                      className="btn-primary"
                    >
                      Generate Recipes
                    </button>
                  </div>
                ) : filteredRecipes.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recipes Found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filters to find more recipes.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterDifficulty('all');
                        setFilterCookTime('all');
                      }}
                      className="btn-ghost"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-sm text-gray-600">
                      Showing {filteredRecipes.length} of {recipes.length} recipes
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {filteredRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                          onClick={() => handleSelectRecipe(recipe)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{recipe.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
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

                          <div className="flex flex-wrap gap-1">
                            {recipe.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {recipe.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{recipe.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;