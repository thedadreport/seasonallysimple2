import React from 'react';

const SavedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream/30 to-sage-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">Saved Recipes & Plans</h1>
          <p className="text-xl text-charcoal/70">
            Your collection of favorite recipes and meal plans
          </p>
        </div>
        
        <div className="bg-white rounded-2xl organic-shadow border border-sage-200 p-8">
          <div className="text-center text-charcoal/60">
            <p className="text-lg mb-4">📚 Recipe Collection Coming Soon</p>
            <p>Soon you'll be able to save, organize, and revisit all your favorite family recipes.</p>
            <p className="mt-4 text-sm">
              This will include your saved recipes, meal plans, shopping lists, and personal cooking notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPage;