import React from 'react';
import { Calculator, Square, Cuboid as Cube, ArrowRightLeft, X, Crown } from 'lucide-react';
import { categoryLabels } from '../data/calculators';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose
}) => {
  const categories = [
    { id: 'all', label: 'All Tools', icon: Calculator },
    { id: 'quantity', label: categoryLabels.quantity, icon: Calculator },
    { id: 'area', label: categoryLabels.area, icon: Square },
    { id: 'volume', label: categoryLabels.volume, icon: Cube },
    { id: 'converter', label: categoryLabels.converter, icon: ArrowRightLeft },
    { id: 'pro', label: 'Pro Tools', icon: Crown }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-gray-100">
              Categories
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    onTabChange(category.id);
                    onClose();
                  }}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeTab === category.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} className="mr-3 flex-shrink-0" />
                  <span className="font-medium">{category.label}</span>
                  {category.id === 'pro' && (
                    <Crown size={16} className="ml-auto text-accent-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-body">
            Professional engineering calculations for construction and architecture
          </p>
        </div>
      </aside>
    </>
  );
};