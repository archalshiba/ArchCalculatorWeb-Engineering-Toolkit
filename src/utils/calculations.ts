// Comprehensive calculation utilities for engineering applications

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface UnitConversion {
  from: string;
  to: string;
  factor: number;
}

// Unit conversion utilities
export const UNIT_CONVERSIONS: Record<string, UnitConversion[]> = {
  length: [
    { from: 'mm', to: 'm', factor: 0.001 },
    { from: 'm', to: 'mm', factor: 1000 },
    { from: 'cm', to: 'm', factor: 0.01 },
    { from: 'm', to: 'cm', factor: 100 },
    { from: 'ft', to: 'm', factor: 0.3048 },
    { from: 'm', to: 'ft', factor: 3.28084 },
    { from: 'in', to: 'mm', factor: 25.4 },
    { from: 'mm', to: 'in', factor: 0.0393701 }
  ],
  area: [
    { from: 'mm²', to: 'm²', factor: 0.000001 },
    { from: 'm²', to: 'mm²', factor: 1000000 },
    { from: 'cm²', to: 'm²', factor: 0.0001 },
    { from: 'm²', to: 'cm²', factor: 10000 },
    { from: 'ft²', to: 'm²', factor: 0.092903 },
    { from: 'm²', to: 'ft²', factor: 10.7639 }
  ],
  force: [
    { from: 'N', to: 'kN', factor: 0.001 },
    { from: 'kN', to: 'N', factor: 1000 },
    { from: 'lbf', to: 'N', factor: 4.44822 },
    { from: 'N', to: 'lbf', factor: 0.224809 },
    { from: 'kgf', to: 'N', factor: 9.80665 },
    { from: 'N', to: 'kgf', factor: 0.101972 }
  ],
  pressure: [
    { from: 'Pa', to: 'MPa', factor: 0.000001 },
    { from: 'MPa', to: 'Pa', factor: 1000000 },
    { from: 'psi', to: 'MPa', factor: 0.00689476 },
    { from: 'MPa', to: 'psi', factor: 145.038 },
    { from: 'ksi', to: 'MPa', factor: 6.89476 },
    { from: 'MPa', to: 'ksi', factor: 0.145038 }
  ]
};

// Convert units
export const convertUnit = (value: number, fromUnit: string, toUnit: string, category: string): number => {
  const conversions = UNIT_CONVERSIONS[category];
  if (!conversions) return value;

  const conversion = conversions.find(c => c.from === fromUnit && c.to === toUnit);
  if (!conversion) return value;

  return value * conversion.factor;
};

// Input validation utilities
export const validatePositiveNumber = (value: number, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (isNaN(value) || value <= 0) {
    errors.push(`${fieldName} must be a positive number`);
  }

  return { isValid: errors.length === 0, errors, warnings };
};

export const validateRange = (value: number, min: number, max: number, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (isNaN(value)) {
    errors.push(`${fieldName} must be a valid number`);
  } else if (value < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  } else if (value > max) {
    errors.push(`${fieldName} must not exceed ${max}`);
  }

  return { isValid: errors.length === 0, errors, warnings };
};

// Engineering calculation utilities
export const calculateCircleArea = (diameter: number): number => {
  return Math.PI * Math.pow(diameter / 2, 2);
};

export const calculateRectangleArea = (width: number, height: number): number => {
  return width * height;
};

export const calculateCylinderVolume = (diameter: number, height: number): number => {
  return calculateCircleArea(diameter) * height;
};

export const calculateRectangularVolume = (width: number, depth: number, height: number): number => {
  return width * depth * height;
};

// Material property utilities
export interface MaterialProperties {
  density: number; // kg/m³ or kN/m³
  elasticModulus: number; // MPa
  poissonRatio: number;
  thermalExpansion: number; // per °C
}

export const MATERIAL_PROPERTIES: Record<string, MaterialProperties> = {
  'concrete_normal': {
    density: 2400, // kg/m³
    elasticModulus: 30000, // MPa (varies with grade)
    poissonRatio: 0.2,
    thermalExpansion: 0.000012
  },
  'steel_mild': {
    density: 7850, // kg/m³
    elasticModulus: 200000, // MPa
    poissonRatio: 0.3,
    thermalExpansion: 0.000012
  },
  'steel_rebar': {
    density: 7850, // kg/m³
    elasticModulus: 200000, // MPa
    poissonRatio: 0.3,
    thermalExpansion: 0.000012
  }
};

// Code compliance utilities
export interface CodeRequirement {
  parameter: string;
  minValue?: number;
  maxValue?: number;
  formula?: string;
  reference: string;
}

