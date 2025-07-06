// Comprehensive engineering standards integration

export interface EngineeringStandard {
  id: string;
  name: string;
  fullName: string;
  country: string;
  year: number;
  category: 'concrete' | 'steel' | 'seismic' | 'wind' | 'loads' | 'materials';
  sections: StandardSection[];
  applicableRegions: string[];
}

export interface StandardSection {
  clause: string;
  title: string;
  description: string;
  requirements: Requirement[];
  formulas?: Formula[];
  tables?: StandardTable[];
}

export interface Requirement {
  parameter: string;
  condition: string;
  value: number | string;
  unit?: string;
  notes?: string;
}

export interface Formula {
  id: string;
  description: string;
  formula: string;
  variables: Variable[];
  applicability: string;
}

export interface Variable {
  symbol: string;
  description: string;
  unit: string;
  range?: { min: number; max: number };
}

export interface StandardTable {
  id: string;
  title: string;
  headers: string[];
  rows: (string | number)[][];
  notes?: string[];
}

// Indian Standards (IS Codes)
export const INDIAN_STANDARDS: EngineeringStandard[] = [
  {
    id: 'IS456_2000',
    name: 'IS 456:2000',
    fullName: 'Plain and Reinforced Concrete - Code of Practice',
    country: 'India',
    year: 2000,
    category: 'concrete',
    applicableRegions: ['India', 'South Asia'],
    sections: [
      {
        clause: '26.5.3.1',
        title: 'Minimum and Maximum Reinforcement in Columns',
        description: 'Requirements for longitudinal reinforcement in columns',
        requirements: [
          {
            parameter: 'minimum_reinforcement_ratio',
            condition: 'For all columns',
            value: 0.8,
            unit: '%',
            notes: 'Minimum longitudinal reinforcement shall not be less than 0.8% of gross cross-sectional area'
          },
          {
            parameter: 'maximum_reinforcement_ratio',
            condition: 'For all columns',
            value: 4.0,
            unit: '%',
            notes: 'Maximum longitudinal reinforcement shall not exceed 4% of gross cross-sectional area'
          },
          {
            parameter: 'minimum_bars',
            condition: 'Rectangular columns',
            value: 4,
            unit: 'nos',
            notes: 'Minimum 4 bars for rectangular columns'
          },
          {
            parameter: 'minimum_bars_circular',
            condition: 'Circular columns',
            value: 6,
            unit: 'nos',
            notes: 'Minimum 6 bars for circular columns'
          }
        ],
        formulas: [
          {
            id: 'min_steel_area',
            description: 'Minimum steel area in column',
            formula: 'Ast,min = 0.008 × Ag',
            variables: [
              { symbol: 'Ast,min', description: 'Minimum steel area', unit: 'mm²' },
              { symbol: 'Ag', description: 'Gross cross-sectional area', unit: 'mm²' }
            ],
            applicability: 'All column types'
          }
        ]
      },
      {
        clause: '26.5.1.1',
        title: 'Minimum Dimensions',
        description: 'Minimum dimensions for reinforced concrete columns',
        requirements: [
          {
            parameter: 'minimum_dimension',
            condition: 'All columns',
            value: 200,
            unit: 'mm',
            notes: 'Minimum lateral dimension shall not be less than 200mm'
          }
        ]
      },
      {
        clause: 'Table 16',
        title: 'Nominal Cover Requirements',
        description: 'Minimum concrete cover for different exposure conditions',
        requirements: [
          {
            parameter: 'mild_exposure',
            condition: 'Mild exposure',
            value: 25,
            unit: 'mm',
            notes: 'For concrete surfaces protected against weather or aggressive conditions'
          },
          {
            parameter: 'moderate_exposure',
            condition: 'Moderate exposure',
            value: 30,
            unit: 'mm',
            notes: 'For concrete surfaces sheltered from rain or freezing'
          },
          {
            parameter: 'severe_exposure',
            condition: 'Severe exposure',
            value: 45,
            unit: 'mm',
            notes: 'For concrete surfaces exposed to sea water spray, corrosive fumes'
          },
          {
            parameter: 'very_severe_exposure',
            condition: 'Very severe exposure',
            value: 50,
            unit: 'mm',
            notes: 'For concrete surfaces in direct contact with sea water'
          },
          {
            parameter: 'extreme_exposure',
            condition: 'Extreme exposure',
            value: 75,
            unit: 'mm',
            notes: 'For concrete surfaces in tidal zone of sea water'
          }
        ],
        tables: [
          {
            id: 'cover_table',
            title: 'Nominal Cover to Meet Durability Requirements',
            headers: ['Exposure', 'Nominal Cover (mm)', 'Concrete Grade'],
            rows: [
              ['Mild', 25, 'M20 and above'],
              ['Moderate', 30, 'M25 and above'],
              ['Severe', 45, 'M30 and above'],
              ['Very Severe', 50, 'M35 and above'],
              ['Extreme', 75, 'M40 and above']
            ],
            notes: [
              'These covers may be reduced by 5mm where concrete is cast against and permanently exposed to earth',
              'For main reinforcement up to 12mm diameter, the nominal cover may be reduced by 5mm'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'IS1893_2016',
    name: 'IS 1893:2016',
    fullName: 'Criteria for Earthquake Resistant Design of Structures',
    country: 'India',
    year: 2016,
    category: 'seismic',
    applicableRegions: ['India'],
    sections: [
      {
        clause: '6.4.2',
        title: 'Seismic Zone Factors',
        description: 'Zone factors for different seismic zones in India',
        requirements: [
          {
            parameter: 'zone_factor_II',
            condition: 'Seismic Zone II',
            value: 0.10,
            unit: '-',
            notes: 'Zone factor Z for Zone II'
          },
          {
            parameter: 'zone_factor_III',
            condition: 'Seismic Zone III',
            value: 0.16,
            unit: '-',
            notes: 'Zone factor Z for Zone III'
          },
          {
            parameter: 'zone_factor_IV',
            condition: 'Seismic Zone IV',
            value: 0.24,
            unit: '-',
            notes: 'Zone factor Z for Zone IV'
          },
          {
            parameter: 'zone_factor_V',
            condition: 'Seismic Zone V',
            value: 0.36,
            unit: '-',
            notes: 'Zone factor Z for Zone V'
          }
        ]
      }
    ]
  }
];

// American Standards (ACI, AISC, etc.)
export const AMERICAN_STANDARDS: EngineeringStandard[] = [
  {
    id: 'ACI318_19',
    name: 'ACI 318-19',
    fullName: 'Building Code Requirements for Structural Concrete',
    country: 'USA',
    year: 2019,
    category: 'concrete',
    applicableRegions: ['USA', 'North America'],
    sections: [
      {
        clause: '10.6.1',
        title: 'Minimum Reinforcement in Columns',
        description: 'Minimum longitudinal reinforcement requirements',
        requirements: [
          {
            parameter: 'minimum_reinforcement_ratio',
            condition: 'All columns',
            value: 1.0,
            unit: '%',
            notes: 'Minimum longitudinal reinforcement ratio'
          },
          {
            parameter: 'maximum_reinforcement_ratio',
            condition: 'All columns',
            value: 8.0,
            unit: '%',
            notes: 'Maximum longitudinal reinforcement ratio'
          }
        ]
      }
    ]
  }
];

// European Standards (Eurocode)
export const EUROPEAN_STANDARDS: EngineeringStandard[] = [
  {
    id: 'EN1992_1_1',
    name: 'EN 1992-1-1',
    fullName: 'Eurocode 2: Design of concrete structures - Part 1-1: General rules and rules for buildings',
    country: 'Europe',
    year: 2004,
    category: 'concrete',
    applicableRegions: ['European Union', 'Europe'],
    sections: [
      {
        clause: '9.5.2',
        title: 'Minimum and Maximum Reinforcement Areas',
        description: 'Requirements for longitudinal reinforcement in columns',
        requirements: [
          {
            parameter: 'minimum_reinforcement_ratio',
            condition: 'All columns',
            value: 0.10,
            unit: '%',
            notes: 'Minimum longitudinal reinforcement ratio'
          },
          {
            parameter: 'maximum_reinforcement_ratio',
            condition: 'All columns',
            value: 4.0,
            unit: '%',
            notes: 'Maximum longitudinal reinforcement ratio'
          }
        ]
      }
    ]
  }
];

// British Standards
export const BRITISH_STANDARDS: EngineeringStandard[] = [
  {
    id: 'BS8110_1997',
    name: 'BS 8110:1997',
    fullName: 'Structural use of concrete - Code of practice for design and construction',
    country: 'UK',
    year: 1997,
    category: 'concrete',
    applicableRegions: ['United Kingdom', 'Commonwealth'],
    sections: [
      {
        clause: '3.12.6',
        title: 'Reinforcement in Columns',
        description: 'Requirements for column reinforcement',
        requirements: [
          {
            parameter: 'minimum_reinforcement_ratio',
            condition: 'All columns',
            value: 0.4,
            unit: '%',
            notes: 'Minimum longitudinal reinforcement'
          },
          {
            parameter: 'maximum_reinforcement_ratio',
            condition: 'All columns',
            value: 6.0,
            unit: '%',
            notes: 'Maximum longitudinal reinforcement'
          }
        ]
      }
    ]
  }
];

// Combine all standards
export const ALL_STANDARDS = [
  ...INDIAN_STANDARDS,
  ...AMERICAN_STANDARDS,
  ...EUROPEAN_STANDARDS,
  ...BRITISH_STANDARDS
];

// Standard selection and compliance checking utilities
export const getStandardsByRegion = (region: string): EngineeringStandard[] => {
  return ALL_STANDARDS.filter(standard => 
    standard.applicableRegions.some(r => 
      r.toLowerCase().includes(region.toLowerCase())
    )
  );
};

export const getStandardsByCategory = (category: string): EngineeringStandard[] => {
  return ALL_STANDARDS.filter(standard => standard.category === category);
};

export const findStandardById = (id: string): EngineeringStandard | undefined => {
  return ALL_STANDARDS.find(standard => standard.id === id);
};

export const checkComplianceWithStandard = (
  standardId: string,
  clause: string,
  parameter: string,
  value: number
): {
  isCompliant: boolean;
  requirement?: Requirement;
  message: string;
  standardName: string;
} => {
  const standard = findStandardById(standardId);
  if (!standard) {
    return {
      isCompliant: false,
      message: 'Standard not found',
      standardName: ''
    };
  }

  const section = standard.sections.find(s => s.clause === clause);
  if (!section) {
    return {
      isCompliant: false,
      message: 'Section not found in standard',
      standardName: standard.name
    };
  }

  const requirement = section.requirements.find(r => r.parameter === parameter);
  if (!requirement) {
    return {
      isCompliant: false,
      message: 'Parameter not found in section',
      standardName: standard.name
    };
  }

  let isCompliant = true;
  let message = '';

  // Check compliance based on requirement condition
  if (requirement.condition.includes('minimum') || requirement.condition.includes('not be less than')) {
    isCompliant = value >= Number(requirement.value);
    message = isCompliant 
      ? `Compliant: ${value} ≥ ${requirement.value} ${requirement.unit || ''}`
      : `Non-compliant: ${value} < ${requirement.value} ${requirement.unit || ''} (minimum required)`;
  } else if (requirement.condition.includes('maximum') || requirement.condition.includes('not exceed')) {
    isCompliant = value <= Number(requirement.value);
    message = isCompliant 
      ? `Compliant: ${value} ≤ ${requirement.value} ${requirement.unit || ''}`
      : `Non-compliant: ${value} > ${requirement.value} ${requirement.unit || ''} (maximum allowed)`;
  } else {
    isCompliant = value === Number(requirement.value);
    message = isCompliant 
      ? `Compliant: ${value} = ${requirement.value} ${requirement.unit || ''}`
      : `Non-compliant: ${value} ≠ ${requirement.value} ${requirement.unit || ''} (required value)`;
  }

  return {
    isCompliant,
    requirement,
    message: `${message} (${standard.name}, Cl. ${clause})`,
    standardName: standard.name
  };
};

// Multi-standard compliance checking
export const checkMultiStandardCompliance = (
  standardIds: string[],
  checks: Array<{
    clause: string;
    parameter: string;
    value: number;
  }>
): Array<{
  standardId: string;
  standardName: string;
  checks: Array<{
    clause: string;
    parameter: string;
    isCompliant: boolean;
    message: string;
  }>;
  overallCompliant: boolean;
}> => {
  return standardIds.map(standardId => {
    const standard = findStandardById(standardId);
    const standardName = standard?.name || 'Unknown Standard';
    
    const checkResults = checks.map(check => {
      const result = checkComplianceWithStandard(
        standardId,
        check.clause,
        check.parameter,
        check.value
      );
      
      return {
        clause: check.clause,
        parameter: check.parameter,
        isCompliant: result.isCompliant,
        message: result.message
      };
    });

    const overallCompliant = checkResults.every(result => result.isCompliant);

    return {
      standardId,
      standardName,
      checks: checkResults,
      overallCompliant
    };
  });
};

// Get applicable formulas for a parameter
export const getFormulasForParameter = (
  standardId: string,
  parameter: string
): Formula[] => {
  const standard = findStandardById(standardId);
  if (!standard) return [];

  const formulas: Formula[] = [];
  standard.sections.forEach(section => {
    if (section.formulas) {
      section.formulas.forEach(formula => {
        if (formula.variables.some(v => v.symbol.includes(parameter) || 
            formula.description.toLowerCase().includes(parameter.toLowerCase()))) {
          formulas.push(formula);
        }
      });
    }
  });

  return formulas;
};

// Get standard tables for reference
export const getStandardTables = (standardId: string, sectionClause?: string): StandardTable[] => {
  const standard = findStandardById(standardId);
  if (!standard) return [];

  const tables: StandardTable[] = [];
  standard.sections.forEach(section => {
    if (!sectionClause || section.clause === sectionClause) {
      if (section.tables) {
        tables.push(...section.tables);
      }
    }
  });

  return tables;
};

// Export commonly used standard combinations
export const STANDARD_COMBINATIONS = {
  INDIAN: ['IS456_2000', 'IS1893_2016'],
  AMERICAN: ['ACI318_19'],
  EUROPEAN: ['EN1992_1_1'],
  BRITISH: ['BS8110_1997']
};

// Regional preferences
export const REGIONAL_PREFERENCES = {
  'India': STANDARD_COMBINATIONS.INDIAN,
  'USA': STANDARD_COMBINATIONS.AMERICAN,
  'Canada': STANDARD_COMBINATIONS.AMERICAN,
  'UK': STANDARD_COMBINATIONS.BRITISH,
  'Germany': STANDARD_COMBINATIONS.EUROPEAN,
  'France': STANDARD_COMBINATIONS.EUROPEAN,
  'Italy': STANDARD_COMBINATIONS.EUROPEAN,
  'Spain': STANDARD_COMBINATIONS.EUROPEAN
};

export const getRecommendedStandards = (region: string): string[] => {
  return REGIONAL_PREFERENCES[region as keyof typeof REGIONAL_PREFERENCES] || STANDARD_COMBINATIONS.INDIAN;
};