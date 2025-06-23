import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { categoryLabels, categoryIcons } from '../data/calculators';

interface CategoryHeaderProps {
  category: string;
  count: number;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, count }) => {
  const { t } = useLanguage();

  if (category === 'all') {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-3">
          {t('allEngineering')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-body text-lg">
          {t('allDescription')}
        </p>
      </div>
    );
  }

  if (category === 'pro') {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-accent-600 to-primary-600 dark:from-accent-400 dark:to-primary-400 bg-clip-text text-transparent mb-3">
          {t('proTools')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-body text-lg">
          {t('proDescription')}
        </p>
      </div>
    );
  }

  const Icon = categoryIcons[category as keyof typeof categoryIcons];
  const label = categoryLabels[category as keyof typeof categoryLabels];

  return (
    <div className="mb-8">
      <div className="flex items-center mb-3">
        {Icon && <Icon size={32} className="text-primary-600 dark:text-primary-400 mr-4" />}
        <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100">
          {label}
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-body text-lg">
        {count} {t('specializesCalculators')} {category} {t('calculations')}
      </p>
    </div>
  );
};