export const IS456_REQUIREMENTS: Record<string, CodeRequirement[]> = {
  'column_reinforcement': [
    {
      parameter: 'minimum_reinforcement_ratio',
      minValue: 0.8, // %
      reference: 'IS 456:2000, Cl. 26.5.3.1(a)'
    },
    {
      parameter: 'maximum_reinforcement_ratio',
      maxValue: 4.0, // %
      reference: 'IS 456:2000, Cl. 26.5.3.1(b)'
    },
    {
      parameter: 'minimum_bars',
      minValue: 4,
      reference: 'IS 456:2000, Cl. 26.5.3.1(c)'
    }
  ],
  'column_geometry': [
    {
      parameter: 'minimum_dimension',
      minValue: 200, // mm
      reference: 'IS 456:2000, Cl. 26.5.1.1'
    }
  ],
  'cover_requirements': [
    {
      parameter: 'mild_exposure',
      minValue: 25, // mm
      reference: 'IS 456:2000, Table 16'
    },
    {
      parameter: 'moderate_exposure',
      minValue: 30, // mm
      reference: 'IS 456:2000, Table 16'
    },
    {
      parameter: 'severe_exposure',
      minValue: 45, // mm
      reference: 'IS 456:2000, Table 16'
    }
  ]
};

// Check code compliance
export const checkCodeCompliance = (
  category: string, 
  parameter: string, 
  value: number
): { isCompliant: boolean; requirement?: CodeRequirement; message: string } => {
  const requirements = IS456_REQUIREMENTS[category];
  if (!requirements) {
    return { isCompliant: true, message: 'No requirements found for this category' };
  }

  const requirement = requirements.find(req => req.parameter === parameter);
  if (!requirement) {
    return { isCompliant: true, message: 'No specific requirement found' };
  }

  let isCompliant = true;
  let message = '';

  if (requirement.minValue !== undefined && value < requirement.minValue) {
    isCompliant = false;
    message = `Value ${value} is below minimum requirement of ${requirement.minValue}`;
  }

  if (requirement.maxValue !== undefined && value > requirement.maxValue) {
    isCompliant = false;
    message = `Value ${value} exceeds maximum limit of ${requirement.maxValue}`;
  }

  if (isCompliant) {
    message = `Compliant with ${requirement.reference}`;
  } else {
    message += ` (${requirement.reference})`;
  }

  return { isCompliant, requirement, message };
};

