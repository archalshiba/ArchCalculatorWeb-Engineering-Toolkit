import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { CalculatorItem, calculators, proCalculators } from '../data/calculators';
import { CalculatorCard } from './CalculatorCard';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onCalculatorSelect: (calculator: CalculatorItem) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onCalculatorSelect
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CalculatorItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const allCalculators = [...calculators, ...proCalculators];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allCalculators.filter(calc =>
      calc.title.toLowerCase().includes(query.toLowerCase()) ||
      calc.description.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in">
      <div className="max-w-4xl mx-auto mt-16 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl animate-slide-up">
          {/* Search Header */}
          <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <Search size={20} className="text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search calculators..."
              className="flex-1 text-lg font-body bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto p-6">
            {query.trim() === '' ? (
              <div className="text-center py-8">
                <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-body">
                  Start typing to search through our engineering calculators
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 font-body">
                  No calculators found matching "{query}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((calculator) => (
                  <CalculatorCard
                    key={calculator.id}
                    calculator={calculator}
                    onClick={(calc) => {
                      onCalculatorSelect(calc);
                      onClose();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};