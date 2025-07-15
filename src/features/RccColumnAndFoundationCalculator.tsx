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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Handle view angle changes
  const handleViewAngleChange = (angle: 'top' | 'front' | 'side' | 'isometric') => {
    setViewerSettings(prev => ({
      ...prev,
      viewAngle: angle,
      projection: angle === 'isometric' ? 'perspective' : 'orthographic'
    }));
  };

  // Handle projection toggle
  const handleProjectionToggle = () => {
    setViewerSettings(prev => ({
      ...prev,
      projection: prev.projection === 'perspective' ? 'orthographic' : 'perspective'
    }));
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setViewerSettings(prev => ({
      ...prev,
      zoom: Math.min(3, (prev.zoom || 1) * 1.2)
    }));
  };

  const handleZoomOut = () => {
    setViewerSettings(prev => ({
      ...prev,
      zoom: Math.max(0.3, (prev.zoom || 1) / 1.2)
    }));
  };

  const handleResetView = () => {
    setViewerSettings(prev => ({
      ...prev,
      zoom: 1,
      viewAngle: 'isometric',
      projection: 'perspective'
    }));
  };

  // Handle visibility toggles
  const handleVisibilityToggle = (item: string) => {
    setViewerSettings(prev => ({
      ...prev,
      [item]: !prev[item as keyof typeof prev]
    }));
  };
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
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col`}>
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
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
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
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex h-full">
          {/* Left Pane - Inputs (sticky, scrollable) */}
          <div className="flex flex-col h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50" style={{ minWidth: 420, maxWidth: 420 }}>
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 gap-0 mb-0 border-b border-white/20 dark:border-slate-700/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-slate-700/50 border-b-2 border-transparent hover:border-indigo-300'
                  }`}
                >
                  <span className="mr-2 text-base">{tab.icon}</span>
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              {renderTabContent()}
            </div>
            
            {/* Sticky Bottom Bar */}
            <div className="sticky bottom-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 p-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCalculations}
                  disabled={isCalculating}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Calculator size={20} className="mr-2" />
                  {isCalculating ? 'Calculating...' : 'Run Calculations'}
                </button>
                <div className="relative group">
                  <button className="p-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors shadow-lg">
                    <Download size={20} />
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Export Options
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Pane - 3D Preview & BSS Table split vertically */}
          <div className="flex flex-col flex-1 h-full">
            {/* 3D Viewer Section */}
            <div className="flex-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl flex flex-col overflow-hidden relative">
              {/* Enhanced Professional Toolbar */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-xl p-3 border border-white/30 dark:border-slate-700/50">
                {/* View Angle Controls */}
                <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-700 pr-3">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-2">View:</span>
                  <button
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
                      viewerSettings.viewAngle === 'isometric' 
                        ? 'bg-indigo-500 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                    }`}
                    onClick={() => handleViewAngleChange('isometric')}
                  >
                    🎯 3D
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
                      viewerSettings.viewAngle === 'top' 
                        ? 'bg-indigo-500 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                    }`}
                    onClick={() => handleViewAngleChange('top')}
                  >
                    📐 Plan
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
                      viewerSettings.viewAngle === 'front' 
                        ? 'bg-indigo-500 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                    }`}
                    onClick={() => handleViewAngleChange('front')}
                  >
                    🏗️ Elevation
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
                      viewerSettings.viewAngle === 'side' 
                        ? 'bg-indigo-500 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                    }`}
                    onClick={() => handleViewAngleChange('side')}
                  >
                    📏 Side
                  </button>
                </div>
                
                {/* Projection Toggle */}
                <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-700 pr-3">
                  <button
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
                      viewerSettings.projection === 'perspective' 
                        ? 'bg-green-500 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                    onClick={handleProjectionToggle}
                    title="Toggle Projection"
                  >
                    {viewerSettings.projection === 'perspective' ? '🔍 Perspective' : '📊 Orthographic'}
                  </button>
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-700 pr-3">
                  <button
                    className="px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    onClick={handleZoomIn}
                    title="Zoom In"
                  >
                    🔍+
                  </button>
                  <button
                    className="px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                  >
                    🔍-
                  </button>
                  <button
                    className="px-2 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                    onClick={handleResetView}
                    title="Reset View"
                  >
                    🔄 Reset
                  </button>
                </div>
                
                {/* Pin Toggle */}
                <button
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 ${
                    viewerSettings.pinned 
                      ? 'bg-yellow-500 text-white shadow-md' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                  }`}
                  onClick={() => setViewerSettings(prev => ({ ...prev, pinned: !prev.pinned }))}
                  title={viewerSettings.pinned ? 'Unpin View' : 'Pin View'}
                >
                  {viewerSettings.pinned ? '📌 Pinned' : '📍 Pin'}
                </button>
              </div>
              
              {/* Visibility Controls */}
              <div className="absolute top-4 right-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-xl p-3 border border-white/30 dark:border-slate-700/50">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Visibility:</div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={viewerSettings.showConcrete}
                      onChange={() => handleVisibilityToggle('showConcrete')}
                      className="mr-1 rounded text-indigo-600"
                    />
                    🏗️ Concrete
                  </label>
                  <label className="flex items-center text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={viewerSettings.showMainBars}
                      onChange={() => handleVisibilityToggle('showMainBars')}
                      className="mr-1 rounded text-indigo-600"
                    />
                    🔩 Main Bars
                  </label>
                  <label className="flex items-center text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={viewerSettings.showStirrupsAndTies}
                      onChange={() => handleVisibilityToggle('showStirrupsAndTies')}
                      className="mr-1 rounded text-indigo-600"
                    />
                    ⚡ Stirrups
                  </label>
                  <label className="flex items-center text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={viewerSettings.showMesh}
                      onChange={() => handleVisibilityToggle('showMesh')}
                      className="mr-1 rounded text-indigo-600"
                    />
                    🕸️ Mesh
                  </label>
                </div>
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
            
            {/* BSS Table Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 max-h-[40vh] overflow-y-auto min-h-0">
              <BssTablePanel data={results ? results.combined : {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};