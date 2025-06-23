import { Tag } from '../types';

export const tags: Tag[] = [
  // Industry Tags
  { id: 'structural', name: 'Structural', category: 'industry' },
  { id: 'civil', name: 'Civil', category: 'industry' },
  { id: 'mechanical', name: 'Mechanical', category: 'industry' },
  { id: 'electrical', name: 'Electrical', category: 'industry' },
  { id: 'hvac', name: 'HVAC', category: 'industry' },
  { id: 'geotechnical', name: 'Geotechnical', category: 'industry' },
  { id: 'environmental', name: 'Environmental', category: 'industry' },
  { id: 'materials', name: 'Materials', category: 'industry' },
  
  // Principle Tags
  { id: 'design', name: 'Design', category: 'principle' },
  { id: 'analysis', name: 'Analysis', category: 'principle' },
  { id: 'calculation', name: 'Calculation', category: 'principle' },
  { id: 'measurement', name: 'Measurement', category: 'principle' },
  
  // Type Tags
  { id: 'basic', name: 'Basic', category: 'type' },
  { id: 'advanced', name: 'Advanced', category: 'type' },
  { id: 'professional', name: 'Professional', category: 'type' }
];