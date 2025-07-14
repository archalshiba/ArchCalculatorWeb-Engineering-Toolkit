import React, { useState } from 'react';
import { ArrowLeft, Calculator, Download } from 'lucide-react';
import { GeometryForm } from './components/GeometryForm';
import { MaterialsForm } from './components/MaterialsForm';
import { ReinforcementForm } from './components/ReinforcementForm';
import { ResultsPanel } from './components/ResultsPanel';
import { Viewer3D } from './components/Viewer3D';
import BssTablePanel from '../components/BssTablePanel';
import { calculateColumn, calculateFoundation } from '../utils/calculations';
import { FoundationData, ColumnData, CalculationResults } from './types/calculator';

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
  const [results, setResults] = useState<CalculationResults | null>(null);

  // 3D Viewer Settings
  const [viewerSettings, setViewerSettings] = useState({
    showConcrete: true,
    showMainBars: true,
    showStirrupsAndTies: true,
    showMesh: true,
    projection: 'perspective' as 'orthographic' | 'perspective',
    viewAngle: 'isometric' as 'top' | 'front' | 'side' | 'isometric',
    zoom: 1,
    pinned: false
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
      setResults({
        column: columnResults,
        foundation: foundationResults,
        combined: {
          totalConcreteVolume: columnResults.concreteVolume + foundationResults.concreteVolume,
          totalSteelWeight: columnResults.totalSteelWeight + foundationResults.totalSteelWeight,
          totalCost: columnResults.totalCost + foundationResults.totalCost
        }
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
            unitSystem={unitSystem}
            onExport={exportData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden">
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
      <div className="max-w-7xl mx-auto p-0 h-full flex flex-col">
        <div className="flex flex-1 h-full">
          {/* Left Pane - Inputs (sticky, scrollable) */}
          <div className="flex flex-col h-full bg-white/80 dark:bg-slate-800/80" style={{ minWidth: 400, maxWidth: 400 }}>
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 gap-0 mb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center px-2 py-2 rounded-none text-sm font-medium transition-all duration-200 border-none ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {renderTabContent()}
            </div>
            {/* Sticky Bottom Bar */}
            <div className="sticky bottom-0 bg-white/80 dark:bg-slate-800/80 z-10">
              <div className="flex items-center">
                <button
                  onClick={runCalculations}
                  disabled={isCalculating}
                  className="flex-1 flex items-center justify-center px-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-none hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Calculator size={20} className="mr-1" />
                  {isCalculating ? 'Calculating...' : 'Run Calculations'}
                </button>
                <div className="relative">
                  <button className="p-2 bg-slate-600 text-white rounded-none hover:bg-slate-700 transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Right Pane - 3D Preview & BSS Table split vertically */}
          <div className="flex flex-col flex-1 h-full">
            <div className="flex-1 bg-white/80 dark:bg-slate-800/80 flex flex-col items-center justify-center overflow-hidden relative">
              {/* Enhanced AutoCAD-style toolbar for view switching and controls */}
              <div className="absolute top-4 left-4 z-20 flex space-x-2 bg-white/90 dark:bg-slate-900/80 rounded-lg shadow-lg p-2 border border-slate-200 dark:border-slate-700">
                <button
                  className={`px-3 py-1 rounded font-semibold text-xs transition-colors border ${viewerSettings.viewAngle === 'isometric' ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-700'}`}
                  onClick={() => setViewerSettings({ ...viewerSettings, viewAngle: 'isometric', projection: 'perspective' })}
                >
                  3D
                </button>
                <button
                  className={`px-3 py-1 rounded font-semibold text-xs transition-colors border ${viewerSettings.viewAngle === 'top' ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-700'}`}
                  onClick={() => setViewerSettings({ ...viewerSettings, viewAngle: 'top', projection: 'orthographic' })}
                >
                  Plan
                </button>
                <button
                  className={`px-3 py-1 rounded font-semibold text-xs transition-colors border ${viewerSettings.viewAngle === 'front' ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-700'}`}
                  onClick={() => setViewerSettings({ ...viewerSettings, viewAngle: 'front', projection: 'orthographic' })}
                >
                  Elevation
                </button>
                <button
                  className={`px-3 py-1 rounded font-semibold text-xs transition-colors border ${viewerSettings.pinned ? 'bg-green-500 text-white border-green-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-green-100 dark:hover:bg-green-700'}`}
                  onClick={() => setViewerSettings({ ...viewerSettings, pinned: !viewerSettings.pinned })}
                  title={viewerSettings.pinned ? 'Unpin View' : 'Pin View'}
                >
                  {viewerSettings.pinned ? '📌 Pinned' : '📍 Pin'}
                </button>
                <button
                  className="px-3 py-1 rounded font-semibold text-xs transition-colors border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-blue-100 dark:hover:bg-blue-700"
                  onClick={() => setViewerSettings({ ...viewerSettings, zoom: Math.min(3, viewerSettings.zoom * 1.2) })}
                  title="Zoom In"
                >
                  ➕
                </button>
                <button
                  className="px-3 py-1 rounded font-semibold text-xs transition-colors border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-blue-100 dark:hover:bg-blue-700"
                  onClick={() => setViewerSettings({ ...viewerSettings, zoom: Math.max(0.3, viewerSettings.zoom / 1.2) })}
                  title="Zoom Out"
                >
                  ➖
                </button>
              </div>
              {/* 3D Viewer */}
              <div className="w-full h-full flex items-center justify-center">
                <Viewer3D
                  foundationData={foundationData}
                  columnData={columnData}
                  reinforcementData={reinforcementData}
                  settings={viewerSettings}
                  unitSystem={unitSystem}
                />
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 sticky bottom-0 max-h-[40vh] overflow-y-auto min-h-0 z-10">
              <BssTablePanel data={results ? results.combined : {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};