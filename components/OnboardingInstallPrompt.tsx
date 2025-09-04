'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';
import InstallGuide from './InstallGuide';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface OnboardingInstallPromptProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const OnboardingInstallPrompt = ({ isVisible, onDismiss }: OnboardingInstallPromptProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installStep, setInstallStep] = useState<'prompt' | 'success' | 'dismissed'>('prompt');

  useEffect(() => {
    // Check if running in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                     (window.navigator as any).standalone;
    setIsStandalone(standalone);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Use browser's native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setInstallStep('success');
        setDeferredPrompt(null);
        
        // Auto-dismiss after showing success
        setTimeout(() => {
          onDismiss();
        }, 2000);
      } else {
        // User dismissed, but don't close the modal yet
        setInstallStep('dismissed');
      }
    } else {
      // Show install guide for iOS or browsers without prompt
      setShowInstallGuide(true);
    }
  };

  const handleSkip = () => {
    // Store that user skipped during onboarding
    localStorage.setItem('onboarding-install-skipped', Date.now().toString());
    onDismiss();
  };

  // Don't show if already installed or not visible
  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-sage-50 to-stone-50 p-6 relative">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Skip"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {installStep === 'success' ? (
                  <CheckCircle className="h-8 w-8 text-sage-600" />
                ) : isIOS ? (
                  <Smartphone className="h-8 w-8 text-sage-600" />
                ) : (
                  <Download className="h-8 w-8 text-sage-600" />
                )}
              </div>
              
              {installStep === 'success' ? (
                <div>
                  <h2 className="text-xl font-serif font-light text-stone-800 mb-2 italic">Perfect!</h2>
                  <p className="text-sm text-stone-600 font-light">
                    Seasonally Simple is now on your home screen. You're all set to cook stress-free!
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-serif font-light text-stone-800 mb-2 italic">Welcome to your kitchen companion</h2>
                  <p className="text-sm text-stone-600 font-light leading-relaxed">
                    Add Seasonally Simple to your home screen for quick access while cooking. Keep recipes open even when your phone sleeps!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {installStep === 'prompt' && (
            <div className="p-6">
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-sage-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-sm font-medium text-stone-700">Instant access</span>
                    <p className="text-xs text-stone-600 font-light">No need to find the website in your browser</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-sage-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-sm font-medium text-stone-700">Hands-free cooking</span>
                    <p className="text-xs text-stone-600 font-light">Screen stays on while you follow recipes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-sage-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-sm font-medium text-stone-700">Offline recipes</span>
                    <p className="text-xs text-stone-600 font-light">Access saved recipes even without internet</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-gradient-to-r from-sage-600 to-sage-700 text-white py-3 px-4 rounded-full font-medium text-sm hover:from-sage-700 hover:to-sage-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  {isIOS ? (
                    <>
                      <Smartphone className="h-4 w-4" />
                      <span>Show Me How</span>
                    </>
                  ) : deferredPrompt ? (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Add to Home Screen</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-4 w-4" />
                      <span>View Install Guide</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleSkip}
                  className="w-full text-stone-500 hover:text-stone-700 py-2 px-4 text-sm font-light transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          )}

          {installStep === 'dismissed' && (
            <div className="p-6 text-center">
              <p className="text-sm text-stone-600 font-light mb-4">
                No worries! You can always install later from the homepage or settings.
              </p>
              <button
                onClick={handleSkip}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 px-6 rounded-full text-sm font-medium transition-colors"
              >
                Continue to App
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Install Guide Modal */}
      <InstallGuide 
        isOpen={showInstallGuide} 
        onClose={() => {
          setShowInstallGuide(false);
          handleSkip(); // Close the main modal too
        }} 
      />
    </>
  );
};

export default OnboardingInstallPrompt;