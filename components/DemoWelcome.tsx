'use client';

import React, { useState } from 'react';
import { X, ChefHat, Calendar, Heart, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';

const DemoWelcome = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { data: session } = useSession();

  // Only show for demo users
  if (!session?.user?.email?.includes('demo@') || !isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 m-4 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 hover:bg-blue-200 rounded-full transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4 text-blue-600" />
      </button>
      
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">
            🎉 Welcome to Seasonally Simple Demo!
          </h3>
          
          <div className="text-sm text-blue-800 space-y-1 mb-3">
            <p className="font-medium">You can try everything - no limits:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div className="flex items-center space-x-2">
                <ChefHat className="h-4 w-4 text-blue-600" />
                <span>Generate unlimited recipes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Create meal plans</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-blue-600" />
                <span>Save & edit recipes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Test all premium features</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-blue-700">
            💡 <strong>Tip:</strong> Your demo data will reset when you refresh, but feel free to explore everything!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoWelcome;