import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Calculator, Package, Layers, BarChart3, FileText, Download, RefreshCw, Info, AlertTriangle, CheckCircle, Settings, Eye, Maximize2 } from 'lucide-react';
import { Visualization3D } from '../components/3DVisualization';
import { ReferenceTableModal } from '../components/ReferenceTableModal';

interface ColumnInputs {
  // Geometry
  width: number;
  depth: number;
  height: number;
  numberOfColumns: number;
  
  // Concrete Mix
  mixRatio: string;
  cementRatio: number;
  sandRatio: number;
  aggregateRatio: number;
  waterCementRatio: number;
  
  // Quantity Factors
  dryVolumeFactor: number;
  wastageFactor: number;
  bulkingFactor: number;
  
  // Reinforcement
  mainBarDiameter: number;
  numberOfMainBars: number;
  stirrupDiameter: number;
  stirrupSpacing: number;
  clearCover: number;
  
  // Additional Options
  includeFooting: boolean;
  footingLength: number;
  footingWidth: number;
  footingThickness: number;
  
  // Cost Estimation (Optional)
  enableCostEstimation: boolean;
  cementRate: number; // per bag
  sandRate: number; // per cubic meter
  aggregateRate: number; // per cubic meter
  steelRate: number; // per kg
}

interface QuantityResults {
  concrete: {
    wetVolume: number;
    dryVolume: number;
    totalVolume: number;
    cement: {
      weight: number;
      bags: number;
    };
    sand: {
      volume: number;
      weight: number;
    };
    aggregate: {
      volume: number;
      weight: number;
    };
    water: number;
  };
  steel: {
    mainBars: {
      length: number;
      weight: number;
      numberOfBars: number;
    };
    stirrups: {
      length: number;
      weight: number;
      numberOfStirrups: number;
    };
    total: {
      weight: number;
      wastage: number;
      finalWeight: number;
    };
  };
  footing?: {
    concrete: {
      volume: number;
      cement: { weight: number; bags: number };
      sand: { volume: number; weight: number };
      aggregate: { volume: number; weight: number };
    };
  };
  costs?: {
    concrete: number;
    steel: number;
    total: number;
  };
}

const CONCRETE_MIXES = {
  '1:1.5:3': { cement: 1, sand: 1.5, aggregate: 3, grade: 'M20', dryFactor: 1.52, wastage: 1.02 },
  '1:2:4': { cement: 1, sand: 2, aggregate: 4, grade: 'M15', dryFactor: 1.54, wastage: 1.03 },
  '1:3:6': { cement: 1, sand: 3, aggregate: 6, grade: 'M10', dryFactor: 1.57, wastage: 1.05 },
  '1:1:2': { cement: 1, sand: 1, aggregate: 2, grade: 'M25', dryFactor: 1.50, wastage: 1.01 },
  '1:1.2:2.4': { cement: 1, sand: 1.2, aggregate: 2.4, grade: 'M30', dryFactor: 1.48, wastage: 1.00 }
};

const STEEL_DENSITIES = {
  8: 0.395, 10: 0.617, 12: 0.888, 16: 1.578, 20: 2.466, 25: 3.854, 32: 6.313
};

