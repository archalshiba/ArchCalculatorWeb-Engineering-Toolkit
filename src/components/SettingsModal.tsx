import React from 'react';
import { X, Settings, Globe, Palette, Ruler, Info, Mail } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { usePreferences } from '../hooks/usePreferences';
import { languages } from '../data/languages';
import { themes } from '../data/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();
  const { preferences, updatePreference } = usePreferences();

  if (!isOpen) return null;

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    updatePreference('language', langCode);
  };

  const handleThemeChange = (themeId: string) => {
    updatePreference('theme', themeId);
    // Apply theme colors to CSS variables
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-accent', theme.colors.accent);
      root.style.setProperty('--color-background', theme.colors.background);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in">
      <div className="max-w-2xl mx-auto mt-16 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Settings size={24} className="text-primary-600 dark:text-primary-400 mr-3" />
              <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-gray-100">
                {t('settings')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Language Settings */}
            <div>
              <div className="flex items-center mb-4">
                <Globe size={20} className="text-primary-600 dark:text-primary-400 mr-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('language')}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      language === lang.code
                        ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {lang.nativeName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {lang.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <div className="flex items-center mb-4">
                <Palette size={20} className="text-primary-600 dark:text-primary-400 mr-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('theme')}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      preferences.theme === theme.id
                        ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {t(`${theme.id}Theme`)}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Unit System Settings */}
            <div>
              <div className="flex items-center mb-4">
                <Ruler size={20} className="text-primary-600 dark:text-primary-400 mr-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('unitSystem')}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updatePreference('unitSystem', 'metric')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    preferences.unitSystem === 'metric'
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {t('metric')}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('metricDesc')}
                  </div>
                </button>
                <button
                  onClick={() => updatePreference('unitSystem', 'imperial')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    preferences.unitSystem === 'imperial'
                      ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {t('imperial')}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('imperialDesc')}
                  </div>
                </button>
              </div>
            </div>

            {/* About Section */}
            <div>
              <div className="flex items-center mb-4">
                <Info size={20} className="text-primary-600 dark:text-primary-400 mr-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('aboutUs')}
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('aboutTitle')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('aboutContent')}
                </p>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('missionTitle')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('missionContent')}
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <div className="flex items-center mb-4">
                <Mail size={20} className="text-primary-600 dark:text-primary-400 mr-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t('contactDeveloper')}
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('contactContent')}
                </p>
                <a
                  href="mailto:developer@archcalculator.com"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <Mail size={16} className="mr-2" />
                  {t('emailDeveloper')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};