// Mathematical utilities
export const roundToDecimalPlaces = (value: number, places: number): number => {
  return Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Safety factor utilities
export const applySafetyFactor = (value: number, safetyFactor: number): number => {
  return value / safetyFactor;
};

export const calculateUtilizationRatio = (applied: number, capacity: number): number => {
  return applied / capacity;
};

// Load combination utilities
export interface LoadCase {
  dead: number;
  live: number;
  wind?: number;
  seismic?: number;
}

export const calculateUltimateLoad = (loads: LoadCase): number => {
  // Basic load combination: 1.5(DL + LL)
  return 1.5 * (loads.dead + loads.live);
};

export const calculateServiceLoad = (loads: LoadCase): number => {
  // Service load combination: DL + LL
  return loads.dead + loads.live;
};

// Interpolation utilities
export const linearInterpolation = (x: number, x1: number, y1: number, x2: number, y2: number): number => {
  return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
};

// Statistical utilities for quality control
export const calculateMean = (values: number[]): number => {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const calculateStandardDeviation = (values: number[]): number => {
  const mean = calculateMean(values);
  const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
  const variance = calculateMean(squaredDifferences);
  return Math.sqrt(variance);
};

export const calculateCharacteristicStrength = (values: number[]): number => {
  // Characteristic strength = mean - 1.65 * standard deviation
  const mean = calculateMean(values);
  const stdDev = calculateStandardDeviation(values);
  return mean - 1.65 * stdDev;
};

// Foundation and Column calculation functions
export const calculateColumn = (columnData: any, materialsData: any, reinforcementData: any) => {
  // Calculate column volume based on shape
  let volume = 0;
  
  switch (columnData.shape) {
    case 'rectangular':
      volume = (columnData.width * columnData.depth * columnData.height) / 1000000000; // Convert mm³ to m³
      break;
    case 'circular':
      volume = (Math.PI * Math.pow(columnData.diameter / 2, 2) * columnData.height) / 1000000000;
      break;
    case 'tshape':
      const flangeVolume = columnData.flangeWidth * columnData.flangeThickness * columnData.height;
      const webVolume = columnData.webWidth * (columnData.height - columnData.flangeThickness) * columnData.webThickness;
      volume = (flangeVolume + webVolume) / 1000000000;
      break;
    default:
      volume = (columnData.width * columnData.depth * columnData.height) / 1000000000;
  }
  
  // Apply waste factor
  const concreteVolume = volume * (1 + materialsData.concreteWasteFactor / 100);
  
  // Calculate steel weights
  const barArea = Math.PI * Math.pow(reinforcementData.mainBars.diameter / 2, 2) / 1000000; // mm² to m²
  const barLength = columnData.height / 1000; // mm to m
  const mainBarsWeight = reinforcementData.mainBars.count * barArea * barLength * materialsData.steelDensity;
  
  // Calculate stirrups
  const stirrupPerimeter = 2 * (columnData.width + columnData.depth) / 1000; // mm to m
  const stirrupArea = Math.PI * Math.pow(reinforcementData.stirrups.diameter / 2, 2) / 1000000;
  const numberOfStirrupsApprox = Math.floor(columnData.height / reinforcementData.stirrups.spacing) + 1;
  const stirrupsWeight = numberOfStirrupsApprox * stirrupPerimeter * stirrupArea * materialsData.steelDensity;
  
  const totalSteelWeight = (mainBarsWeight + stirrupsWeight) * (1 + materialsData.steelWasteFactor / 100);
  
  // Calculate costs (example rates)
  const concreteRate = 150; // per m³
  const steelRate = 60; // per kg
  
  const concreteCost = concreteVolume * concreteRate;
  const mainBarsCost = mainBarsWeight * steelRate;
  const stirrupsCost = stirrupsWeight * steelRate;
  const totalCost = concreteCost + mainBarsCost + stirrupsCost;
  
  return {
    concreteVolume,
    mainBarsWeight,
    stirrupsWeight,
    totalSteelWeight,
    concreteCost,
    mainBarsCost,
    stirrupsCost,
    totalCost
  };
};

export const calculateFoundation = (foundationData: any, materialsData: any, reinforcementData: any) => {
  // Calculate foundation volume
  const volume = (foundationData.width * foundationData.length * foundationData.thickness) / 1000000000; // mm³ to m³
  const concreteVolume = volume * (1 + materialsData.concreteWasteFactor / 100);
  
  // Calculate bottom bars
  const bottomBarAreaX = Math.PI * Math.pow(reinforcementData.bottomBarsX.diameter / 2, 2) / 1000000;
  const bottomBarLengthX = foundationData.length / 1000;
  const bottomBarsWeightX = reinforcementData.bottomBarsX.count * bottomBarAreaX * bottomBarLengthX * materialsData.steelDensity;
  
  const bottomBarAreaY = Math.PI * Math.pow(reinforcementData.bottomBarsY.diameter / 2, 2) / 1000000;
  const bottomBarLengthY = foundationData.width / 1000;
  const bottomBarsWeightY = reinforcementData.bottomBarsY.count * bottomBarAreaY * bottomBarLengthY * materialsData.steelDensity;
  
  const bottomBarsWeight = bottomBarsWeightX + bottomBarsWeightY;
  
  // Calculate top bars (if enabled)
  let topBarsWeight = 0;
  if (reinforcementData.topBars.enabled) {
    const topBarArea = Math.PI * Math.pow(reinforcementData.topBars.diameter / 2, 2) / 1000000;
    const topBarLength = Math.max(foundationData.width, foundationData.length) / 1000;
    topBarsWeight = reinforcementData.topBars.count * topBarArea * topBarLength * materialsData.steelDensity;
  }
  
  // Calculate mesh weight (if enabled)
  let meshWeight = 0;
  if (reinforcementData.mesh.enabled) {
    const meshArea = Math.PI * Math.pow(reinforcementData.mesh.barSize / 2, 2) / 1000000;
    const meshLength = (foundationData.width + foundationData.length) * 2 / 1000; // Approximate
    meshWeight = meshLength * meshArea * materialsData.steelDensity;
  }
  
  const totalSteelWeight = (bottomBarsWeight + topBarsWeight + meshWeight) * (1 + materialsData.steelWasteFactor / 100);
  
  // Calculate costs
  const concreteRate = 150; // per m³
  const steelRate = 60; // per kg
  
  const concreteCost = concreteVolume * concreteRate;
  const bottomBarsCost = bottomBarsWeight * steelRate;
  const topBarsCost = topBarsWeight * steelRate;
  const meshCost = meshWeight * steelRate;
  const totalCost = concreteCost + bottomBarsCost + topBarsCost + meshCost;
  
  return {
    concreteVolume,
    bottomBarsWeight,
    topBarsWeight,
    meshWeight,
    totalSteelWeight,
    concreteCost,
    bottomBarsCost,
    topBarsCost,
    meshCost,
    totalCost
  };
};