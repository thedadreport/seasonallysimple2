'use client';

import { useEffect, useState } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAManager = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

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
      
      // Show install prompt if not already installed and not dismissed recently
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const daysSinceDismissed = lastDismissed 
        ? (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24)
        : 999;
      
      if (daysSinceDismissed > 7) { // Show again after 7 days
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show install prompt if already installed or on iOS (different flow)
  if (isStandalone || (!deferredPrompt && !isIOS) || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-gradient-to-r from-sage-600 to-sage-700 rounded-2xl shadow-2xl border border-sage-500 p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start space-x-3 pr-6">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            {isIOS ? <Smartphone className="h-5 w-5 text-white" /> : <Monitor className="h-5 w-5 text-white" />}
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">
              Install Seasonally Simple
            </h3>
            <p className="text-white/90 text-xs mb-3 leading-relaxed">
              {isIOS 
                ? 'Add to your home screen for quick access to recipes while cooking!'
                : 'Install our app for offline recipes and faster access!'
              }
            </p>
            
            {isIOS ? (
              <div className="text-white/90 text-xs leading-relaxed">
                <p>Tap <strong>Share</strong> → <strong>Add to Home Screen</strong></p>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="bg-white text-sage-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/95 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Install App</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAManager;