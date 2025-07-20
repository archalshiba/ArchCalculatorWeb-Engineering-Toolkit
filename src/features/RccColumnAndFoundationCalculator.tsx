import React, { useState } from 'react';
import { ArrowLeft, Calculator, Eye, Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { GeometryForm } from './components/GeometryForm';
import { MaterialsForm } from './components/MaterialsForm';
import { ReinforcementForm } from './components/ReinforcementForm';
import ResultsPanel from './components/ResultsPanel';
import { Viewer3D } from './components/Viewer3D';
import {
  calculateColumn,
  calculateFoundation,
  calculateBBSBreakdown,
  RebarCut
} from '../utils/calculations';
import { FoundationData, ColumnData } from './types/calculator';

interface RccColumnAndFoundationCalculatorProps {
  onBack: () => void;
}

export const RccColumnAndFoundationCalculator: React.FC<RccColumnAndFoundationCalculatorProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('geometry');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Foundation Data
  const [foundationData, setFoundationData] = useState<FoundationData>({
    id: `FND-${Date.now()}`,
    type: 'isolated',
    width: 2000,
    length: 2000,
    thickness: 500,
    embeddedDepth: 0,
    elementLabel: 'Foundation-01'
  });

  // Column Data
  const [columnData, setColumnData] = useState<ColumnData>({
    shape: 'rectangular',
    width: 400,
    depth: 400,
    height: 3000,
    diameter: 400,
    flangeWidth: 600,
    flangeThickness: 200,
    webWidth: 300,
    webThickness: 200,
    sideLength: 400,
    numberOfSides: 6
  });

  // Materials Data
  const [materialsData, setMaterialsData] = useState({
    concreteGrade: 'M25',
    concreteDensity: 2400,
    admixtureType: 'none',
    admixturePercent: 0,
    slump: 75,
    steelGrade: 'Fe415',
    steelDensity: 7850,
    concreteWasteFactor: 5,
    steelWasteFactor: 3
  });

  // Reinforcement Data
  const [reinforcementData, setReinforcementData] = useState({
    column: {
      mainBars: {
        count: 8,
        diameter: 16,
        cover: 40,
        developmentLength: 600
      },
      stirrups: {
        shape: 'rectangular',
        diameter: 8,
        spacing: 150,
        hookType: '135',
        hookLength: 75,
        numberOfLegs: 4
      }
    },
    footing: {
      bottomBarsX: {
        count: 12,
        diameter: 12,
        spacing: 150
      },
      bottomBarsY: {
        count: 12,
        diameter: 12,
        spacing: 150
      },
      topBars: {
        enabled: false,
        count: 8,
        diameter: 10,
        spacing: 200
      },
      mesh: {
        enabled: false,
        meshSize: 150,
        barSize: 8
      }
    }
  });

  // Calculation Results
  const [results, setResults] = useState<any | null>(null);

  // 3D Viewer Settings
  const [viewerSettings, setViewerSettings] = useState({
    showConcrete: true,
    showMainBars: true,
    showStirrupsAndTies: true,
    showMesh: true,
    projection: 'perspective' as 'orthographic' | 'perspective',
    viewAngle: 'isometric' as 'top' | 'front' | 'side' | 'isometric'
  });

  const tabs = [
    { id: 'geometry', label: 'Geometry', icon: '📐' },
    { id: 'materials', label: 'Materials', icon: '🧱' },
    { id: 'reinforcement', label: 'Reinforcement', icon: '🔩' },
    { id: 'results', label: 'Results & Export', icon: '📊' }
  ];

  const runCalculations = async () => {
    setIsCalculating(true);
    try {
      // Simulate calculation time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const columnResults = calculateColumn(columnData, materialsData, reinforcementData.column);
      const foundationResults = calculateFoundation(foundationData, materialsData, reinforcementData.footing);

      // Example: Generate rebarCuts array (replace with your actual logic)
      const rebarCuts: RebarCut[] = [];
      // You should populate rebarCuts from reinforcementData for real use
      // For demo, add a sample cut:
      rebarCuts.push({
        shape: 'straight',
        length: 1000,
        count: 8,
        bendAllowance: 40,
        costPerCut: 5
      });

      // Calculate BBS breakdown
      const bbsBreakdown = calculateBBSBreakdown(
        columnResults.totalSteelWeight + foundationResults.totalSteelWeight,
        60, // steelRate
        columnResults.concreteVolume + foundationResults.concreteVolume,
        150, // concreteRate
        rebarCuts
      );

      setResults({
        column: columnResults,
        foundation: foundationResults,
        combined: {
          totalConcreteVolume: columnResults.concreteVolume + foundationResults.concreteVolume,
          totalSteelWeight: columnResults.totalSteelWeight + foundationResults.totalSteelWeight,
          totalCost: columnResults.totalCost + foundationResults.totalCost
        },
        bbsBreakdown,
        rebarCuts
      });

      setActiveTab('results');
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const exportData = (format: 'pdf' | 'excel' | 'json') => {
    console.log(`Exporting as ${format}...`);
    // Implementation for export functionality
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geometry':
        return (
          <GeometryForm
            foundationData={foundationData}
            columnData={columnData}
            unitSystem={unitSystem}
            onFoundationChange={setFoundationData}
            onColumnChange={setColumnData}
            onUnitSystemChange={setUnitSystem}
          />
        );
      case 'materials':
        return (
          <MaterialsForm
            data={materialsData}
            unitSystem={unitSystem}
            onChange={setMaterialsData}
          />
        );
      case 'reinforcement':
        return (
          <ReinforcementForm
            data={reinforcementData}
            unitSystem={unitSystem}
            onChange={setReinforcementData}
          />
        );
      case 'results':
        return (
          <ResultsPanel
            results={results}
            onExport={exportData}
            bbsBreakdown={results?.bbsBreakdown}
            rebarCuts={results?.rebarCuts}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  🏗️ RCC Column & Foundation Calculator
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Professional quantity estimation for expert engineers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                Expert Mode
              </div>
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Pane - Inputs */}
          <div className="lg:col-span-1 flex flex-col">
            {/* Tab Navigation */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-1 rounded-xl border border-white/20 dark:border-slate-700/50 mb-6">
              <div className="grid grid-cols-2 gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {renderTabContent()}
            </div>

            {/* Sticky Bottom Bar */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-xl border border-white/20 dark:border-slate-700/50 mt-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={runCalculations}
                  disabled={isCalculating}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Calculator size={20} className="mr-2" />
                  {isCalculating ? 'Calculating...' : 'Run Calculations'}
                </button>
                <div className="relative">
                  <button className="p-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane - 3D Preview & Results */}
          <div className="lg:col-span-2 flex flex-col">
            {/* 3D Viewer Toolbar */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-4 rounded-xl border border-white/20 dark:border-slate-700/50 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Eye size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Visibility:</span>
                    <div className="flex items-center space-x-2">
                      {Object.entries(viewerSettings).slice(0, 4).map(([key, value]) => (
                        <label key={key} className="flex items-center text-xs">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => setViewerSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                            className="mr-1 rounded"
                          />
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <ZoomIn size={16} />
                  </button>
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <ZoomOut size={16} />
                  </button>
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <RotateCcw size={16} />
                  </button>
                  <button className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-sm">
                    📸 Snapshot
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Viewer */}
            <div className="flex-1">
              <Viewer3D
                foundationData={foundationData}
                columnData={columnData}
                reinforcementData={reinforcementData}
                settings={viewerSettings}
                unitSystem={unitSystem}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Only use one export to avoid redeclaration error
// export { RccColumnAndFoundationCalculator }