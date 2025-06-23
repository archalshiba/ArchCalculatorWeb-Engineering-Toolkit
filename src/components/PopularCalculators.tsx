import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { CalculatorCard } from './CalculatorCard';
import { calculators, CalculatorItem } from '../data/calculators';

interface PopularCalculatorsProps {
  onCalculatorClick: (calculator: CalculatorItem) => void;
}

export const PopularCalculators: React.FC<PopularCalculatorsProps> = ({ onCalculatorClick }) => {
  const { t } = useLanguage();
  
  // Mock popular calculators - in a real app, this would come from analytics
  const popularCalculators = calculators.slice(0, 6);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <TrendingUp size={24} className="text-accent-600 dark:text-accent-400 mr-3" />
        <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100">
          {t('popularCalculators')}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularCalculators.map((calculator, index) => (
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