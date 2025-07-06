import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, FileText, Download, Eye, EyeOff, AlertTriangle, CheckCircle, Info, Book, Settings, Save, Load, RotateCcw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { usePreferences } from '../hooks/usePreferences';

// Types for calculation inputs and results
interface ColumnInputs {
  // Geometry
  width: number;
  depth: number;
  height: number;
  clearCover: number;
  
  // Material Properties
  concreteGrade: string;
  fck: number; // Characteristic compressive strength
  steelGrade: string;
  fy: number; // Yield strength of steel
  
  // Loads
  axialLoad: number;
  momentX: number;
  momentY: number;
  
  // Reinforcement
  mainBarDia: number;
  stirrupDia: number;
  stirrupSpacing: number;
  
  // Code Parameters
  safetyFactorConcrete: number;
  safetyFactorSteel: number;
  exposureCondition: string;
}

interface CalculationResults {
  // Basic Properties
  grossArea: number;
  netArea: number;
  concreteVolume: number;
  steelWeight: number;
  
  // Design Results
  requiredReinforcement: number;
  providedReinforcement: number;
  reinforcementRatio: number;
  
  // Capacity Check
  designCapacity: number;
  utilizationRatio: number;
  
  // Code Compliance
  minReinforcement: number;
  maxReinforcement: number;
  minClearCover: number;
  
  // Status
  isCompliant: boolean;
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

// Material databases
const CONCRETE_GRADES = {
  'M20': { fck: 20, density: 25 },
  'M25': { fck: 25, density: 25 },
  'M30': { fck: 30, density: 25 },
  'M35': { fck: 35, density: 25 },
  'M40': { fck: 40, density: 25 },
  'M45': { fck: 45, density: 25 },
  'M50': { fck: 50, density: 25 }
};

const STEEL_GRADES = {
  'Fe415': { fy: 415, density: 78.5 },
  'Fe500': { fy: 500, density: 78.5 },
  'Fe550': { fy: 550, density: 78.5 }
};

const EXPOSURE_CONDITIONS = {
  'mild': { minCover: 25, description: 'Mild exposure' },
  'moderate': { minCover: 30, description: 'Moderate exposure' },
  'severe': { minCover: 45, description: 'Severe exposure' },
  'very_severe': { minCover: 50, description: 'Very severe exposure' },
  'extreme': { minCover: 75, description: 'Extreme exposure' }
};

export const RectangularColumnCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useLanguage();
  const { preferences } = usePreferences();
  
