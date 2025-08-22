'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Users, Star, ArrowLeft, Printer, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const RecipeDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { recipes, deleteRecipe, canEditRecipe, updateRecipe } = useApp();
  
  const recipe = recipes.find(r => r.id === params.id);
  const canEdit = canEditRecipe();

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
          <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={() => router.push('/saved')}
            className="btn-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Saved Recipes
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    if (canEdit) {
      // For now, redirect back to saved page where edit functionality exists
      router.push('/saved');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      await deleteRecipe(recipe.id);
      router.push('/saved');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 print:bg-white">
      <div className="max-w-4xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 print:shadow-none print:border-0">
          <div className="flex justify-between items-start mb-6">
            <button 
              onClick={() => router.push('/saved')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors print:hidden"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Saved Recipes
            </button>
            
            <div className="flex items-center space-x-2 print:hidden">
              <button 
                onClick={handlePrint}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                title="Print Recipe"
              >
                <Printer className="h-4 w-4" />
                <span className="text-sm font-medium">Print</span>
              </button>
              <button 
                onClick={handleEdit}
                disabled={!canEdit}
                className={`p-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  canEdit 
                    ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900' 
                    : 'text-orange-600 cursor-not-allowed'
                }`}
                title={canEdit ? 'Edit Recipe' : 'Edit (Pro Feature)'}
              >
                <Edit3 className="h-4 w-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2 text-red-600 hover:text-red-700"
                title="Delete Recipe"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mr-3">
              {recipe.situation}
            </div>
            <span className="text-sm text-gray-500">Saved {recipe.dateAdded}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{recipe.description}</p>
          
          <div className="flex items-center space-x-8 text-gray-600">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">{recipe.cookTime}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span className="font-medium">{recipe.servings}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              <span className="font-medium">{recipe.difficulty}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ingredients */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:shadow-none print:border print:border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:shadow-none print:border print:border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* Notes */}
        {recipe.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-6">
            <h3 className="text-xl font-semibold text-yellow-800 mb-3">Your Personal Notes</h3>
            <p className="text-yellow-800 leading-relaxed">{recipe.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;