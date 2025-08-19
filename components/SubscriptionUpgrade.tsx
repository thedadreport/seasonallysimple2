'use client';

import React from 'react';
import { Crown, Star, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { SubscriptionTier } from '@/types';

interface SubscriptionUpgradeProps {
  feature?: string;
  compact?: boolean;
  showCurrentPlan?: boolean;
}

const SubscriptionUpgrade: React.FC<SubscriptionUpgradeProps> = ({ 
  feature = "premium features", 
  compact = false,
  showCurrentPlan = true
}) => {
  const { subscription, updateSubscription } = useApp();

  const handleUpgrade = (tier: SubscriptionTier) => {
    const newSubscription = {
      tier,
      status: 'active' as const,
      startDate: new Date().toISOString(),
      endDate: tier === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      autoRenew: tier !== 'free',
    };
    updateSubscription(newSubscription);
  };

  const plans = [
    {
      tier: 'pro' as const,
      name: 'Pro',
      price: '$9.99/month',
      features: [
        '50 recipes per month',
        '10 meal plans per month',
        'Edit saved recipes',
        'Priority support'
      ],
      highlight: false,
    },
    {
      tier: 'family' as const,
      name: 'Family',
      price: '$19.99/month',
      features: [
        '100 recipes per month',
        '25 meal plans per month',
        'Edit saved recipes',
        'Family sharing',
        'Priority support'
      ],
      highlight: true,
    },
  ];

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="h-5 w-5 text-orange-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Upgrade to access {feature}
              </p>
              {showCurrentPlan && (
                <p className="text-xs text-gray-600">
                  Current plan: {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpgrade('pro')}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Upgrade to Access {feature.charAt(0).toUpperCase() + feature.slice(1)}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Choose a plan that fits your cooking needs and unlock all premium features.
        </p>
        
        {showCurrentPlan && (
          <div className="mb-8 p-3 bg-gray-50 rounded-lg inline-block">
            <p className="text-sm text-gray-600">
              Current Plan: <span className="font-medium">{subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}</span>
            </p>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.tier}
            className={`border rounded-lg p-6 relative ${
              plan.highlight 
                ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">{plan.price}</p>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleUpgrade(plan.tier)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Upgrade to {plan.name}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          * This is a demo. No actual payment will be processed.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade;