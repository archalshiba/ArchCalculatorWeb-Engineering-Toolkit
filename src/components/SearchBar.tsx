import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { CalculatorItem, calculators, proCalculators } from '../data/calculators';

interface SearchBarProps {
  onCalculatorSelect: (calculator: CalculatorItem) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onCalculatorSelect, className = '' }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CalculatorItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allCalculators = [...calculators, ...proCalculators];

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allCalculators.filter(calc =>
      calc.title.toLowerCase().includes(query.toLowerCase()) ||
      calc.description.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (calculator: CalculatorItem) => {
    onCalculatorSelect(calculator);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {t('searchStart')}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {t('noResults')} "{query}"
            </div>
          ) : (
            <div className="py-2">
              {results.map((calculator) => (
                <button
                  key={calculator.id}
                  onClick={() => handleSelect(calculator)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    calculator.isPro
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-primary-100 dark:bg-primary-900'
                  }`}>
                    <calculator.icon 
                      size={16} 
                      className={calculator.isPro ? 'text-gray-500' : 'text-primary-600 dark:text-primary-400'} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {calculator.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {calculator.description}
                    </div>
                  </div>
                  {calculator.isPro && (
                    <div className="text-xs bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 px-2 py-1 rounded-full">
                      Pro
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};