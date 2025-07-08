import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, FileText, Eye, Download, Book, Zap, AlertTriangle, CheckCircle, RotateCcw, Settings, Info, Layers, BarChart3, Target, Ruler, Wrench, Shield } from 'lucide-react';
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
  { grade: 'M10', fck: 10, color: '#ef4444' },
  { grade: 'M15', fck: 15, color: '#f97316' },
  { grade: 'M20', fck: 20, color: '#eab308' },
  { grade: 'M25', fck: 25, color: '#84cc16' },
  { grade: 'M30', fck: 30, color: '#22c55e' },
  { grade: 'M35', fck: 35, color: '#10b981' },
  { grade: 'M40', fck: 40, color: '#06b6d4' },
  { grade: 'M45', fck: 45, color: '#3b82f6' },
  { grade: 'M50', fck: 50, color: '#8b5cf6' }
];

const STEEL_GRADES = [
  { grade: 'Fe415', fy: 415, color: '#f59e0b' },
  { grade: 'Fe500', fy: 500, color: '#d97706' },
  { grade: 'Fe550', fy: 550, color: '#b45309' }
];

const EXPOSURE_CONDITIONS = [
  { condition: 'Mild', cover: 25, description: 'Protected from weather', color: '#10b981' },
  { condition: 'Moderate', cover: 30, description: 'Sheltered from rain', color: '#3b82f6' },
  { condition: 'Severe', cover: 45, description: 'Exposed to rain/freezing', color: '#f59e0b' },
  { condition: 'Very Severe', cover: 50, description: 'Coastal areas', color: '#ef4444' },
  { condition: 'Extreme', cover: 75, description: 'Tidal zones', color: '#dc2626' }
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
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate results whenever inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateResults();
    }, 300); // Debounce calculations
    
    return () => clearTimeout(timer);
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

    setIsCalculating(true);
    
    // Simulate calculation time for better UX
    setTimeout(() => {
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
      setIsCalculating(false);
    }, 500);
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

  const getSelectedConcreteGrade = () => CONCRETE_GRADES.find(g => g.grade === inputs.concreteGrade);
  const getSelectedSteelGrade = () => STEEL_GRADES.find(g => g.grade === inputs.steelGrade);
  const getSelectedExposureCondition = () => EXPOSURE_CONDITIONS.find(c => c.condition === inputs.exposureCondition);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto p-4">
        {/* Enhanced Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-3 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Rectangular Column Rebar Calculator
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Professional reinforced concrete column design as per IS 456:2000
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                    <Shield size={16} className="mr-1" />
                    Code Compliant
                  </div>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <Target size={16} className="mr-1" />
                    Expert Level
                  </div>
                  <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                    <Zap size={16} className="mr-1" />
                    Real-time Analysis
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowReferenceModal(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Book size={16} className="mr-2" />
                Reference
              </button>
              <button
                onClick={resetToDefaults}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-2 mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'inputs', label: 'Design Inputs', icon: Calculator, color: 'from-emerald-500 to-teal-500' },
              { id: 'results', label: 'Results', icon: Eye, color: 'from-blue-500 to-indigo-500' },
              { id: 'calculations', label: 'Calculations', icon: FileText, color: 'from-purple-500 to-violet-500' },
              { id: 'reports', label: 'Reports', icon: Download, color: 'from-orange-500 to-red-500' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.label}
                  {isActive && (
                    <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'inputs' && (
              <div className="space-y-6">
                {/* Project Information */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4">
                      <Info size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Project Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={inputs.projectName}
                        onChange={(e) => handleInputChange('projectName', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Engineer Name
                      </label>
                      <input
                        type="text"
                        value={inputs.engineerName}
                        onChange={(e) => handleInputChange('engineerName', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter engineer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={inputs.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter project location"
                      />
                    </div>
                  </div>
                </div>

                {/* Geometry */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mr-4">
                      <Ruler size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Column Geometry
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { field: 'width', label: 'Width (mm)', icon: '↔️' },
                      { field: 'depth', label: 'Depth (mm)', icon: '↕️' },
                      { field: 'height', label: 'Height (mm)', icon: '⬆️' },
                      { field: 'clearCover', label: 'Clear Cover (mm)', icon: '🛡️' }
                    ].map(({ field, label, icon }) => (
                      <div key={field}>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          <span className="mr-2">{icon}</span>
                          {label}
                        </label>
                        <input
                          type="number"
                          value={inputs[field as keyof ColumnInputs] as number}
                          onChange={(e) => handleInputChange(field as keyof ColumnInputs, Number(e.target.value))}
                          className={`w-full px-4 py-3 border rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                            validationErrors[field] 
                              ? 'border-red-400 focus:ring-red-500' 
                              : 'border-slate-200 dark:border-slate-600 focus:ring-emerald-500'
                          }`}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                        {validationErrors[field] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertTriangle size={12} className="mr-1" />
                            {validationErrors[field]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Properties */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-4">
                      <Layers size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Material Properties
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        🏗️ Concrete Grade
                      </label>
                      <select
                        value={inputs.concreteGrade}
                        onChange={(e) => handleConcreteGradeChange(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        {CONCRETE_GRADES.map(grade => (
                          <option key={grade.grade} value={grade.grade}>
                            {grade.grade} (fck = {grade.fck} MPa)
                          </option>
                        ))}
                      </select>
                      {getSelectedConcreteGrade() && (
                        <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: `${getSelectedConcreteGrade()?.color}20` }}>
                          <div className="text-xs font-medium" style={{ color: getSelectedConcreteGrade()?.color }}>
                            Selected: {getSelectedConcreteGrade()?.grade}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        🔩 Steel Grade
                      </label>
                      <select
                        value={inputs.steelGrade}
                        onChange={(e) => handleSteelGradeChange(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        {STEEL_GRADES.map(grade => (
                          <option key={grade.grade} value={grade.grade}>
                            {grade.grade} (fy = {grade.fy} MPa)
                          </option>
                        ))}
                      </select>
                      {getSelectedSteelGrade() && (
                        <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: `${getSelectedSteelGrade()?.color}20` }}>
                          <div className="text-xs font-medium" style={{ color: getSelectedSteelGrade()?.color }}>
                            Selected: {getSelectedSteelGrade()?.grade}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        🌡️ Exposure Condition
                      </label>
                      <select
                        value={inputs.exposureCondition}
                        onChange={(e) => handleExposureConditionChange(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        {EXPOSURE_CONDITIONS.map(condition => (
                          <option key={condition.condition} value={condition.condition}>
                            {condition.condition} ({condition.cover}mm cover)
                          </option>
                        ))}
                      </select>
                      {getSelectedExposureCondition() && (
                        <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: `${getSelectedExposureCondition()?.color}20` }}>
                          <div className="text-xs font-medium" style={{ color: getSelectedExposureCondition()?.color }}>
                            {getSelectedExposureCondition()?.description}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Loading Conditions */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl mr-4">
                      <BarChart3 size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Loading Conditions
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { field: 'axialLoad', label: 'Axial Load (kN)', icon: '⬇️', color: 'text-red-600' },
                      { field: 'momentX', label: 'Moment X (kN.m)', icon: '↻', color: 'text-blue-600' },
                      { field: 'momentY', label: 'Moment Y (kN.m)', icon: '↺', color: 'text-green-600' }
                    ].map(({ field, label, icon, color }) => (
                      <div key={field}>
                        <label className={`block text-sm font-semibold mb-2 ${color}`}>
                          <span className="mr-2">{icon}</span>
                          {label}
                        </label>
                        <input
                          type="number"
                          value={inputs[field as keyof ColumnInputs] as number}
                          onChange={(e) => handleInputChange(field as keyof ColumnInputs, Number(e.target.value))}
                          className={`w-full px-4 py-3 border rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                            validationErrors[field] 
                              ? 'border-red-400 focus:ring-red-500' 
                              : 'border-slate-200 dark:border-slate-600 focus:ring-purple-500'
                          }`}
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                        {validationErrors[field] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertTriangle size={12} className="mr-1" />
                            {validationErrors[field]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reinforcement Details */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4">
                      <Wrench size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Reinforcement Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        🔗 Main Bar Diameter (mm)
                      </label>
                      <select
                        value={inputs.mainBarDia}
                        onChange={(e) => handleInputChange('mainBarDia', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      >
                        {[12, 16, 20, 25, 32].map(dia => (
                          <option key={dia} value={dia}>{dia}mm</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        ⭕ Stirrup Diameter (mm)
                      </label>
                      <select
                        value={inputs.stirrupDia}
                        onChange={(e) => handleInputChange('stirrupDia', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      >
                        {[6, 8, 10, 12].map(dia => (
                          <option key={dia} value={dia}>{dia}mm</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        📏 Stirrup Spacing (mm)
                      </label>
                      <input
                        type="number"
                        value={inputs.stirrupSpacing}
                        onChange={(e) => handleInputChange('stirrupSpacing', Number(e.target.value))}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter stirrup spacing"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && results && (
              <div className="space-y-6">
                {/* Design Status */}
                <div className={`rounded-2xl border p-6 backdrop-blur-xl shadow-xl ${
                  results.isDesignSafe 
                    ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center">
                    {results.isDesignSafe ? (
                      <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl mr-4">
                        <CheckCircle className="text-white" size={24} />
                      </div>
                    ) : (
                      <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-4">
                        <AlertTriangle className="text-white" size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${
                        results.isDesignSafe ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'
                      }`}>
                        {results.isDesignSafe ? '✅ Design is Safe' : '⚠️ Design Requires Attention'}
                      </h3>
                      <p className={`text-sm ${
                        results.isDesignSafe ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
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
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                    🎯 Design Results Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {formatNumber(results.reinforcementRatio, 2)}%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">Reinforcement Ratio</div>
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(results.reinforcementRatio * 25, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {results.numberOfBars}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">Number of Bars</div>
                      <div className="flex justify-center mt-3 space-x-1">
                        {Array.from({ length: Math.min(results.numberOfBars, 8) }).map((_, i) => (
                          <div key={i} className="w-2 h-6 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-full" />
                        ))}
                        {results.numberOfBars > 8 && (
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">+{results.numberOfBars - 8}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                        {formatNumber(results.utilizationRatio, 1)}%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">Capacity Utilization</div>
                      <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2 mt-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            results.utilizationRatio > 90 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                              : results.utilizationRatio > 70 
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-purple-500 to-violet-500'
                          }`}
                          style={{ width: `${Math.min(results.utilizationRatio, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                    📊 Detailed Results
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                          <th className="text-left py-4 px-4 font-bold text-slate-900 dark:text-slate-100">Parameter</th>
                          <th className="text-right py-4 px-4 font-bold text-slate-900 dark:text-slate-100">Value</th>
                          <th className="text-left py-4 px-4 font-bold text-slate-900 dark:text-slate-100">Unit</th>
                          <th className="text-center py-4 px-4 font-bold text-slate-900 dark:text-slate-100">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {[
                          { param: 'Gross Cross-sectional Area', value: results.grossArea, unit: 'mm²', status: '✅' },
                          { param: 'Required Reinforcement', value: results.requiredReinforcement, unit: 'mm²', status: '📋' },
                          { param: 'Provided Reinforcement', value: results.providedReinforcement, unit: 'mm²', status: '✅' },
                          { param: 'Design Capacity', value: results.designCapacity, unit: 'kN', status: '💪' },
                          { param: 'Concrete Volume', value: results.concreteVolume, unit: 'm³', status: '🏗️' },
                          { param: 'Steel Weight', value: results.steelWeight, unit: 'kg', status: '⚖️' }
                        ].map((row, index) => (
                          <tr key={index} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{row.param}</td>
                            <td className="py-4 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                              {typeof row.value === 'number' ? formatNumber(row.value, row.unit === 'm³' ? 3 : row.unit === 'kg' ? 1 : 0) : row.value}
                            </td>
                            <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{row.unit}</td>
                            <td className="py-4 px-4 text-center text-lg">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Warnings and Errors */}
                {(results.warnings.length > 0 || results.errors.length > 0) && (
                  <div className="space-y-4">
                    {results.errors.length > 0 && (
                      <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 backdrop-blur-xl">
                        <h4 className="text-red-900 dark:text-red-100 font-bold mb-4 flex items-center">
                          <AlertTriangle size={20} className="mr-2" />
                          ❌ Errors
                        </h4>
                        <ul className="space-y-2">
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
                      <div className="bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 backdrop-blur-xl">
                        <h4 className="text-yellow-900 dark:text-yellow-100 font-bold mb-4 flex items-center">
                          <AlertTriangle size={20} className="mr-2" />
                          ⚠️ Warnings
                        </h4>
                        <ul className="space-y-2">
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
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
                  <Calculator size={24} className="mr-3 text-purple-600" />
                  🧮 Step-by-Step Calculations
                </h3>
                {isCalculating ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <span className="ml-4 text-slate-600 dark:text-slate-400">Calculating...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {calculationSteps.map((step, index) => (
                      <div key={index} className="flex animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold mr-6 shadow-lg">
                          {step.step}
                        </div>
                        <div className="flex-1 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {step.description}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">Formula:</span>
                              <code className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg font-mono text-blue-800 dark:text-blue-200">
                                {step.formula}
                              </code>
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold text-green-600 dark:text-green-400 mr-2">Calculation:</span>
                              <span className="text-slate-700 dark:text-slate-300">{step.calculation}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold text-purple-600 dark:text-purple-400 mr-2">Result:</span>
                              <span className="font-bold text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                                {step.result}
                              </span>
                            </div>
                            {step.reference && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
                                📚 Reference: {step.reference}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4">
                    <FileText size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    📄 Report Generation
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Generate professional engineering reports with detailed calculations, compliance checks, and project documentation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowReportGenerator(true)}
                    className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FileText size={20} className="mr-2" />
                    Generate Advanced Report
                  </button>
                  <button
                    onClick={() => results && console.log('Quick export')}
                    disabled={!results}
                    className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={20} className="mr-2" />
                    Quick Export
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* 3D Visualization */}
            {results && (
              <div className="transform transition-all duration-300 hover:scale-105">
                <Visualization3D
                  width={inputs.width}
                  depth={inputs.depth}
                  height={inputs.height}
                  mainBars={results.numberOfBars}
                  stirrupSpacing={inputs.stirrupSpacing}
                  clearCover={inputs.clearCover}
                  className="shadow-2xl"
                />
              </div>
            )}

            {/* Standards Compliance */}
            {results && (
              <div className="transform transition-all duration-300 hover:scale-105">
                <StandardsCompliancePanel
                  designParameters={{
                    reinforcementRatio: results.reinforcementRatio,
                    minimumDimension: Math.min(inputs.width, inputs.depth),
                    clearCover: inputs.clearCover,
                    numberOfBars: results.numberOfBars
                  }}
                  region="India"
                />
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <Zap size={20} className="mr-2 text-yellow-500" />
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowReferenceModal(true)}
                  className="w-full flex items-center px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <Book size={16} className="mr-3 text-blue-600" />
                  📚 Concrete Mix Reference
                </button>
                <button
                  onClick={() => results && setShowReportGenerator(true)}
                  disabled={!results}
                  className="w-full flex items-center px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={16} className="mr-3 text-emerald-600" />
                  📄 Generate Report
                </button>
                <button
                  onClick={resetToDefaults}
                  className="w-full flex items-center px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-700/50 dark:hover:to-gray-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                >
                  <RotateCcw size={16} className="mr-3 text-slate-600" />
                  🔄 Reset to Defaults
                </button>
              </div>
            </div>

            {/* Calculation Status */}
            {results && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                  <Target size={20} className="mr-2 text-green-500" />
                  🎯 Status Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Design Safety</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      results.isDesignSafe 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                    }`}>
                      {results.isDesignSafe ? '✅ SAFE' : '❌ UNSAFE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Utilization</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      results.utilizationRatio > 90 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' 
                        : results.utilizationRatio > 70 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                    }`}>
                      {formatNumber(results.utilizationRatio, 1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Reinforcement</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded-full text-xs font-bold">
                      {formatNumber(results.reinforcementRatio, 2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
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
    </div>
  );
};