import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, FileText, Eye, Download, Book, Zap, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';
import { ReferenceTableModal } from '../components/ReferenceTableModal';
import { Visualization3D } from '../components/3DVisualization';
import { AdvancedReportGenerator } from '../components/AdvancedReportGenerator';
import { StandardsCompliancePanel } from '../components/StandardsCompliancePanel';
import { ReportData } from '../utils/reportGenerator';
import { validatePositiveNumber, validateRange, formatNumber, roundToDecimalPlaces } from '../utils/calculations';

interface RectangularColumnCalculatorProps {
  onBack: () => void;
}

interface ColumnInputs {
  // Geometry
  width: number;
  depth: number;
  height: number;
  clearCover: number;
  
  // Material Properties
  fck: number; // Characteristic compressive strength of concrete
  fy: number;  // Characteristic strength of steel
  concreteGrade: string;
  steelGrade: string;
  exposureCondition: string;
  
  // Loading
  axialLoad: number;
  momentX: number; // Moment about X-axis
  momentY: number; // Moment about Y-axis
  
  // Reinforcement
  mainBarDia: number;
  stirrupDia: number;
  stirrupSpacing: number;
  
  // Safety Factors
  safetyFactorConcrete: number;
  safetyFactorSteel: number;
  
  // Project Information
  projectName: string;
  engineerName: string;
  location: string;
}

interface CalculationResults {
  // Areas
  grossArea: number;
  netArea: number;
  
  // Volumes and Weights
  concreteVolume: number;
  steelWeight: number;
  
  // Reinforcement
  requiredReinforcement: number;
  providedReinforcement: number;
  reinforcementRatio: number;
  numberOfBars: number;
  
  // Capacity
  designCapacity: number;
  utilizationRatio: number;
  
  // Status
  isDesignSafe: boolean;
  warnings: string[];
  errors: string[];
}

interface CalculationStep {
  step: number;
  description: string;
  formula: string;
  calculation: string;
  result: string;
  reference?: string;
}

const CONCRETE_GRADES = [
  { grade: 'M10', fck: 10 },
  { grade: 'M15', fck: 15 },
  { grade: 'M20', fck: 20 },
  { grade: 'M25', fck: 25 },
  { grade: 'M30', fck: 30 },
  { grade: 'M35', fck: 35 },
  { grade: 'M40', fck: 40 },
  { grade: 'M45', fck: 45 },
  { grade: 'M50', fck: 50 }
];

const STEEL_GRADES = [
  { grade: 'Fe415', fy: 415 },
  { grade: 'Fe500', fy: 500 },
  { grade: 'Fe550', fy: 550 }
];

const EXPOSURE_CONDITIONS = [
  { condition: 'Mild', cover: 25, description: 'Protected from weather' },
  { condition: 'Moderate', cover: 30, description: 'Sheltered from rain' },
  { condition: 'Severe', cover: 45, description: 'Exposed to rain/freezing' },
  { condition: 'Very Severe', cover: 50, description: 'Coastal areas' },
  { condition: 'Extreme', cover: 75, description: 'Tidal zones' }
];

