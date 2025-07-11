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
        <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
          🎯 Professional Quantity Calculators
        </h2>
        <p className="text-indigo-600 dark:text-indigo-400 font-body text-lg">
          Comprehensive quantity estimation tools for expert engineers
        </p>
      </div>
    );
  }

  const categoryTitles = {
    concrete: '🏗️ Concrete Quantity Calculators',
    steel: '🔩 Steel Quantity Calculators', 
    masonry: '🧱 Masonry Quantity Calculators',
    excavation: '⛏️ Excavation Quantity Calculators',
    converter: '🔄 Unit Conversion Tools'
  };

  const categoryDescriptions = {
    concrete: 'Calculate concrete volumes, material quantities, and mix requirements',
    steel: 'Estimate steel reinforcement weights and quantities',
    masonry: 'Calculate brick, block, and mortar quantities',
    excavation: 'Estimate earthwork and excavation volumes',
    converter: 'Convert between different engineering units'
  };

  const title = categoryTitles[category as keyof typeof categoryTitles];
  const description = categoryDescriptions[category as keyof typeof categoryDescriptions];

  if (title) {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
          {title}
        </h2>
        <p className="text-indigo-600 dark:text-indigo-400 font-body text-lg">
          {description}
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