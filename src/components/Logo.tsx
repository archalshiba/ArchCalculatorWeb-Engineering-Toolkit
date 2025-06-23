import React from 'react';
import { Calculator } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const { t } = useLanguage();
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg blur-sm opacity-20"></div>
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 p-2 rounded-lg shadow-lg">
          <Calculator size={iconSizes[size]} className="text-white" />
        </div>
      </div>
      <div>
        <h1 className={`${sizeClasses[size]} font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent`}>
          {t('appTitle')}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-body">
          {t('appSubtitle')}
        </p>
        {showTagline && (
          <p className="text-sm text-gray-600 dark:text-gray-300 font-body mt-1 max-w-md">
            {t('tagline')}
          </p>
        )}
      </div>
    </div>
  );
};