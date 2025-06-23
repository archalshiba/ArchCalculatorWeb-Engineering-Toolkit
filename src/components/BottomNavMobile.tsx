import React from 'react';
import { Calculator, Home, Crown, Bookmark, Heart } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface BottomNavMobileProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavMobile: React.FC<BottomNavMobileProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'all', icon: Calculator, label: t('allTools') },
    { id: 'quantity', icon: Home, label: t('quantity') },
    { id: 'pro', icon: Crown, label: t('proTools') },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'favorites', icon: Heart, label: 'Favorites' }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-40 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-accent-600 dark:text-accent-400 transform scale-105'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon 
                size={20} 
                className={`mb-1 ${isActive ? 'text-accent-600 dark:text-accent-400' : ''}`} 
              />
              <span className={`text-xs font-medium ${isActive ? 'text-accent-600 dark:text-accent-400' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-accent-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};