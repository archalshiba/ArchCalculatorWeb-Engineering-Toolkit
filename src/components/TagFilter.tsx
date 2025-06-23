import React from 'react';
import { Filter, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { tags } from '../data/tags';

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onClearAll: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  onTagToggle,
  onClearAll
}) => {
  const { t } = useLanguage();

  const industryTags = tags.filter(tag => tag.category === 'industry');
  const principleTags = tags.filter(tag => tag.category === 'principle');

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Filter by Tags</h3>
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</h4>
          <div className="flex flex-wrap gap-2">
            {industryTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t(tag.id)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</h4>
          <div className="flex flex-wrap gap-2">
            {principleTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag.id)
                    ? 'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 border border-accent-300 dark:border-accent-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t(tag.id)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};