export const RectangularColumnCalculator: React.FC<RectangularColumnCalculatorProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'inputs' | 'results' | 'calculations' | 'reports'>('inputs');
  const [inputs, setInputs] = useState<ColumnInputs>({
    // Geometry
    width: 300,
    depth: 300,
    height: 3000,
    clearCover: 30,
    
    // Material Properties
    fck: 20,
    fy: 415,
    concreteGrade: 'M20',
    steelGrade: 'Fe415',
    exposureCondition: 'Moderate',
    
    // Loading
    axialLoad: 1000,
    momentX: 50,
    momentY: 50,
    
    // Reinforcement
    mainBarDia: 16,
    stirrupDia: 8,
    stirrupSpacing: 150,
    
    // Safety Factors
    safetyFactorConcrete: 1.5,
    safetyFactorSteel: 1.15,
    
    // Project Information
    projectName: 'Sample Column Design',
    engineerName: 'Design Engineer',
    location: 'Project Location'
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const validateInputs = (): boolean => {
    const errors: Record<string, string> = {};

    // Geometry validation
    if (inputs.width <= 0) errors.width = 'Width must be positive';
    if (inputs.width < 200) errors.width = 'Minimum width is 200mm (IS 456:2000)';
    if (inputs.depth <= 0) errors.depth = 'Depth must be positive';
    if (inputs.depth < 200) errors.depth = 'Minimum depth is 200mm (IS 456:2000)';
    if (inputs.height <= 0) errors.height = 'Height must be positive';
    if (inputs.clearCover <= 0) errors.clearCover = 'Clear cover must be positive';

    // Material validation
    if (inputs.fck <= 0) errors.fck = 'fck must be positive';
    if (inputs.fy <= 0) errors.fy = 'fy must be positive';

    // Loading validation
    if (inputs.axialLoad <= 0) errors.axialLoad = 'Axial load must be positive';

    // Reinforcement validation
    if (inputs.mainBarDia <= 0) errors.mainBarDia = 'Main bar diameter must be positive';
    if (inputs.stirrupDia <= 0) errors.stirrupDia = 'Stirrup diameter must be positive';
    if (inputs.stirrupSpacing <= 0) errors.stirrupSpacing = 'Stirrup spacing must be positive';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateResults = () => {
    if (!validateInputs()) return;

    const steps: CalculationStep[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    // Step 1: Calculate gross cross-sectional area
    const grossArea = inputs.width * inputs.depth;
    steps.push({
      step: 1,
      description: 'Calculate gross cross-sectional area',
      formula: 'Ag = b × D',
      calculation: `Ag = ${inputs.width} × ${inputs.depth}`,
      result: `${formatNumber(grossArea)} mm²`,
      reference: 'Basic geometry'
    });

    // Step 2: Calculate effective cover
    const effectiveCover = inputs.clearCover + inputs.stirrupDia + inputs.mainBarDia / 2;
    steps.push({
      step: 2,
      description: 'Calculate effective cover',
      formula: 'd\' = clear cover + stirrup dia + main bar dia/2',
      calculation: `d' = ${inputs.clearCover} + ${inputs.stirrupDia} + ${inputs.mainBarDia}/2`,
      result: `${formatNumber(effectiveCover)} mm`,
      reference: 'IS 456:2000'
    });

    // Step 3: Calculate effective depth
    const effectiveDepth = inputs.depth - effectiveCover;
    steps.push({
      step: 3,
      description: 'Calculate effective depth',
      formula: 'd = D - d\'',
      calculation: `d = ${inputs.depth} - ${effectiveCover}`,
      result: `${formatNumber(effectiveDepth)} mm`,
      reference: 'IS 456:2000'
    });

    // Step 4: Calculate minimum reinforcement
    const minReinforcementRatio = 0.8; // % as per IS 456:2000
    const minReinforcement = (minReinforcementRatio / 100) * grossArea;
    steps.push({
      step: 4,
      description: 'Calculate minimum reinforcement',
      formula: 'Ast,min = 0.008 × Ag',
      calculation: `Ast,min = 0.008 × ${formatNumber(grossArea)}`,
      result: `${formatNumber(minReinforcement)} mm²`,
      reference: 'IS 456:2000, Cl. 26.5.3.1(a)'
    });

    // Step 5: Calculate maximum reinforcement
    const maxReinforcementRatio = 4.0; // % as per IS 456:2000
    const maxReinforcement = (maxReinforcementRatio / 100) * grossArea;
    steps.push({
      step: 5,
      description: 'Calculate maximum reinforcement',
      formula: 'Ast,max = 0.04 × Ag',
      calculation: `Ast,max = 0.04 × ${formatNumber(grossArea)}`,
      result: `${formatNumber(maxReinforcement)} mm²`,
      reference: 'IS 456:2000, Cl. 26.5.3.1(b)'
    });

    // Step 6: Calculate required reinforcement (simplified approach)
    const requiredReinforcement = Math.max(minReinforcement, inputs.axialLoad * 1000 / (0.4 * inputs.fck + 0.67 * inputs.fy));
    steps.push({
      step: 6,
      description: 'Calculate required reinforcement (simplified)',
      formula: 'Ast,req = max(Ast,min, P/(0.4fck + 0.67fy))',
      calculation: `Ast,req = max(${formatNumber(minReinforcement)}, ${inputs.axialLoad}×1000/(0.4×${inputs.fck} + 0.67×${inputs.fy}))`,
      result: `${formatNumber(requiredReinforcement)} mm²`,
      reference: 'Simplified approach'
    });

    // Step 7: Calculate area of one bar
    const areaOneBar = Math.PI * Math.pow(inputs.mainBarDia / 2, 2);
    steps.push({
      step: 7,
      description: 'Calculate area of one main bar',
      formula: 'A_bar = π × (dia/2)²',
      calculation: `A_bar = π × (${inputs.mainBarDia}/2)²`,
      result: `${formatNumber(areaOneBar)} mm²`,
      reference: 'Basic geometry'
    });

    // Step 8: Calculate number of bars required
    const numberOfBarsRequired = Math.ceil(requiredReinforcement / areaOneBar);
    const numberOfBarsProvided = Math.max(numberOfBarsRequired, 4); // Minimum 4 bars for rectangular column
    steps.push({
      step: 8,
      description: 'Calculate number of bars required',
      formula: 'n = Ast,req / A_bar (minimum 4)',
      calculation: `n = ${formatNumber(requiredReinforcement)} / ${formatNumber(areaOneBar)} = ${numberOfBarsRequired} (min 4)`,
      result: `${numberOfBarsProvided} bars`,
      reference: 'IS 456:2000, Cl. 26.5.3.1(c)'
    });

    // Step 9: Calculate provided reinforcement
    const providedReinforcement = numberOfBarsProvided * areaOneBar;
    steps.push({
      step: 9,
      description: 'Calculate provided reinforcement',
      formula: 'Ast,prov = n × A_bar',
      calculation: `Ast,prov = ${numberOfBarsProvided} × ${formatNumber(areaOneBar)}`,
      result: `${formatNumber(providedReinforcement)} mm²`,
      reference: 'Design calculation'
    });

    // Step 10: Calculate reinforcement ratio
    const reinforcementRatio = (providedReinforcement / grossArea) * 100;
    steps.push({
      step: 10,
      description: 'Calculate reinforcement ratio',
      formula: 'ρ = (Ast,prov / Ag) × 100',
      calculation: `ρ = (${formatNumber(providedReinforcement)} / ${formatNumber(grossArea)}) × 100`,
      result: `${formatNumber(reinforcementRatio, 2)}%`,
      reference: 'Design check'
    });

    // Step 11: Calculate design capacity (simplified)
    const designCapacity = 0.4 * inputs.fck * grossArea / 1000 + 0.67 * inputs.fy * providedReinforcement / 1000;
    steps.push({
      step: 11,
      description: 'Calculate design capacity (simplified)',
      formula: 'Pu = 0.4fck×Ag + 0.67fy×Ast',
      calculation: `Pu = 0.4×${inputs.fck}×${formatNumber(grossArea)}/1000 + 0.67×${inputs.fy}×${formatNumber(providedReinforcement)}/1000`,
      result: `${formatNumber(designCapacity)} kN`,
      reference: 'Simplified approach'
    });

    // Check compliance
    if (reinforcementRatio < minReinforcementRatio) {
      errors.push(`Reinforcement ratio ${formatNumber(reinforcementRatio, 2)}% is less than minimum ${minReinforcementRatio}%`);
    }
    if (reinforcementRatio > maxReinforcementRatio) {
      errors.push(`Reinforcement ratio ${formatNumber(reinforcementRatio, 2)}% exceeds maximum ${maxReinforcementRatio}%`);
    }
    if (numberOfBarsProvided < 4) {
      errors.push('Minimum 4 bars required for rectangular column');
    }
    if (inputs.width < 200 || inputs.depth < 200) {
      errors.push('Minimum column dimension should be 200mm');
    }

    // Check warnings
    if (reinforcementRatio > 3.0) {
      warnings.push('High reinforcement ratio may cause congestion');
    }
    if (inputs.stirrupSpacing > Math.min(inputs.width, inputs.depth)) {
      warnings.push('Stirrup spacing should not exceed least lateral dimension');
    }

    // Calculate additional properties
    const concreteVolume = (grossArea * inputs.height) / 1000000; // m³
    const steelWeight = (providedReinforcement * inputs.height * 7.85) / 1000000; // kg (density of steel = 7850 kg/m³)
    const utilizationRatio = (inputs.axialLoad / designCapacity) * 100;

    const calculatedResults: CalculationResults = {
      grossArea,
      netArea: grossArea - providedReinforcement,
      concreteVolume,
      steelWeight,
      requiredReinforcement,
      providedReinforcement,
      reinforcementRatio,
      numberOfBars: numberOfBarsProvided,
      designCapacity,
      utilizationRatio,
      isDesignSafe: errors.length === 0 && utilizationRatio <= 100,
      warnings,
      errors
    };

    setResults(calculatedResults);
    setCalculationSteps(steps);
  };

  const handleInputChange = (field: keyof ColumnInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleConcreteGradeChange = (grade: string) => {
    const selectedGrade = CONCRETE_GRADES.find(g => g.grade === grade);
    if (selectedGrade) {
      setInputs(prev => ({
        ...prev,
        concreteGrade: grade,
        fck: selectedGrade.fck
      }));
    }
  };

  const handleSteelGradeChange = (grade: string) => {
    const selectedGrade = STEEL_GRADES.find(g => g.grade === grade);
    if (selectedGrade) {
      setInputs(prev => ({
        ...prev,
        steelGrade: grade,
        fy: selectedGrade.fy
      }));
    }
  };

  const handleExposureConditionChange = (condition: string) => {
    const selectedCondition = EXPOSURE_CONDITIONS.find(c => c.condition === condition);
    if (selectedCondition) {
      setInputs(prev => ({
        ...prev,
        exposureCondition: condition,
        clearCover: selectedCondition.cover
      }));
    }
  };

  const loadExampleFromReference = (mixRatio: string) => {
    // Load example values based on mix ratio
    const examples: Record<string, Partial<ColumnInputs>> = {
      '1:1.5:3': { fck: 20, concreteGrade: 'M20' },
      '1:2:4': { fck: 15, concreteGrade: 'M15' },
      '1:3:6': { fck: 10, concreteGrade: 'M10' },
      '1:1:2': { fck: 25, concreteGrade: 'M25' },
      '1:1.2:2.4': { fck: 30, concreteGrade: 'M30' }
    };

    const example = examples[mixRatio];
    if (example) {
      setInputs(prev => ({ ...prev, ...example }));
    }
    setShowReferenceModal(false);
  };

  const generateReportData = (): ReportData => {
    return {
      title: 'Rectangular Column Design Report',
      projectInfo: {
        name: inputs.projectName,
        engineer: inputs.engineerName,
        date: new Date().toLocaleDateString(),
        location: inputs.location
      },
      inputs: {
        width: inputs.width,
        depth: inputs.depth,
        height: inputs.height,
        clearCover: inputs.clearCover,
        fck: inputs.fck,
        fy: inputs.fy,
        axialLoad: inputs.axialLoad,
        momentX: inputs.momentX,
        momentY: inputs.momentY,
        mainBarDia: inputs.mainBarDia,
        stirrupDia: inputs.stirrupDia,
        stirrupSpacing: inputs.stirrupSpacing
      },
      results: results ? {
        grossArea: results.grossArea,
        concreteVolume: results.concreteVolume,
        steelWeight: results.steelWeight,
        requiredReinforcement: results.requiredReinforcement,
        providedReinforcement: results.providedReinforcement,
        reinforcementRatio: results.reinforcementRatio,
        numberOfBars: results.numberOfBars,
        designCapacity: results.designCapacity,
        utilizationRatio: results.utilizationRatio
      } : {},
      calculations: calculationSteps,
      compliance: {
        isCompliant: results?.isDesignSafe || false,
        warnings: results?.warnings || [],
        errors: results?.errors || []
      },
      references: [
        'IS 456:2000 - Plain and Reinforced Concrete - Code of Practice',
        'IS 1786:2008 - High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
        'SP 16:1980 - Design Aids for Reinforced Concrete to IS 456:1978'
      ]
    };
  };

  const resetToDefaults = () => {
    setInputs({
      width: 300,
      depth: 300,
      height: 3000,
      clearCover: 30,
      fck: 20,
      fy: 415,
      concreteGrade: 'M20',
      steelGrade: 'Fe415',
      exposureCondition: 'Moderate',
      axialLoad: 1000,
      momentX: 50,
      momentY: 50,
      mainBarDia: 16,
      stirrupDia: 8,
      stirrupSpacing: 150,
      safetyFactorConcrete: 1.5,
      safetyFactorSteel: 1.15,
      projectName: 'Sample Column Design',
      engineerName: 'Design Engineer',
      location: 'Project Location'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Rectangular Column Calculator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Professional reinforced concrete column design as per IS 456:2000
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowReferenceModal(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Book size={16} className="mr-2" />
            Reference
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'inputs', label: 'Design Inputs', icon: Calculator },
          { id: 'results', label: 'Results', icon: Eye },
          { id: 'calculations', label: 'Calculations', icon: FileText },
          { id: 'reports', label: 'Reports', icon: Download }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'inputs' && (
            <div className="space-y-6">
              {/* Project Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Project Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={inputs.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Engineer Name
                    </label>
                    <input
                      type="text"
                      value={inputs.engineerName}
                      onChange={(e) => handleInputChange('engineerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={inputs.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Geometry */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Column Geometry
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Width (mm)
                    </label>
                    <input
                      type="number"
                      value={inputs.width}
                      onChange={(e) => handleInputChange('width', Number(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                        validationErrors.width ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {validationErrors.width && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.width}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Depth (mm)
                    </label>
                    <input
                      type="number"
                      value={inputs.depth}
                      onChange={(e) => handleInputChange('depth', Number(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                        validationErrors.depth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {validationErrors.depth && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.depth}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Height (mm)
                    </label>
                    <input
                      type="number"
                      value={inputs.height}
                      onChange={(e) => handleInputChange('height', Number(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                        validationErrors.height ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {validationErrors.height && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.height}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Clear Cover (mm)
                    </label>
                    <input
                      type="number"
                      value={inputs.clearCover}
                      onChange={(e) => handleInputChange('clearCover', Number(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                        validationErrors.clearCover ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {validationErrors.clearCover && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.clearCover}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Material Properties */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Material Properties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Concrete Grade
                    </label>
                    <select
                      value={inputs.concreteGrade}
                      onChange={(e) => handleConcreteGradeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {CONCRETE_GRADES.map(grade => (
                        <option key={grade.grade} value={grade.grade}>
                          {grade.grade} (fck = {grade.fck} MPa)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Steel Grade
                    </label>
                    <select
                      value={inputs.steelGrade}
                      onChange={(e) => handleSteelGradeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {STEEL_GRADES.map(grade => (
                        <option key={grade.grade} value={grade.grade}>
                          {grade.grade} (fy = {grade.fy} MPa)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exposure Condition
                    </label>
                    <select
                      value={inputs.exposureCondition}
                      onChange={(e) => handleExposureConditionChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {EXPOSURE_CONDITIONS.map(condition => (
                        <option key={condition.condition} value={condition.condition}>
                          {condition.condition} ({condition.cover}mm cover)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Loading */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Loading Conditions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Axial Load (kN)
                    </label>
                    <input
                      type="number"
                      value={inputs.axialLoad}
                      onChange={(e) => handleInputChange('axialLoad', Number(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                        validationErrors.axialLoad ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {validationErrors.axialLoad && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.axialLoad}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Moment X (kN.m)
                    </label>
                    <input
                      type="number"
                      value={inputs.momentX}
                      onChange={(e) => handleInputChange('momentX', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Moment Y (kN.m)
                    </label>
                    <input
                      type="number"
                      value={inputs.momentY}
                      onChange={(e) => handleInputChange('momentY', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Reinforcement Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Reinforcement Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Main Bar Diameter (mm)
                    </label>
                    <select
                      value={inputs.mainBarDia}
                      onChange={(e) => handleInputChange('mainBarDia', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {[12, 16, 20, 25, 32].map(dia => (
                        <option key={dia} value={dia}>{dia}mm</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stirrup Diameter (mm)
                    </label>
                    <select
                      value={inputs.stirrupDia}
                      onChange={(e) => handleInputChange('stirrupDia', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      {[6, 8, 10, 12].map(dia => (
                        <option key={dia} value={dia}>{dia}mm</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stirrup Spacing (mm)
                    </label>
                    <input
                      type="number"
                      value={inputs.stirrupSpacing}
                      onChange={(e) => handleInputChange('stirrupSpacing', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && results && (
            <div className="space-y-6">
              {/* Design Status */}
              <div className={`rounded-lg border p-6 ${
                results.isDesignSafe 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center">
                  {results.isDesignSafe ? (
                    <CheckCircle className="text-green-500 mr-3" size={24} />
                  ) : (
                    <AlertTriangle className="text-red-500 mr-3" size={24} />
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      results.isDesignSafe ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                    }`}>
                      {results.isDesignSafe ? 'Design is Safe' : 'Design Requires Attention'}
                    </h3>
                    <p className={`text-sm ${
                      results.isDesignSafe ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {results.isDesignSafe 
                        ? 'All design checks passed successfully' 
                        : 'Please review the errors and warnings below'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Design Results Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatNumber(results.reinforcementRatio, 2)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Reinforcement Ratio</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {results.numberOfBars}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Number of Bars</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formatNumber(results.utilizationRatio, 1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Capacity Utilization</div>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Detailed Results
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-gray-100">Parameter</th>
                        <th className="text-right py-2 px-4 font-medium text-gray-900 dark:text-gray-100">Value</th>
                        <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-gray-100">Unit</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Gross Cross-sectional Area</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{formatNumber(results.grossArea)}</td>
                        <td className="py-2 px-4 text-gray-600 dark:text-gray-400">mm²</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Required Reinforcement</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{formatNumber(results.requiredReinforcement)}</td>
                        <td className="py-2 px-4 text-gray-600 dark:text-gray-400">mm²</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Provided Reinforcement</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{formatNumber(results.providedReinforcement)}</td>
                        <td className="py-2 px-4 text-gray-600 dark:text-gray-400">mm²</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Design Capacity</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{formatNumber(results.designCapacity)}</td>
                        <td className="py-2 px-4 text-gray-600 dark:text-gray-400">kN</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Concrete Volume</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{formatNumber(results.concreteVolume, 3)}</td>
                        <td className="py-2 px-4 text-gray-600 dark:text-gray-400">m³</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Steel Weight</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-gray-100">{formatNumber(results.steelWeight, 1)}</td>
                        <td className="py-2 px-4 text-gray-600 dark:text-gray-400">kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Warnings and Errors */}
              {(results.warnings.length > 0 || results.errors.length > 0) && (
                <div className="space-y-4">
                  {results.errors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h4 className="text-red-900 dark:text-red-100 font-medium mb-2">Errors</h4>
                      <ul className="space-y-1">
                        {results.errors.map((error, index) => (
                          <li key={index} className="text-red-700 dark:text-red-300 text-sm flex items-start">
                            <AlertTriangle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.warnings.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <h4 className="text-yellow-900 dark:text-yellow-100 font-medium mb-2">Warnings</h4>
                      <ul className="space-y-1">
                        {results.warnings.map((warning, index) => (
                          <li key={index} className="text-yellow-700 dark:text-yellow-300 text-sm flex items-start">
                            <AlertTriangle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'calculations' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Step-by-Step Calculations
              </h3>
              <div className="space-y-6">
                {calculationSteps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {step.description}
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-2">
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          <strong>Formula:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{step.formula}</code>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          <strong>Calculation:</strong> {step.calculation}
                        </div>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          <strong>Result:</strong> {step.result}
                        </div>
                      </div>
                      {step.reference && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Reference: {step.reference}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Report Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Generate professional engineering reports with detailed calculations, compliance checks, and project documentation.
              </p>
              <button
                onClick={() => setShowReportGenerator(true)}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText size={20} className="mr-2" />
                Generate Advanced Report
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* 3D Visualization */}
          {results && (
            <Visualization3D
              width={inputs.width}
              depth={inputs.depth}
              height={inputs.height}
              mainBars={results.numberOfBars}
              stirrupSpacing={inputs.stirrupSpacing}
              clearCover={inputs.clearCover}
            />
          )}

          {/* Standards Compliance */}
          {results && (
            <StandardsCompliancePanel
              designParameters={{
                reinforcementRatio: results.reinforcementRatio,
                minimumDimension: Math.min(inputs.width, inputs.depth),
                clearCover: inputs.clearCover,
                numberOfBars: results.numberOfBars
              }}
              region="India"
            />
          )}

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowReferenceModal(true)}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Book size={16} className="mr-2" />
                Concrete Mix Reference
              </button>
              <button
                onClick={() => results && setShowReportGenerator(true)}
                disabled={!results}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download size={16} className="mr-2" />
                Generate Report
              </button>
              <button
                onClick={resetToDefaults}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReferenceTableModal
        isOpen={showReferenceModal}
        onClose={() => setShowReferenceModal(false)}
        onLoadExample={loadExampleFromReference}
      />

      {showReportGenerator && results && (
        <AdvancedReportGenerator
          data={generateReportData()}
          onClose={() => setShowReportGenerator(false)}
        />
      )}
    </div>
  );
};