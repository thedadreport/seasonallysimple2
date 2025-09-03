'use client';

import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useEffect, useState } from 'react';

const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
      setShowOnlineMessage(false);
    } else {
      if (showOfflineMessage) {
        // Was offline, now back online
        setShowOnlineMessage(true);
        setTimeout(() => setShowOnlineMessage(false), 3000);
      }
      setShowOfflineMessage(false);
    }
  }, [isOnline, showOfflineMessage]);

  if (showOnlineMessage) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
        <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">Back online!</span>
        </div>
      </div>
    );
  }

  if (showOfflineMessage) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
        <div className="bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline - saved recipes still available</span>
        </div>
      </div>
    );
  }

  return null;
};

export default OfflineIndicator;