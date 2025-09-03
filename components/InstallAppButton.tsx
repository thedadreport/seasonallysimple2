'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, HelpCircle } from 'lucide-react';
import InstallGuide from './InstallGuide';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

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
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setDeferredPrompt(null);
      } else {
        console.log('User dismissed the install prompt');
      }
    } else if (isIOS) {
      setShowInstallGuide(true);
    }
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sage-600 to-sage-700 text-white rounded-lg hover:from-sage-700 hover:to-sage-800 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        {isIOS ? (
          <>
            <Smartphone className="h-4 w-4" />
            <span className="text-sm font-medium">Install App</span>
          </>
        ) : deferredPrompt ? (
          <>
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Install App</span>
          </>
        ) : (
          <>
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Install Guide</span>
          </>
        )}
      </button>

      {/* Install Guide Modal */}
      <InstallGuide 
        isOpen={showInstallGuide} 
        onClose={() => setShowInstallGuide(false)} 
      />
    </>
  );
};

export default InstallAppButton;