export const RectangularColumnCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('inputs');
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [inputs, setInputs] = useState<ColumnInputs>({
    // Geometry
    width: 300,
    depth: 300,
    height: 3000,
    numberOfColumns: 1,
    
    // Concrete Mix
    mixRatio: '1:1.5:3',
    cementRatio: 1,
    sandRatio: 1.5,
    aggregateRatio: 3,
    waterCementRatio: 0.5,
    
    // Quantity Factors
    dryVolumeFactor: 1.52,
    wastageFactor: 1.02,
    bulkingFactor: 1.25,
    
    // Reinforcement
    mainBarDiameter: 16,
    numberOfMainBars: 8,
    stirrupDiameter: 8,
    stirrupSpacing: 150,
    clearCover: 40,
    
    // Additional Options
    includeFooting: false,
    footingLength: 1500,
    footingWidth: 1500,
    footingThickness: 600,
    
    // Cost Estimation
    enableCostEstimation: false,
    cementRate: 400, // per bag
    sandRate: 1500, // per cubic meter
    aggregateRate: 1200, // per cubic meter
    steelRate: 65 // per kg
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update mix ratios when mix type changes
  useEffect(() => {
    const mix = CONCRETE_MIXES[inputs.mixRatio as keyof typeof CONCRETE_MIXES];
    if (mix) {
      setInputs(prev => ({
        ...prev,
        cementRatio: mix.cement,
        sandRatio: mix.sand,
        aggregateRatio: mix.aggregate,
        dryVolumeFactor: mix.dryFactor,
        wastageFactor: mix.wastage
      }));
    }
  }, [inputs.mixRatio]);

  // Comprehensive quantity calculations
  const results = useMemo((): QuantityResults => {
    // Column concrete volume
    const columnVolume = (inputs.width * inputs.depth * inputs.height) / 1000000000; // Convert mm³ to m³
    const totalColumnVolume = columnVolume * inputs.numberOfColumns;
    
    // Apply factors
    const dryVolume = totalColumnVolume * inputs.dryVolumeFactor;
    const finalVolume = dryVolume * inputs.wastageFactor;
    
    // Calculate material quantities
    const totalRatio = inputs.cementRatio + inputs.sandRatio + inputs.aggregateRatio;
    
    // Cement calculation
    const cementVolume = (finalVolume * inputs.cementRatio) / totalRatio;
    const cementWeight = cementVolume * 1440; // Cement density = 1440 kg/m³
    const cementBags = cementWeight / 50; // 50 kg per bag
    
    // Sand calculation
    const sandVolume = (finalVolume * inputs.sandRatio) / totalRatio;
    const sandVolumeWithBulking = sandVolume * inputs.bulkingFactor;
    const sandWeight = sandVolumeWithBulking * 1600; // Sand density = 1600 kg/m³
    
    // Aggregate calculation
    const aggregateVolume = (finalVolume * inputs.aggregateRatio) / totalRatio;
    const aggregateWeight = aggregateVolume * 1500; // Aggregate density = 1500 kg/m³
    
    // Water calculation
    const waterVolume = cementWeight * inputs.waterCementRatio;
    
    // Steel calculations
    const effectiveHeight = inputs.height - (2 * inputs.clearCover);
    const mainBarLength = effectiveHeight * inputs.numberOfMainBars * inputs.numberOfColumns / 1000; // Convert to meters
    const mainBarWeight = mainBarLength * (STEEL_DENSITIES[inputs.mainBarDiameter as keyof typeof STEEL_DENSITIES] || 1);
    
    // Stirrup calculations
    const stirrupPerimeter = 2 * ((inputs.width - 2 * inputs.clearCover) + (inputs.depth - 2 * inputs.clearCover)) / 1000; // Convert to meters
    const numberOfStirrups = Math.ceil(inputs.height / inputs.stirrupSpacing) * inputs.numberOfColumns;
    const stirrupLength = stirrupPerimeter * numberOfStirrups;
    const stirrupWeight = stirrupLength * (STEEL_DENSITIES[inputs.stirrupDiameter as keyof typeof STEEL_DENSITIES] || 0.395);
    
    const totalSteelWeight = mainBarWeight + stirrupWeight;
    const steelWastage = totalSteelWeight * 0.05; // 5% wastage
    const finalSteelWeight = totalSteelWeight + steelWastage;
    
    // Footing calculations (if included)
    let footingResults;
    if (inputs.includeFooting) {
      const footingVolume = (inputs.footingLength * inputs.footingWidth * inputs.footingThickness) / 1000000000 * inputs.numberOfColumns;
      const footingDryVolume = footingVolume * inputs.dryVolumeFactor;
      const footingFinalVolume = footingDryVolume * inputs.wastageFactor;
      
      const footingCementVolume = (footingFinalVolume * inputs.cementRatio) / totalRatio;
      const footingCementWeight = footingCementVolume * 1440;
      const footingCementBags = footingCementWeight / 50;
      
      const footingSandVolume = (footingFinalVolume * inputs.sandRatio) / totalRatio * inputs.bulkingFactor;
      const footingSandWeight = footingSandVolume * 1600;
      
      const footingAggregateVolume = (footingFinalVolume * inputs.aggregateRatio) / totalRatio;
      const footingAggregateWeight = footingAggregateVolume * 1500;
      
      footingResults = {
        concrete: {
          volume: footingVolume,
          cement: { weight: footingCementWeight, bags: footingCementBags },
          sand: { volume: footingSandVolume, weight: footingSandWeight },
          aggregate: { volume: footingAggregateVolume, weight: footingAggregateWeight }
        }
      };
    }
    
    // Cost calculations (if enabled)
    let costResults;
    if (inputs.enableCostEstimation) {
      const concreteCost = (cementBags * inputs.cementRate) + 
                          (sandVolumeWithBulking * inputs.sandRate) + 
                          (aggregateVolume * inputs.aggregateRate);
      const steelCost = finalSteelWeight * inputs.steelRate;
      
      costResults = {
        concrete: concreteCost,
        steel: steelCost,
        total: concreteCost + steelCost
      };
    }
    
    return {
      concrete: {
        wetVolume: totalColumnVolume,
        dryVolume: dryVolume,
        totalVolume: finalVolume,
        cement: { weight: cementWeight, bags: cementBags },
        sand: { volume: sandVolumeWithBulking, weight: sandWeight },
        aggregate: { volume: aggregateVolume, weight: aggregateWeight },
        water: waterVolume
      },
      steel: {
        mainBars: { length: mainBarLength, weight: mainBarWeight, numberOfBars: inputs.numberOfMainBars * inputs.numberOfColumns },
        stirrups: { length: stirrupLength, weight: stirrupWeight, numberOfStirrups: numberOfStirrups },
        total: { weight: totalSteelWeight, wastage: steelWastage, finalWeight: finalSteelWeight }
      },
      footing: footingResults,
      costs: costResults
    };
  }, [inputs]);

  const handleInputChange = (field: keyof ColumnInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    if (inputs.width < 200) newErrors.width = 'Minimum width should be 200mm';
    if (inputs.depth < 200) newErrors.depth = 'Minimum depth should be 200mm';
    if (inputs.height < 1000) newErrors.height = 'Minimum height should be 1000mm';
    if (inputs.numberOfColumns < 1) newErrors.numberOfColumns = 'Number of columns must be at least 1';
    if (inputs.clearCover < 20) newErrors.clearCover = 'Minimum clear cover should be 20mm';
    if (inputs.stirrupSpacing < 75) newErrors.stirrupSpacing = 'Minimum stirrup spacing should be 75mm';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadExampleFromReference = (mixRatio: string) => {
    const mix = CONCRETE_MIXES[mixRatio as keyof typeof CONCRETE_MIXES];
    if (mix) {
      setInputs(prev => ({
        ...prev,
        mixRatio,
        cementRatio: mix.cement,
        sandRatio: mix.sand,
        aggregateRatio: mix.aggregate,
        dryVolumeFactor: mix.dryFactor,
        wastageFactor: mix.wastage
      }));
    }
    setShowReferenceModal(false);
  };

  const exportResults = () => {
    const data = {
      inputs,
      results,
      timestamp: new Date().toISOString(),
      project: 'Rectangular Column Quantity Calculation'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `column-quantities-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  📏 Rectangular Column Quantity Calculator
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Professional quantity estimation for expert engineers
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Calculator size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Expert Mode</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
                <Package size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Quantity Focus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-1 rounded-xl border border-white/20 dark:border-slate-700/50 shadow-lg">
            {[
              { id: 'inputs', label: '📝 Inputs & Parameters', icon: Settings },
              { id: 'results', label: '📊 Quantity Results', icon: BarChart3 },
              { id: 'visualization', label: '🎯 3D Visualization', icon: Eye },
              { id: 'export', label: '📄 Export & Reports', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Inputs Tab */}
        {activeTab === 'inputs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geometry Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
                  <Layers size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  📐 Column Geometry
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Width (mm)
                  </label>
                  <input
                    type="number"
                    value={inputs.width}
                    onChange={(e) => handleInputChange('width', Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      errors.width 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
                  />
                  {errors.width && <p className="text-red-500 text-xs mt-1">{errors.width}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Depth (mm)
                  </label>
                  <input
                    type="number"
                    value={inputs.depth}
                    onChange={(e) => handleInputChange('depth', Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      errors.depth 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
                  />
                  {errors.depth && <p className="text-red-500 text-xs mt-1">{errors.depth}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Height (mm)
                  </label>
                  <input
                    type="number"
                    value={inputs.height}
                    onChange={(e) => handleInputChange('height', Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      errors.height 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
                  />
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Number of Columns
                  </label>
                  <input
                    type="number"
                    value={inputs.numberOfColumns}
                    onChange={(e) => handleInputChange('numberOfColumns', Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      errors.numberOfColumns 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
                  />
                  {errors.numberOfColumns && <p className="text-red-500 text-xs mt-1">{errors.numberOfColumns}</p>}
                </div>
              </div>
            </div>

            {/* Concrete Mix Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
                    <Package size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    🏗️ Concrete Mix Design
                  </h3>
                </div>
                <button
                  onClick={() => setShowReferenceModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm hover:shadow-lg transition-all"
                >
                  📚 Reference
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Mix Ratio (C:S:A)
                  </label>
                  <select
                    value={inputs.mixRatio}
                    onChange={(e) => handleInputChange('mixRatio', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    {Object.entries(CONCRETE_MIXES).map(([ratio, mix]) => (
                      <option key={ratio} value={ratio}>
                        {ratio} ({mix.grade})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Cement Ratio
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.cementRatio}
                      onChange={(e) => handleInputChange('cementRatio', Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Sand Ratio
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.sandRatio}
                      onChange={(e) => handleInputChange('sandRatio', Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Aggregate Ratio
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.aggregateRatio}
                      onChange={(e) => handleInputChange('aggregateRatio', Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Water-Cement Ratio
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.waterCementRatio}
                      onChange={(e) => handleInputChange('waterCementRatio', Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Dry Volume Factor
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.dryVolumeFactor}
                      onChange={(e) => handleInputChange('dryVolumeFactor', Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reinforcement Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mr-3">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  🔩 Reinforcement Details
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Main Bar Diameter (mm)
                  </label>
                  <select
                    value={inputs.mainBarDiameter}
                    onChange={(e) => handleInputChange('mainBarDiameter', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    {Object.keys(STEEL_DENSITIES).map(dia => (
                      <option key={dia} value={dia}>{dia}mm</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Number of Main Bars
                  </label>
                  <input
                    type="number"
                    value={inputs.numberOfMainBars}
                    onChange={(e) => handleInputChange('numberOfMainBars', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Stirrup Diameter (mm)
                  </label>
                  <select
                    value={inputs.stirrupDiameter}
                    onChange={(e) => handleInputChange('stirrupDiameter', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    {Object.keys(STEEL_DENSITIES).map(dia => (
                      <option key={dia} value={dia}>{dia}mm</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Stirrup Spacing (mm)
                  </label>
                  <input
                    type="number"
                    value={inputs.stirrupSpacing}
                    onChange={(e) => handleInputChange('stirrupSpacing', Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      errors.stirrupSpacing 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
                  />
                  {errors.stirrupSpacing && <p className="text-red-500 text-xs mt-1">{errors.stirrupSpacing}</p>}
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Clear Cover (mm)
                  </label>
                  <input
                    type="number"
                    value={inputs.clearCover}
                    onChange={(e) => handleInputChange('clearCover', Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      errors.clearCover 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500'
                    } bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100`}
                  />
                  {errors.clearCover && <p className="text-red-500 text-xs mt-1">{errors.clearCover}</p>}
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                  <Settings size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  ⚙️ Additional Options
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeFooting"
                    checked={inputs.includeFooting}
                    onChange={(e) => handleInputChange('includeFooting', e.target.checked)}
                    className="mr-3 rounded"
                  />
                  <label htmlFor="includeFooting" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Include Footing Quantities
                  </label>
                </div>
                
                {inputs.includeFooting && (
                  <div className="grid grid-cols-3 gap-4 pl-6 border-l-2 border-indigo-200 dark:border-indigo-800">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Footing Length (mm)
                      </label>
                      <input
                        type="number"
                        value={inputs.footingLength}
                        onChange={(e) => handleInputChange('footingLength', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Footing Width (mm)
                      </label>
                      <input
                        type="number"
                        value={inputs.footingWidth}
                        onChange={(e) => handleInputChange('footingWidth', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Footing Thickness (mm)
                      </label>
                      <input
                        type="number"
                        value={inputs.footingThickness}
                        onChange={(e) => handleInputChange('footingThickness', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableCostEstimation"
                    checked={inputs.enableCostEstimation}
                    onChange={(e) => handleInputChange('enableCostEstimation', e.target.checked)}
                    className="mr-3 rounded"
                  />
                  <label htmlFor="enableCostEstimation" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enable Cost Estimation
                  </label>
                </div>
                
                {inputs.enableCostEstimation && (
                  <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-green-200 dark:border-green-800">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Cement Rate (₹/bag)
                      </label>
                      <input
                        type="number"
                        value={inputs.cementRate}
                        onChange={(e) => handleInputChange('cementRate', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Sand Rate (₹/m³)
                      </label>
                      <input
                        type="number"
                        value={inputs.sandRate}
                        onChange={(e) => handleInputChange('sandRate', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Aggregate Rate (₹/m³)
                      </label>
                      <input
                        type="number"
                        value={inputs.aggregateRate}
                        onChange={(e) => handleInputChange('aggregateRate', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Steel Rate (₹/kg)
                      </label>
                      <input
                        type="number"
                        value={inputs.steelRate}
                        onChange={(e) => handleInputChange('steelRate', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Concrete</p>
                    <p className="text-2xl font-bold">{results.concrete.totalVolume.toFixed(3)} m³</p>
                  </div>
                  <Package size={32} className="text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Total Steel</p>
                    <p className="text-2xl font-bold">{results.steel.total.finalWeight.toFixed(2)} kg</p>
                  </div>
                  <BarChart3 size={32} className="text-orange-200" />
                </div>
              </div>
              
              {inputs.enableCostEstimation && results.costs && (
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Cost</p>
                      <p className="text-2xl font-bold">₹{results.costs.total.toLocaleString()}</p>
                    </div>
                    <Calculator size={32} className="text-green-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Concrete Quantities */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
                  <Package size={24} className="text-blue-600 mr-3" />
                  🏗️ Concrete Quantities
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-400">Wet Volume</p>
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{results.concrete.wetVolume.toFixed(3)} m³</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                      <p className="text-sm text-indigo-600 dark:text-indigo-400">Dry Volume</p>
                      <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{results.concrete.dryVolume.toFixed(3)} m³</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Cement</span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100">{results.concrete.cement.weight.toFixed(0)} kg</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{results.concrete.cement.bags.toFixed(1)} bags</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Sand</span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100">{results.concrete.sand.volume.toFixed(3)} m³</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{results.concrete.sand.weight.toFixed(0)} kg</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Aggregate</span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100">{results.concrete.aggregate.volume.toFixed(3)} m³</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{results.concrete.aggregate.weight.toFixed(0)} kg</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Water</span>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{results.concrete.water.toFixed(0)} liters</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steel Quantities */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
                  <BarChart3 size={24} className="text-orange-600 mr-3" />
                  🔩 Steel Quantities
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h4 className="font-medium text-orange-700 dark:text-orange-300 mb-2">Main Bars ({inputs.mainBarDiameter}mm)</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-orange-600 dark:text-orange-400">Length</p>
                          <p className="font-bold text-orange-900 dark:text-orange-100">{results.steel.mainBars.length.toFixed(1)} m</p>
                        </div>
                        <div>
                          <p className="text-orange-600 dark:text-orange-400">Weight</p>
                          <p className="font-bold text-orange-900 dark:text-orange-100">{results.steel.mainBars.weight.toFixed(2)} kg</p>
                        </div>
                      </div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                        {results.steel.mainBars.numberOfBars} bars total
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Stirrups ({inputs.stirrupDiameter}mm)</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-yellow-600 dark:text-yellow-400">Length</p>
                          <p className="font-bold text-yellow-900 dark:text-yellow-100">{results.steel.stirrups.length.toFixed(1)} m</p>
                        </div>
                        <div>
                          <p className="text-yellow-600 dark:text-yellow-400">Weight</p>
                          <p className="font-bold text-yellow-900 dark:text-yellow-100">{results.steel.stirrups.weight.toFixed(2)} kg</p>
                        </div>
                      </div>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                        {results.steel.stirrups.numberOfStirrups} stirrups total
                      </p>
                    </div>
                    
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Total Steel</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-red-600 dark:text-red-400">Base Weight</p>
                          <p className="font-bold text-red-900 dark:text-red-100">{results.steel.total.weight.toFixed(2)} kg</p>
                        </div>
                        <div>
                          <p className="text-red-600 dark:text-red-400">Wastage (5%)</p>
                          <p className="font-bold text-red-900 dark:text-red-100">{results.steel.total.wastage.toFixed(2)} kg</p>
                        </div>
                        <div>
                          <p className="text-red-600 dark:text-red-400">Final Weight</p>
                          <p className="font-bold text-red-900 dark:text-red-100">{results.steel.total.finalWeight.toFixed(2)} kg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footing Results */}
            {inputs.includeFooting && results.footing && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
                  <Layers size={24} className="text-purple-600 mr-3" />
                  🏗️ Footing Quantities
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400">Volume</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{results.footing.concrete.volume.toFixed(3)} m³</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400">Cement</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{results.footing.concrete.cement.bags.toFixed(1)} bags</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400">Sand</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{results.footing.concrete.sand.volume.toFixed(3)} m³</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400">Aggregate</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{results.footing.concrete.aggregate.volume.toFixed(3)} m³</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cost Breakdown */}
            {inputs.enableCostEstimation && results.costs && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
                  <Calculator size={24} className="text-green-600 mr-3" />
                  💰 Cost Estimation
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">Concrete Cost</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">₹{results.costs.concrete.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Steel Cost</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">₹{results.costs.steel.toLocaleString()}</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">Total Cost</p>
                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">₹{results.costs.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Visualization Tab */}
        {activeTab === 'visualization' && (
          <div className="space-y-6">
            <Visualization3D
              width={inputs.width}
              depth={inputs.depth}
              height={inputs.height}
              mainBars={inputs.numberOfMainBars}
              stirrupSpacing={inputs.stirrupSpacing}
              clearCover={inputs.clearCover}
              className="w-full"
            />
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
                <FileText size={24} className="text-blue-600 mr-3" />
                📄 Export & Reports
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={exportResults}
                  className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Download size={24} className="mr-3" />
                  <div className="text-left">
                    <p className="font-bold">Export JSON Data</p>
                    <p className="text-sm text-blue-100">Complete calculation data</p>
                  </div>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <FileText size={24} className="mr-3" />
                  <div className="text-left">
                    <p className="font-bold">Print Report</p>
                    <p className="text-sm text-green-100">Professional summary</p>
                  </div>
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start">
                  <Info size={20} className="text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Export Information</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Exported data includes all input parameters, calculated quantities, and project information. 
                      This data can be imported back into the calculator or used for documentation purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reference Modal */}
      <ReferenceTableModal
        isOpen={showReferenceModal}
        onClose={() => setShowReferenceModal(false)}
        onLoadExample={loadExampleFromReference}
      />
    </div>
  );
};