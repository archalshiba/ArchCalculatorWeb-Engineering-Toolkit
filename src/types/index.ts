export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface UnitSystem {
  id: 'metric' | 'imperial';
  name: string;
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface UserPreferences {
  language: string;
  unitSystem: 'metric' | 'imperial';
  theme: string;
  recentCalculators: string[];
  favoriteCalculators: string[];
}

export interface Tag {
  id: string;
  name: string;
  category: 'industry' | 'principle' | 'type';
}