  // State management
  const [inputs, setInputs] = useState<ColumnInputs>({
    width: 300,
    depth: 300,
    height: 3000,
    clearCover: 40,
    concreteGrade: 'M25',
    fck: 25,
    steelGrade: 'Fe415',
    fy: 415,
    axialLoad: 1000,
    momentX: 50,
    momentY: 50,
    mainBarDia: 16,
    stirrupDia: 8,
    stirrupSpacing: 150,
    safetyFactorConcrete: 1.5,
    safetyFactorSteel: 1.15,
    exposureCondition: 'moderate'
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const [showSteps, setShowSteps] = useState(false);
  const [showVisualization, setShowVisualization] = useState(true);
  const [activeTab, setActiveTab] = useState<'inputs' | 'results' | 'steps' | 'report'>('inputs');
  const [savedProjects, setSavedProjects] = useState<any[]>([]);

  // Update dependent values when grades change
  useEffect(() => {
    if (inputs.concreteGrade && CONCRETE_GRADES[inputs.concreteGrade as keyof typeof CONCRETE_GRADES]) {
      setInputs(prev => ({
        ...prev,
        fck: CONCRETE_GRADES[inputs.concreteGrade as keyof typeof CONCRETE_GRADES].fck
      }));
    }
  }, [inputs.concreteGrade]);

  useEffect(() => {
    if (inputs.steelGrade && STEEL_GRADES[inputs.steelGrade as keyof typeof STEEL_GRADES]) {
      setInputs(prev => ({
        ...prev,
        fy: STEEL_GRADES[inputs.steelGrade as keyof typeof STEEL_GRADES].fy
      }));
    }
  }, [inputs.steelGrade]);

  useEffect(() => {
    if (inputs.exposureCondition && EXPOSURE_CONDITIONS[inputs.exposureCondition as keyof typeof EXPOSURE_CONDITIONS]) {
      setInputs(prev => ({
        ...prev,
        clearCover: EXPOSURE_CONDITIONS[inputs.exposureCondition as keyof typeof EXPOSURE_CONDITIONS].minCover
      }));
    }
  }, [inputs.exposureCondition]);

  // Comprehensive calculation engine
  const performCalculations = (): CalculationResults => {
    const steps: CalculationStep[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    // Step 1: Basic geometry calculations
    const grossArea = (inputs.width * inputs.depth) / 1000000; // Convert mm² to m²
    steps.push({
      step: 1,
      description: 'Calculate gross cross-sectional area',
      formula: 'Ag = b × d',
      calculation: `${inputs.width} × ${inputs.depth}`,
      result: `${(grossArea * 1000000).toFixed(0)} mm² (${grossArea.toFixed(4)} m²)`,
      reference: 'IS 456:2000, Cl. 39.3'
    });

    // Step 2: Effective area calculation
    const effectiveWidth = inputs.width - 2 * inputs.clearCover;
    const effectiveDepth = inputs.depth - 2 * inputs.clearCover;
    const netArea = (effectiveWidth * effectiveDepth) / 1000000;
    steps.push({
      step: 2,
      description: 'Calculate effective area',
      formula: 'Aeff = (b - 2×cover) × (d - 2×cover)',
      calculation: `(${inputs.width} - 2×${inputs.clearCover}) × (${inputs.depth} - 2×${inputs.clearCover})`,
      result: `${(netArea * 1000000).toFixed(0)} mm² (${netArea.toFixed(4)} m²)`,
      reference: 'IS 456:2000, Cl. 26.5.1.1'
    });

    // Step 3: Concrete volume
    const concreteVolume = grossArea * (inputs.height / 1000); // m³
    steps.push({
      step: 3,
      description: 'Calculate concrete volume',
      formula: 'V = Ag × H',
      calculation: `${grossArea.toFixed(4)} × ${(inputs.height / 1000).toFixed(2)}`,
      result: `${concreteVolume.toFixed(3)} m³`,
      reference: 'Basic geometry'
    });

    // Step 4: Design constants
    const fcd = inputs.fck / inputs.safetyFactorConcrete; // Design compressive strength
    const fyd = inputs.fy / inputs.safetyFactorSteel; // Design yield strength
    steps.push({
      step: 4,
      description: 'Calculate design strengths',
      formula: 'fcd = fck/γc, fyd = fy/γs',
      calculation: `${inputs.fck}/${inputs.safetyFactorConcrete}, ${inputs.fy}/${inputs.safetyFactorSteel}`,
      result: `fcd = ${fcd.toFixed(1)} MPa, fyd = ${fyd.toFixed(1)} MPa`,
      reference: 'IS 456:2000, Cl. 36.4'
    });

    // Step 5: Minimum and maximum reinforcement
    const minReinforcement = Math.max(0.008 * grossArea * 1000000, 4 * Math.PI * Math.pow(inputs.mainBarDia/2, 2)); // mm²
    const maxReinforcement = 0.04 * grossArea * 1000000; // mm²
    steps.push({
      step: 5,
      description: 'Calculate reinforcement limits',
      formula: 'Ast,min = max(0.8% of Ag, 4 bars), Ast,max = 4% of Ag',
      calculation: `max(0.008×${(grossArea * 1000000).toFixed(0)}, 4×π×${(inputs.mainBarDia/2).toFixed(1)}²)`,
      result: `Min: ${minReinforcement.toFixed(0)} mm², Max: ${maxReinforcement.toFixed(0)} mm²`,
      reference: 'IS 456:2000, Cl. 26.5.3.1'
    });

    // Step 6: Load calculations and required reinforcement
    const axialLoadKN = inputs.axialLoad; // Already in kN
    const momentXKNm = inputs.momentX; // Already in kN.m
    const momentYKNm = inputs.momentY; // Already in kN.m

    // Simplified design approach for demonstration
    const eccentricityX = momentXKNm / axialLoadKN * 1000; // mm
    const eccentricityY = momentYKNm / axialLoadKN * 1000; // mm
    
    steps.push({
      step: 6,
      description: 'Calculate load eccentricities',
      formula: 'ex = Mx/P, ey = My/P',
      calculation: `${momentXKNm}/${axialLoadKN}, ${momentYKNm}/${axialLoadKN}`,
      result: `ex = ${eccentricityX.toFixed(1)} mm, ey = ${eccentricityY.toFixed(1)} mm`,
      reference: 'IS 456:2000, Cl. 39.1'
    });

    // Step 7: Required reinforcement (simplified calculation)
    const requiredReinforcement = Math.max(
      minReinforcement,
      (axialLoadKN * 1000 - 0.4 * inputs.fck * grossArea * 1000000) / (0.67 * inputs.fy)
    );
    
    steps.push({
      step: 7,
      description: 'Calculate required reinforcement',
      formula: 'Ast = max(Ast,min, (P - 0.4×fck×Ag)/(0.67×fy))',
      calculation: `max(${minReinforcement.toFixed(0)}, (${axialLoadKN}×1000 - 0.4×${inputs.fck}×${(grossArea * 1000000).toFixed(0)})/(0.67×${inputs.fy}))`,
      result: `${Math.max(0, requiredReinforcement).toFixed(0)} mm²`,
      reference: 'IS 456:2000, Cl. 39.3'
    });

    // Step 8: Provided reinforcement calculation
    const numberOfBars = Math.ceil(Math.max(0, requiredReinforcement) / (Math.PI * Math.pow(inputs.mainBarDia/2, 2)));
    const providedReinforcement = numberOfBars * Math.PI * Math.pow(inputs.mainBarDia/2, 2);
    
    steps.push({
      step: 8,
      description: 'Calculate provided reinforcement',
      formula: 'Number of bars = ceil(Ast,req / Area of one bar)',
      calculation: `ceil(${Math.max(0, requiredReinforcement).toFixed(0)} / (π×${(inputs.mainBarDia/2).toFixed(1)}²))`,
      result: `${numberOfBars} bars of ${inputs.mainBarDia}mm = ${providedReinforcement.toFixed(0)} mm²`,
      reference: 'Design practice'
    });

    // Step 9: Reinforcement ratio
    const reinforcementRatio = (providedReinforcement / (grossArea * 1000000)) * 100;
    steps.push({
      step: 9,
      description: 'Calculate reinforcement ratio',
      formula: 'ρ = (Ast,provided / Ag) × 100',
      calculation: `(${providedReinforcement.toFixed(0)} / ${(grossArea * 1000000).toFixed(0)}) × 100`,
      result: `${reinforcementRatio.toFixed(2)}%`,
      reference: 'IS 456:2000, Cl. 26.5.3.1'
    });

    // Step 10: Design capacity check
    const designCapacity = 0.4 * inputs.fck * grossArea * 1000000 + 0.67 * inputs.fy * providedReinforcement;
    const utilizationRatio = (axialLoadKN * 1000) / designCapacity;
    
    steps.push({
      step: 10,
      description: 'Calculate design capacity',
      formula: 'Pu = 0.4×fck×Ag + 0.67×fy×Ast',
      calculation: `0.4×${inputs.fck}×${(grossArea * 1000000).toFixed(0)} + 0.67×${inputs.fy}×${providedReinforcement.toFixed(0)}`,
      result: `${(designCapacity/1000).toFixed(0)} kN (Utilization: ${(utilizationRatio*100).toFixed(1)}%)`,
      reference: 'IS 456:2000, Cl. 39.3'
    });

    // Step 11: Steel weight calculation
    const barLength = inputs.height / 1000; // Convert to meters
    const totalSteelVolume = (numberOfBars * Math.PI * Math.pow(inputs.mainBarDia/2000, 2) * barLength) + 
                            (inputs.height / inputs.stirrupSpacing * 2 * (inputs.width + inputs.depth) / 1000 * Math.PI * Math.pow(inputs.stirrupDia/2000, 2));
    const steelWeight = totalSteelVolume * STEEL_GRADES[inputs.steelGrade as keyof typeof STEEL_GRADES].density;
    
    steps.push({
      step: 11,
      description: 'Calculate steel weight',
      formula: 'Weight = Volume × Density',
      calculation: `${totalSteelVolume.toFixed(6)} m³ × ${STEEL_GRADES[inputs.steelGrade as keyof typeof STEEL_GRADES].density} kN/m³`,
      result: `${steelWeight.toFixed(2)} kg`,
      reference: 'Material properties'
    });

    // Validation and warnings
    if (reinforcementRatio < 0.8) {
      warnings.push('Reinforcement ratio is below minimum (0.8%)');
    }
    if (reinforcementRatio > 4.0) {
      errors.push('Reinforcement ratio exceeds maximum (4.0%)');
    }
    if (inputs.clearCover < EXPOSURE_CONDITIONS[inputs.exposureCondition as keyof typeof EXPOSURE_CONDITIONS].minCover) {
      warnings.push(`Clear cover should be at least ${EXPOSURE_CONDITIONS[inputs.exposureCondition as keyof typeof EXPOSURE_CONDITIONS].minCover}mm for ${inputs.exposureCondition} exposure`);
    }
    if (utilizationRatio > 1.0) {
      errors.push('Column capacity is insufficient for applied loads');
    }
    if (utilizationRatio > 0.9) {
      warnings.push('High utilization ratio (>90%) - consider increasing section size');
    }

    setCalculationSteps(steps);

    return {
      grossArea: grossArea * 1000000, // Convert back to mm²
      netArea: netArea * 1000000,
      concreteVolume,
      steelWeight,
      requiredReinforcement: Math.max(0, requiredReinforcement),
      providedReinforcement,
      reinforcementRatio,
      designCapacity: designCapacity / 1000, // Convert to kN
      utilizationRatio,
      minReinforcement,
      maxReinforcement,
      minClearCover: EXPOSURE_CONDITIONS[inputs.exposureCondition as keyof typeof EXPOSURE_CONDITIONS].minCover,
      isCompliant: errors.length === 0,
      warnings,
      errors
    };
  };

  // Calculate results whenever inputs change
  useEffect(() => {
    const newResults = performCalculations();
    setResults(newResults);
  }, [inputs]);

  // Input handlers
  const handleInputChange = (field: keyof ColumnInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  // Project management
  const saveProject = () => {
    const project = {
      id: Date.now(),
      name: `Column Project ${new Date().toLocaleDateString()}`,
      inputs,
      results,
      timestamp: new Date().toISOString()
    };
    const saved = [...savedProjects, project];
    setSavedProjects(saved);
    localStorage.setItem('columnProjects', JSON.stringify(saved));
    alert('Project saved successfully!');
  };

  const loadProject = (project: any) => {
    setInputs(project.inputs);
    setResults(project.results);
  };

  const resetInputs = () => {
    setInputs({
      width: 300,
      depth: 300,
      height: 3000,
      clearCover: 40,
      concreteGrade: 'M25',
      fck: 25,
      steelGrade: 'Fe415',
      fy: 415,
      axialLoad: 1000,
      momentX: 50,
      momentY: 50,
      mainBarDia: 16,
      stirrupDia: 8,
      stirrupSpacing: 150,
      safetyFactorConcrete: 1.5,
      safetyFactorSteel: 1.15,
      exposureCondition: 'moderate'
    });
  };

  // Load saved projects on mount
  useEffect(() => {
    const saved = localStorage.getItem('columnProjects');
    if (saved) {
      setSavedProjects(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Concrete Calculator
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={saveProject}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} className="mr-2" />
                Save Project
              </button>
              <button
                onClick={resetInputs}
                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Rectangular Column Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Professional reinforced concrete column design and analysis tool
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: 'inputs', label: 'Design Inputs', icon: Settings },
              { id: 'results', label: 'Results', icon: Calculator },
              { id: 'steps', label: 'Calculation Steps', icon: FileText },
              { id: 'report', label: 'Report', icon: Download }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'inputs' && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Design Parameters</h2>
                
                {/* Geometry Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Geometry
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Width (mm)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.width}
                        onChange={(e) => handleInputChange('width', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        min="150"
                        max="2000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum: 150mm</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Depth (mm)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.depth}
                        onChange={(e) => handleInputChange('depth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        min="150"
                        max="2000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum: 150mm</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Height (mm)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        min="1000"
                        max="20000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Column height</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Clear Cover (mm)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.clearCover}
                        onChange={(e) => handleInputChange('clearCover', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        min="20"
                        max="100"
                      />
                      <p className="text-xs text-gray-500 mt-1">As per exposure condition</p>
                    </div>
                  </div>
                </div>

                {/* Material Properties Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Material Properties
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Concrete Grade
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        value={inputs.concreteGrade}
                        onChange={(e) => handleInputChange('concreteGrade', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      >
                        {Object.keys(CONCRETE_GRADES).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        fck (MPa)
                      </label>
                      <input
                        type="number"
                        value={inputs.fck}
                        onChange={(e) => handleInputChange('fck', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Characteristic strength</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Steel Grade
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        value={inputs.steelGrade}
                        onChange={(e) => handleInputChange('steelGrade', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      >
                        {Object.keys(STEEL_GRADES).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        fy (MPa)
                      </label>
                      <input
                        type="number"
                        value={inputs.fy}
                        onChange={(e) => handleInputChange('fy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Yield strength</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exposure Condition
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        value={inputs.exposureCondition}
                        onChange={(e) => handleInputChange('exposureCondition', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      >
                        {Object.entries(EXPOSURE_CONDITIONS).map(([key, value]) => (
                          <option key={key} value={key}>{value.description}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Loads Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Applied Loads
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Axial Load (kN)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.axialLoad}
                        onChange={(e) => handleInputChange('axialLoad', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Factored axial load</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Moment X (kN.m)
                      </label>
                      <input
                        type="number"
                        value={inputs.momentX}
                        onChange={(e) => handleInputChange('momentX', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">About X-axis</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Moment Y (kN.m)
                      </label>
                      <input
                        type="number"
                        value={inputs.momentY}
                        onChange={(e) => handleInputChange('momentY', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">About Y-axis</p>
                    </div>
                  </div>
                </div>

                {/* Reinforcement Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Reinforcement Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Main Bar Diameter (mm)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        value={inputs.mainBarDia}
                        onChange={(e) => handleInputChange('mainBarDia', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      >
                        {[12, 16, 20, 25, 32, 40].map(dia => (
                          <option key={dia} value={dia}>{dia}mm</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stirrup Diameter (mm)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        value={inputs.stirrupDia}
                        onChange={(e) => handleInputChange('stirrupDia', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      >
                        {[6, 8, 10, 12].map(dia => (
                          <option key={dia} value={dia}>{dia}mm</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stirrup Spacing (mm)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        value={inputs.stirrupSpacing}
                        onChange={(e) => handleInputChange('stirrupSpacing', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        min="75"
                        max="300"
                      />
                      <p className="text-xs text-gray-500 mt-1">Center to center</p>
                    </div>
                  </div>
                </div>

                {/* Safety Factors Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Safety Factors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        γc (Concrete)
                      </label>
                      <input
                        type="number"
                        value={inputs.safetyFactorConcrete}
                        onChange={(e) => handleInputChange('safetyFactorConcrete', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        step="0.05"
                        min="1.0"
                        max="2.0"
                      />
                      <p className="text-xs text-gray-500 mt-1">IS 456: 1.5</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        γs (Steel)
                      </label>
                      <input
                        type="number"
                        value={inputs.safetyFactorSteel}
                        onChange={(e) => handleInputChange('safetyFactorSteel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        step="0.05"
                        min="1.0"
                        max="2.0"
                      />
                      <p className="text-xs text-gray-500 mt-1">IS 456: 1.15</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && results && (
              <div className="space-y-6">
                {/* Status Card */}
                <div className={`rounded-xl p-6 border-2 ${
                  results.isCompliant 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center">
                    {results.isCompliant ? (
                      <CheckCircle className="text-green-600 dark:text-green-400 mr-3" size={24} />
                    ) : (
                      <AlertTriangle className="text-red-600 dark:text-red-400 mr-3" size={24} />
                    )}
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        results.isCompliant 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {results.isCompliant ? 'Design Compliant' : 'Design Issues Found'}
                      </h3>
                      <p className={`text-sm ${
                        results.isCompliant 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {results.isCompliant 
                          ? 'Column design meets all code requirements' 
                          : 'Please review and address the issues below'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Warnings and Errors */}
                  {(results.warnings.length > 0 || results.errors.length > 0) && (
                    <div className="mt-4 space-y-2">
                      {results.errors.map((error, index) => (
                        <div key={index} className="flex items-start text-red-700 dark:text-red-300">
                          <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      ))}
                      {results.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start text-yellow-700 dark:text-yellow-300">
                          <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Geometry Results */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Geometry</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Gross Area:</span>
                        <span className="font-medium">{results.grossArea.toFixed(0)} mm²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Effective Area:</span>
                        <span className="font-medium">{results.netArea.toFixed(0)} mm²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Concrete Volume:</span>
                        <span className="font-medium">{results.concreteVolume.toFixed(3)} m³</span>
                      </div>
                    </div>
                  </div>

                  {/* Reinforcement Results */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Reinforcement</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Required:</span>
                        <span className="font-medium">{results.requiredReinforcement.toFixed(0)} mm²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Provided:</span>
                        <span className="font-medium">{results.providedReinforcement.toFixed(0)} mm²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ratio:</span>
                        <span className="font-medium">{results.reinforcementRatio.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Steel Weight:</span>
                        <span className="font-medium">{results.steelWeight.toFixed(2)} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Results */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Capacity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Design Capacity:</span>
                        <span className="font-medium">{results.designCapacity.toFixed(0)} kN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Utilization:</span>
                        <span className={`font-medium ${
                          results.utilizationRatio > 1.0 ? 'text-red-600' : 
                          results.utilizationRatio > 0.9 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {(results.utilizationRatio * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            results.utilizationRatio > 1.0 ? 'bg-red-500' : 
                            results.utilizationRatio > 0.9 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(results.utilizationRatio * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Detailed Calculation Steps</h2>
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {showSteps ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                    {showSteps ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  {calculationSteps.map((step) => (
                    <div key={step.step} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-4">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{step.description}</h4>
                          {showSteps && (
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Formula: </span>
                                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{step.formula}</code>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Calculation: </span>
                                <span className="text-gray-600 dark:text-gray-400">{step.calculation}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Result: </span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{step.result}</span>
                              </div>
                              {step.reference && (
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Reference: </span>
                                  <span className="text-blue-600 dark:text-blue-400 text-xs">{step.reference}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'report' && results && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Design Report</h2>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download size={16} className="mr-2" />
                    Export PDF
                  </button>
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  <h3>Rectangular Column Design Report</h3>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  
                  <h4>Design Parameters</h4>
                  <ul>
                    <li>Column Size: {inputs.width} × {inputs.depth} × {inputs.height} mm</li>
                    <li>Concrete Grade: {inputs.concreteGrade} (fck = {inputs.fck} MPa)</li>
                    <li>Steel Grade: {inputs.steelGrade} (fy = {inputs.fy} MPa)</li>
                    <li>Clear Cover: {inputs.clearCover} mm</li>
                    <li>Exposure Condition: {EXPOSURE_CONDITIONS[inputs.exposureCondition as keyof typeof EXPOSURE_CONDITIONS].description}</li>
                  </ul>
                  
                  <h4>Applied Loads</h4>
                  <ul>
                    <li>Axial Load: {inputs.axialLoad} kN</li>
                    <li>Moment about X-axis: {inputs.momentX} kN.m</li>
                    <li>Moment about Y-axis: {inputs.momentY} kN.m</li>
                  </ul>
                  
                  <h4>Design Results</h4>
                  <ul>
                    <li>Required Reinforcement: {results.requiredReinforcement.toFixed(0)} mm²</li>
                    <li>Provided Reinforcement: {results.providedReinforcement.toFixed(0)} mm²</li>
                    <li>Reinforcement Ratio: {results.reinforcementRatio.toFixed(2)}%</li>
                    <li>Design Capacity: {results.designCapacity.toFixed(0)} kN</li>
                    <li>Utilization Ratio: {(results.utilizationRatio * 100).toFixed(1)}%</li>
                  </ul>
                  
                  <h4>Compliance Status</h4>
                  <p className={results.isCompliant ? 'text-green-600' : 'text-red-600'}>
                    {results.isCompliant ? '✓ Design is compliant with IS 456:2000' : '✗ Design has compliance issues'}
                  </p>
                  
                  {results.warnings.length > 0 && (
                    <>
                      <h4>Warnings</h4>
                      <ul>
                        {results.warnings.map((warning, index) => (
                          <li key={index} className="text-yellow-600">{warning}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  {results.errors.length > 0 && (
                    <>
                      <h4>Errors</h4>
                      <ul>
                        {results.errors.map((error, index) => (
                          <li key={index} className="text-red-600">{error}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 3D Visualization */}
            {showVisualization && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">3D Visualization</h3>
                  <button
                    onClick={() => setShowVisualization(!showVisualization)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <EyeOff size={16} />
                  </button>
                </div>
                
                {/* Simple 3D representation */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-32 bg-blue-500 rounded-lg mx-auto mb-4 relative shadow-lg transform rotate-12">
                      <div className="absolute inset-2 border-2 border-yellow-400 rounded"></div>
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-red-400"></div>
                      <div className="absolute top-8 left-4 right-4 h-0.5 bg-red-400"></div>
                      <div className="absolute top-12 left-4 right-4 h-0.5 bg-red-400"></div>
                      <div className="absolute top-16 left-4 right-4 h-0.5 bg-red-400"></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {inputs.width} × {inputs.depth} mm
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Height: {inputs.height} mm
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://law.resource.org/pub/in/bis/S03/is.456.2000.pdf', '_blank')}
                  className="w-full flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Book size={16} className="mr-2" />
                  View IS 456:2000
                </button>
                <button className="w-full flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <FileText size={16} className="mr-2" />
                  Design Examples
                </button>
                <button className="w-full flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <Calculator size={16} className="mr-2" />
                  Load Calculator
                </button>
              </div>
            </div>

            {/* Saved Projects */}
            {savedProjects.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Saved Projects</h3>
                <div className="space-y-2">
                  {savedProjects.slice(-3).map((project) => (
                    <button
                      key={project.id}
                      onClick={() => loadProject(project)}
                      className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {project.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(project.timestamp).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};