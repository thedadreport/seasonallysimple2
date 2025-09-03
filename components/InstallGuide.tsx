'use client';

import { useState } from 'react';
import { X, Share, Plus, MoreHorizontal, Download, Smartphone, Monitor, ChefHat } from 'lucide-react';

interface InstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallGuide = ({ isOpen, onClose }: InstallGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Detect device/browser type
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent) && !isIOS;


  const getSteps = () => {
    if (isIOS && isSafari) {
      return [
        {
          title: "Tap the Share button",
          description: "Look for the share icon at the bottom of Safari",
          icon: <Share className="h-8 w-8 text-blue-500" />,
          image: "📱",
          detail: "It's usually in the bottom toolbar"
        },
        {
          title: "Find 'Add to Home Screen'",
          description: "Scroll down and tap 'Add to Home Screen'",
          icon: <Plus className="h-8 w-8 text-green-500" />,
          image: "➕",
          detail: "You might need to scroll down in the share menu"
        },
        {
          title: "Confirm the installation",
          description: "Tap 'Add' in the top right corner",
          icon: <ChefHat className="h-8 w-8 text-sage-600" />,
          image: "✅",
          detail: "The app icon will appear on your home screen"
        }
      ];
    } else if (isAndroid && isChrome) {
      return [
        {
          title: "Tap the menu button",
          description: "Look for three dots (⋮) in the top right",
          icon: <MoreHorizontal className="h-8 w-8 text-blue-500" />,
          image: "⋮",
          detail: "It's in the browser's top toolbar"
        },
        {
          title: "Tap 'Add to Home screen'",
          description: "Look for 'Add to Home screen' or 'Install app'",
          icon: <Plus className="h-8 w-8 text-green-500" />,
          image: "📱",
          detail: "Chrome might show an 'Install' option instead"
        },
        {
          title: "Confirm installation",
          description: "Tap 'Add' or 'Install' to confirm",
          icon: <ChefHat className="h-8 w-8 text-sage-600" />,
          image: "✅",
          detail: "The app will be added to your home screen"
        }
      ];
    } else {
      // Fallback for other browsers
      return [
        {
          title: "Look for the install prompt",
          description: "Your browser may show an install banner",
          icon: <Download className="h-8 w-8 text-blue-500" />,
          image: "💻",
          detail: "Different browsers have different install methods"
        },
        {
          title: "Check your browser menu",
          description: "Look for 'Install app' or 'Add to Home Screen'",
          icon: <MoreHorizontal className="h-8 w-8 text-green-500" />,
          image: "📱",
          detail: "Usually in the main browser menu"
        },
        {
          title: "Follow your browser's prompts",
          description: "Complete the installation process",
          icon: <ChefHat className="h-8 w-8 text-sage-600" />,
          image: "✅",
          detail: "The app will appear on your device"
        }
      ];
    }
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  const getBrowserName = () => {
    if (isIOS && isSafari) return 'Safari on iPhone/iPad';
    if (isAndroid && isChrome) return 'Chrome on Android';
    return 'your browser';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-semibold text-gray-900">Install Seasonally Simple</h2>
              <p className="text-sm text-gray-600 mt-1">For {getBrowserName()}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-xs text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-sage-500 to-sage-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-sage-50 to-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">{currentStepData.image}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mb-2">
              {currentStepData.description}
            </p>
            <p className="text-sm text-gray-500 italic">
              {currentStepData.detail}
            </p>
          </div>

          {/* Visual Representation */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center">
              {currentStepData.icon}
            </div>
            {isIOS && currentStep === 0 && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                  <Share className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Share</span>
                </div>
              </div>
            )}
            {isAndroid && currentStep === 0 && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-1 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits Reminder */}
          <div className="bg-sage-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-sage-800 mb-2">Why install?</h4>
            <ul className="text-xs text-sage-700 space-y-1">
              <li>• Quick access while cooking</li>
              <li>• Works offline in your kitchen</li>
              <li>• No browser clutter</li>
              <li>• Faster than opening a browser</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-sage-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-4 py-2 bg-sage-600 text-white rounded-lg text-sm font-medium hover:bg-sage-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Done!
              </button>
            )}
          </div>
        </div>

        {/* Footer tip */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help? The app icon will appear as "Seasonally Simple" on your home screen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallGuide;