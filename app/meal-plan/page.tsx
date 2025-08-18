import React from 'react';

const MealPlanPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Weekly Meal Planner</h1>
          <p className="text-xl text-gray-700">
            Plan your entire week with AI-powered meal planning and smart prep schedules
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center text-gray-600">
            <p className="text-lg mb-4">📅 Weekly Meal Planner Coming Soon</p>
            <p>We're crafting the perfect weekly planning experience for busy families.</p>
            <p className="mt-4 text-sm">
              This will include budget-focused planning, time-saving prep schedules, and complete shopping lists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanPage;