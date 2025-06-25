import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CalculatorCard } from './components/CalculatorCard';
import { BottomNavMobile } from './components/BottomNavMobile';
import { CategoryHeader } from './components/CategoryHeader';
import { PopularCalculators } from './components/PopularCalculators';
import { RecentCalculators } from './components/RecentCalculators';
import { TagFilter } from './components/TagFilter';
import { useLanguage } from './hooks/useLanguage';
import { usePreferences } from './hooks/usePreferences';
import { calculators, proCalculators, CalculatorItem } from './data/calculators';
import { themes } from './data/themes';
import { ConcretePartSelector } from './features/ConcretePartSelector';
import { RectangularColumnCalculator } from './features/RectangularColumnCalculator';
import { PartTypeSelector } from './features/PartTypeSelector';

function App() {
  const { t } = useLanguage();
  const { preferences, addRecentCalculator } = usePreferences();
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showConcreteSelector, setShowConcreteSelector] = useState(false);
  const [selectedConcretePart, setSelectedConcretePart] = useState<string | null>(null);
  const [selectedPartType, setSelectedPartType] = useState<string | null>(null);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const theme = themes.find(t => t.id === preferences.theme);
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-accent', theme.colors.accent);
      root.style.setProperty('--color-background', theme.colors.background);
    }
  }, [preferences.theme]);

  // Add handler to open the concrete selector from the main grid
  const handleCalculatorClick = (calculator: CalculatorItem) => {
    if (calculator.id === 'concrete-calculator') {
      setShowConcreteSelector(true);
      setSelectedConcretePart(null);
      return;
    }
    
    console.log('Opening calculator:', calculator.title);
    addRecentCalculator(calculator.id);
    
    if (calculator.isPro) {
      alert(t('proFeature'));
      return;
    }
    
    alert(`Opening ${calculator.title} calculator. This would navigate to the calculator interface.`);
  };

  const getFilteredCalculators = () => {
    const allCalculators = [...calculators, ...(activeTab === 'pro' ? proCalculators : [])];
    
    let filtered = allCalculators;
    
    if (activeTab === 'all') {
      filtered = calculators; // Only show regular calculators for 'all'
    } else if (activeTab === 'pro') {
      filtered = proCalculators;
    } else {
      filtered = allCalculators.filter(calc => calc.category === activeTab);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      // For now, we'll just return the filtered results
      // In a real app, calculators would have tags associated with them
      filtered = filtered;
    }

    return filtered;
  };

  const filteredCalculators = getFilteredCalculators();

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 font-body transition-all duration-300">
      {/* Show Concrete Selector or Calculator if active */}
      {showConcreteSelector ? (
        selectedConcretePart && !selectedPartType ? (
          <PartTypeSelector
            partId={selectedConcretePart}
            onSelect={typeId => setSelectedPartType(typeId)}
            onBack={() => setSelectedConcretePart(null)}
          />
        ) : selectedConcretePart && selectedPartType ? (
          selectedConcretePart === 'columns' && selectedPartType === 'rectangular' ? (
            <RectangularColumnCalculator />
          ) : (
            <div className="max-w-xl mx-auto p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">{selectedPartType.replace(/^[a-z]/, c => c.toUpperCase())} Calculator Coming Soon</h2>
              <button className="mt-4 text-teal-600 underline" onClick={() => setSelectedPartType(null)}>
                &larr; Back to Type Selection
              </button>
            </div>
          )
        ) : (
          <ConcretePartSelector onSelect={part => setSelectedConcretePart(part)} />
        )
      ) : (
        <>
          {/* Header */}
          <Header
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCalculatorSelect={handleCalculatorClick}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          <div className="flex">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
              <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOpen={true}
                onClose={() => {}}
              />
            </div>

            {/* Mobile Sidebar */}
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
              <div className="max-w-7xl mx-auto">
                {/* Category Header */}
                <CategoryHeader category={activeTab} count={filteredCalculators.length} />

                {/* Show Popular and Recent for 'all' tab */}
                {activeTab === 'all' && (
                  <>
                    <PopularCalculators onCalculatorClick={handleCalculatorClick} />
                    <RecentCalculators onCalculatorClick={handleCalculatorClick} />
                  </>
                )}

                {/* Tag Filter */}
                {activeTab !== 'all' && activeTab !== 'pro' && (
                  <TagFilter
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                    onClearAll={clearAllTags}
                  />
                )}

                {/* Calculator Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCalculators.map((calculator, index) => (
                    <div
                      key={calculator.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-scale-in"
                    >
                      <CalculatorCard
                        calculator={calculator}
                        onClick={handleCalculatorClick}
                      />
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredCalculators.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {t('noCalculatorsFound')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      {t('tryDifferentCategory')}
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <BottomNavMobile
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </>
      )}
    </div>
  );
}

export default App;