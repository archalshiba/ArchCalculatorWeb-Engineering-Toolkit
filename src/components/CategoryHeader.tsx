import React from 'react';
import { categoryLabels, categoryIcons } from '../data/calculators';

interface CategoryHeaderProps {
  category: string;
  count: number;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, count }) => {
  if (category === 'all') {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
          All Engineering Calculators
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-body">
          Professional tools for architects, civil engineers, and construction professionals
        </p>
      </div>
    );
  }

  if (category === 'pro') {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
          Pro Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-body">
          Advanced engineering calculators for professional analysis and design
        </p>
      </div>
    );
  }

  const Icon = categoryIcons[category as keyof typeof categoryIcons];
  const label = categoryLabels[category as keyof typeof categoryLabels];

  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        {Icon && <Icon size={28} className="text-primary-600 dark:text-primary-400 mr-3" />}
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">
          {label}
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-body">
        {count} specialized calculators for {category} calculations
      </p>
    </div>
  );
};