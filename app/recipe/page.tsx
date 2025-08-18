import React from 'react';

const RecipePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recipe Generator</h1>
          <p className="text-xl text-gray-700">
            Tell us your situation and we'll create the perfect recipe for your family
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center text-gray-600">
            <p className="text-lg mb-4">🚧 Recipe Generator Coming Soon</p>
            <p>We're putting the finishing touches on your personalized recipe experience.</p>
            <p className="mt-4 text-sm">
              This will include situation-based recipe generation, family preferences, and AI-powered cooking solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;