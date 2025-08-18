import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  withTexture?: boolean;
}

export const Card = ({ 
  children, 
  className = '', 
  withTexture = true 
}: CardProps) => {
  const baseClasses = 'bg-white rounded-2xl shadow-lg border border-gray-200';
  const textureClasses = withTexture ? 'bg-gradient-to-br from-white to-gray-50' : '';
  const combinedClasses = `${baseClasses} ${textureClasses} ${className}`;

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = ({ 
  children, 
  className = '' 
}: CardContentProps) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ 
  children, 
  className = '' 
}: CardHeaderProps) => {
  return (
    <div className={`p-6 pb-0 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter = ({ 
  children, 
  className = '' 
}: CardFooterProps) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};