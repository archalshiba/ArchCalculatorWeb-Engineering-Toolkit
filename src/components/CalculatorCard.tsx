import React from 'react';
import { Crown, Lock, Heart } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { usePreferences } from '../hooks/usePreferences';
import { CalculatorItem } from '../data/calculators';

interface CalculatorCardProps {
  calculator: CalculatorItem;
  onClick: (calculator: CalculatorItem) => void;
  compact?: boolean;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calculator,
  onClick,
  compact = false
}) => {
  const { t } = useLanguage();
  const { preferences, toggleFavorite } = usePreferences();
  const Icon = calculator.icon;
  const isFavorite = preferences.favoriteCalculators.includes(calculator.id);

  const handleClick = () => {
    if (calculator.isPro) {
      alert(t('proFeature'));
      return;
    }
    onClick(calculator);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(calculator.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-600 animate-fade-in ${
        calculator.isPro ? 'opacity-75' : ''
      } ${compact ? 'p-4' : 'p-6'}`}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${
          isFavorite
            ? 'text-red-500 hover:text-red-600'
            : 'text-gray-400 hover:text-red-500'
        }`}
      >
        <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      {/* Pro Badge */}
      {calculator.isPro && (
        <div className="absolute top-3 right-12">
          <div className="flex items-center space-x-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 px-2 py-1 rounded-full text-xs font-medium">
            <Crown size={12} />
            <span>Pro</span>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className={`${compact ? 'w-10 h-10 mb-3' : 'w-12 h-12 mb-4'} rounded-lg flex items-center justify-center transition-colors ${
        calculator.isPro
          ? 'bg-gray-100 dark:bg-gray-700'
          : 'bg-primary-100 dark:bg-primary-900 group-hover:bg-primary-200 dark:group-hover:bg-primary-800'
      }`}>
        {calculator.isPro ? (
          <Lock size={compact ? 20 : 24} className="text-gray-500 dark:text-gray-400" />
        ) : (
          <Icon 
            size={compact ? 20 : 24} 
            className="text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300" 
          />
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className={`font-heading font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors ${
          compact ? 'text-sm' : 'text-base'
        }`}>
          {calculator.title}
        </h3>
        <p className={`text-gray-600 dark:text-gray-400 font-body leading-relaxed ${
          compact ? 'text-xs' : 'text-sm'
        }`}>
          {calculator.description}
        </p>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};