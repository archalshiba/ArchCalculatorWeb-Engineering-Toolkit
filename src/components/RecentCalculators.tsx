import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { usePreferences } from '../hooks/usePreferences';
import { CalculatorCard } from './CalculatorCard';
import { calculators, proCalculators, CalculatorItem } from '../data/calculators';

interface RecentCalculatorsProps {
  onCalculatorClick: (calculator: CalculatorItem) => void;
}

export const RecentCalculators: React.FC<RecentCalculatorsProps> = ({ onCalculatorClick }) => {
  const { t } = useLanguage();
  const { preferences } = usePreferences();
  
  const allCalculators = [...calculators, ...proCalculators];
  const recentCalculators = preferences.recentCalculators
    .map(id => allCalculators.find(calc => calc.id === id))
    .filter(Boolean) as CalculatorItem[];

  if (recentCalculators.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Clock size={24} className="text-gray-400 mr-3" />
          <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100">
            {t('recentlyUsed')}
          </h2>
        </div>
        
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Clock size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {t('noRecentCalculators')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('startUsing')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Clock size={24} className="text-primary-600 dark:text-primary-400 mr-3" />
        <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100">
          {t('recentlyUsed')}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recentCalculators.map((calculator, index) => (
          <div
            key={calculator.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-scale-in"
          >
            <CalculatorCard
              calculator={calculator}
              onClick={onCalculatorClick}
              compact
            />
          </div>
        ))}
      </div>
    </div>
  );
};