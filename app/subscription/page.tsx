'use client';

import React from 'react';
import { Crown, Settings, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import SubscriptionStatus from '../../components/SubscriptionStatus';
import SubscriptionUpgrade from '../../components/SubscriptionUpgrade';

const SubscriptionPage = () => {
  const { subscription, updateSubscription } = useApp();

  const handleCancelSubscription = () => {
    const cancelledSubscription = {
      ...subscription,
      status: 'cancelled' as const,
      autoRenew: false,
    };
    updateSubscription(cancelledSubscription);
  };

  const handleReactivateSubscription = () => {
    const reactivatedSubscription = {
      ...subscription,
      status: 'active' as const,
      autoRenew: true,
    };
    updateSubscription(reactivatedSubscription);
  };

  const handleDowngradeToFree = () => {
    const freeSubscription = {
      tier: 'free' as const,
      status: 'active' as const,
      startDate: new Date().toISOString(),
      endDate: null,
      autoRenew: false,
    };
    updateSubscription(freeSubscription);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmCream via-sage-50 to-cream-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-warmGray-900 mb-4">Your Cooking Journey</h1>
          <p className="text-xl text-warmGray-600 font-body">
            Nurture your plan, celebrate your progress, and grow your culinary confidence
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Subscription Status */}
          <SubscriptionStatus showUsage={true} />

          {/* Subscription Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Subscription Settings</h2>
            </div>

            <div className="space-y-4">
              {subscription.tier !== 'free' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Auto-renewal</p>
                        <p className="text-sm text-gray-600">
                          {subscription.autoRenew ? 'Enabled' : 'Disabled'} • 
                          Next billing: {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={subscription.autoRenew ? handleCancelSubscription : handleReactivateSubscription}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        subscription.autoRenew
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {subscription.autoRenew ? 'Cancel Subscription' : 'Reactivate Subscription'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Billing cycle</p>
                        <p className="text-sm text-gray-600">Monthly billing</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      View Billing History
                    </button>
                  </div>
                </>
              )}

              {/* Demo Controls */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                  <p className="text-sm font-medium text-gray-900">Demo Controls</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateSubscription({
                      tier: 'pro',
                      status: 'active',
                      startDate: new Date().toISOString(),
                      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                      autoRenew: true,
                    })}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Demo Pro Plan
                  </button>
                  <button
                    onClick={() => updateSubscription({
                      tier: 'family',
                      status: 'active',
                      startDate: new Date().toISOString(),
                      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                      autoRenew: true,
                    })}
                    className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    Demo Family Plan
                  </button>
                  <button
                    onClick={handleDowngradeToFree}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset to Free
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * This is a demo. No actual payment processing is involved.
                </p>
              </div>
            </div>
          </div>

          {/* Upgrade Options (only show if on free plan) */}
          {subscription.tier === 'free' && (
            <SubscriptionUpgrade feature="premium features" showCurrentPlan={false} />
          )}

          {/* Help & Support */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Have questions about your subscription or billing?
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Get in Touch →
                </button>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">FAQ</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Find answers to common subscription questions.
                </p>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  View FAQ →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;