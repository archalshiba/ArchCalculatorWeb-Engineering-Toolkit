import React, { useState } from 'react';
import { Search, Menu, X, Settings } from 'lucide-react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { SettingsModal } from './SettingsModal';
import { useLanguage } from '../hooks/useLanguage';
import { CalculatorItem } from '../data/calculators';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCalculatorSelect: (calculator: CalculatorItem) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onCalculatorSelect,
  sidebarOpen,
  onSidebarToggle
}) => {
  const { t } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const tabs = [
    { id: 'all', label: t('allTools') },
    { id: 'quantity', label: t('quantity') },
    { id: 'area', label: t('area') },
    { id: 'volume', label: t('volume') },
    { id: 'converter', label: t('converter') }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center">
              <button
                onClick={onSidebarToggle}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="ml-2 lg:ml-0">
                <Logo size="md" />
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar onCalculatorSelect={onCalculatorSelect} />
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={t('settings')}
              >
                <Settings size={20} />
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <SearchBar onCalculatorSelect={onCalculatorSelect} />
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="lg:hidden pb-3">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tagline */}
          <div className="hidden lg:block pb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {t('tagline')}
            </p>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};