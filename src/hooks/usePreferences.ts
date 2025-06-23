import { useState, useEffect } from 'react';
import { UserPreferences } from '../types';

const defaultPreferences: UserPreferences = {
  language: 'en',
  unitSystem: 'metric',
  theme: 'default',
  recentCalculators: [],
  favoriteCalculators: []
};

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem('userPreferences');
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const addRecentCalculator = (calculatorId: string) => {
    setPreferences(prev => ({
      ...prev,
      recentCalculators: [
        calculatorId,
        ...prev.recentCalculators.filter(id => id !== calculatorId)
      ].slice(0, 10) // Keep only last 10
    }));
  };

  const toggleFavorite = (calculatorId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteCalculators: prev.favoriteCalculators.includes(calculatorId)
        ? prev.favoriteCalculators.filter(id => id !== calculatorId)
        : [...prev.favoriteCalculators, calculatorId]
    }));
  };

  return {
    preferences,
    updatePreference,
    addRecentCalculator,
    toggleFavorite
  };
};