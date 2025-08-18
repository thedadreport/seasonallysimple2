import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({
  size = 'md',
  className = ''
}: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const combinedClasses = `animate-spin rounded-full border-2 border-green-200 border-t-green-600 ${sizes[size]} ${className}`;

  return (
    <div className={combinedClasses} />
  );
};

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots = ({ className = '' }: LoadingDotsProps) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

interface LoadingOverlayProps {
  children?: React.ReactNode;
  message?: string;
}

export const LoadingOverlay = ({
  children,
  message = 'Loading...'
}: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-xl">
        <LoadingSpinner size="lg" />
        <p className="text-gray-900 font-medium">{message}</p>
        {children}
      </div>
    </div>
  );
};