import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CalculatorCard } from './components/CalculatorCard';
import { SearchOverlay } from './components/SearchOverlay';
import { BottomNavMobile } from './components/BottomNavMobile';
import { CategoryHeader } from './components/CategoryHeader';
import { calculators, proCalculators, CalculatorItem } from './data/calculators';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleCalculatorClick = (calculator: CalculatorItem) => {
    console.log('Opening calculator:', calculator.title);
    // Here you would typically navigate to the calculator page or open a modal
    alert(`Opening ${calculator.title} calculator. This would navigate to the calculator interface.`);
  };

  const getFilteredCalculators = () => {
    const allCalculators = [...calculators, ...(activeTab === 'pro' ? proCalculators : [])];
    
    if (activeTab === 'all') {
      return calculators; // Only show regular calculators for 'all'
    }
    
    if (activeTab === 'pro') {
      return proCalculators;
    }
    
    return allCalculators.filter(calc => calc.category === activeTab);
  };

  const filteredCalculators = getFilteredCalculators();

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 font-body transition-colors">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearchOpen={() => setSearchOpen(true)}
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
                <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No calculators found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Try selecting a different category or use the search function to find specific calculators.
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

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onCalculatorSelect={handleCalculatorClick}
      />
    </div>
  );
}

export default App;