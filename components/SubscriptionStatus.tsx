'use client';

import React from 'react';
import { Crown, ChefHat, Calendar, Edit3, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatSubscriptionTier, getRemainingRecipes, getRemainingMealPlans } from '../lib/subscription';

interface SubscriptionStatusProps {
  compact?: boolean;
  showUsage?: boolean;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ 
  compact = false, 
  showUsage = true 
}) => {
  const { subscription, usage, getSubscriptionLimits } = useApp();
  const limits = getSubscriptionLimits();
  const remainingRecipes = getRemainingRecipes(subscription, usage);
  const remainingMealPlans = getRemainingMealPlans(subscription, usage);

  const getStatusColor = () => {
    switch (subscription.tier) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'pro':
        return 'from-blue-500 to-blue-600';
      case 'family':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = () => {
    if (subscription.tier === 'free') {
      return <ChefHat className="h-5 w-5 text-white" />;
    }
    return <Crown className="h-5 w-5 text-white" />;
  };

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-8 h-8 bg-gradient-to-br ${getStatusColor()} rounded-full flex items-center justify-center mr-3`}>
              {getStatusIcon()}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {formatSubscriptionTier(subscription.tier)} Plan
              </p>
              {showUsage && (
                <p className="text-sm text-gray-600">
                  {remainingRecipes} recipes, {remainingMealPlans} meal plans left
                </p>
              )}
            </div>
          </div>
          {subscription.tier === 'free' && (
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Upgrade
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor()} rounded-full flex items-center justify-center mr-4`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {formatSubscriptionTier(subscription.tier)} Plan
            </h3>
            <p className="text-gray-600">
              {subscription.status === 'active' ? 'Active' : 'Inactive'} • 
              {subscription.tier === 'free' ? ' No expiration' : ` Expires ${new Date(subscription.endDate!).toLocaleDateString()}`}
            </p>
          </div>
        </div>
        
        {subscription.tier === 'free' && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Crown className="h-4 w-4 inline mr-2" />
            Upgrade
          </button>
        )}
      </div>

      {showUsage && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 mb-3">Current Usage</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Recipe Usage */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <ChefHat className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Recipes</span>
                </div>
                <span className="text-sm text-gray-600">
                  {usage.recipesGenerated} / {limits.recipesPerMonth}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((usage.recipesGenerated / limits.recipesPerMonth) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {remainingRecipes} remaining this month
              </p>
            </div>

            {/* Meal Plan Usage */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Meal Plans</span>
                </div>
                <span className="text-sm text-gray-600">
                  {usage.mealPlansGenerated} / {limits.mealPlansPerMonth}
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${limits.mealPlansPerMonth > 0 ? Math.min((usage.mealPlansGenerated / limits.mealPlansPerMonth) * 100, 100) : 0}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {subscription.tier === 'free' ? 'Pro feature' : `${remainingMealPlans} remaining this month`}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Plan Features</h5>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <ChefHat className="h-4 w-4 text-gray-600 mr-2" />
                <span className={limits.recipesPerMonth > 5 ? 'text-green-600' : 'text-gray-600'}>
                  {limits.recipesPerMonth} recipes/month
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                <span className={limits.canAccessMealPlans ? 'text-green-600' : 'text-gray-400'}>
                  {limits.canAccessMealPlans ? `${limits.mealPlansPerMonth} meal plans` : 'No meal plans'}
                </span>
              </div>
              <div className="flex items-center">
                <Edit3 className="h-4 w-4 text-gray-600 mr-2" />
                <span className={limits.canEditRecipes ? 'text-green-600' : 'text-gray-400'}>
                  {limits.canEditRecipes ? 'Edit recipes' : 'No editing'}
                </span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-gray-600 mr-2" />
                <span className={limits.canSaveUnlimited ? 'text-green-600' : 'text-gray-400'}>
                  {limits.canSaveUnlimited ? 'Unlimited saves' : 'Limited saves'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;