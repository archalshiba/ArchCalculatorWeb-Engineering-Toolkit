import React from 'react';
import { Ruler, Box, Layers } from 'lucide-react';
import { InputCard } from './InputCard';
import { FoundationData, ColumnData } from '../types/calculator';

interface GeometryFormProps {
  foundationData: FoundationData;
  columnData: ColumnData;
  unitSystem: 'metric' | 'imperial';
  onFoundationChange: (data: FoundationData) => void;
  onColumnChange: (data: ColumnData) => void;
  onUnitSystemChange: (system: 'metric' | 'imperial') => void;
}

export const GeometryForm: React.FC<GeometryFormProps> = ({
  foundationData,
  columnData,
  unitSystem,
  onFoundationChange,
  onColumnChange,
  onUnitSystemChange
}) => {
  const lengthUnit = unitSystem === 'metric' ? 'mm' : 'in';

  const foundationTypes = [
    { value: 'isolated', label: 'Isolated Footing' },
    { value: 'strip', label: 'Strip Footing' },
    { value: 'raft', label: 'Raft Foundation' },
    { value: 'combined', label: 'Combined Footing' },
    { value: 'sloped', label: 'Sloped Footing' }
  ];

  const columnShapes = [
    { value: 'rectangular', label: 'Rectangular' },
    { value: 'circular', label: 'Circular' },
    { value: 'tshape', label: 'T-Shaped' },
    { value: 'lshape', label: 'L-Shaped' },
    { value: 'polygon', label: 'Polygon' }
  ];

  const renderColumnDimensions = () => {
    switch (columnData.shape) {
      case 'rectangular':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Width ({lengthUnit})
                </label>
                <input
                  type="number"
                  value={columnData.width}
                  onChange={(e) => onColumnChange({ ...columnData, width: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Depth ({lengthUnit})
                </label>
                <input
                  type="number"
                  value={columnData.depth}
                  onChange={(e) => onColumnChange({ ...columnData, depth: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </>
        );
      case 'circular':
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Diameter ({lengthUnit})
            </label>
            <input
              type="number"
              value={columnData.diameter}
              onChange={(e) => onColumnChange({ ...columnData, diameter: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        );
      case 'tshape':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Flange Width ({lengthUnit})
              </label>
              <input
                type="number"
                value={columnData.flangeWidth}
                onChange={(e) => onColumnChange({ ...columnData, flangeWidth: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Flange Thickness ({lengthUnit})
              </label>
              <input
                type="number"
                value={columnData.flangeThickness}
                onChange={(e) => onColumnChange({ ...columnData, flangeThickness: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Web Width ({lengthUnit})
              </label>
              <input
                type="number"
                value={columnData.webWidth}
                onChange={(e) => onColumnChange({ ...columnData, webWidth: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Web Thickness ({lengthUnit})
              </label>
              <input
                type="number"
                value={columnData.webThickness}
                onChange={(e) => onColumnChange({ ...columnData, webThickness: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      case 'polygon':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Side Length ({lengthUnit})
              </label>
              <input
                type="number"
                value={columnData.sideLength}
                onChange={(e) => onColumnChange({ ...columnData, sideLength: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Number of Sides
              </label>
              <input
                type="number"
                min="3"
                max="12"
                value={columnData.numberOfSides}
                onChange={(e) => onColumnChange({ ...columnData, numberOfSides: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <InputCard title="Global Settings" icon={<Layers size={20} />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Unit System
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => onUnitSystemChange('metric')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  unitSystem === 'metric'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => onUnitSystemChange('imperial')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  unitSystem === 'imperial'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Imperial
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Element Label
            </label>
            <input
              type="text"
              value={foundationData.elementLabel}
              onChange={(e) => onFoundationChange({ ...foundationData, elementLabel: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </InputCard>

      {/* Foundation Geometry */}
      <InputCard title="Foundation Geometry" icon={<Box size={20} />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Foundation ID
            </label>
            <input
              type="text"
              value={foundationData.id}
              readOnly
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Foundation Type
            </label>
            <select
              value={foundationData.type}
              onChange={(e) => onFoundationChange({ ...foundationData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {foundationTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Width ({lengthUnit})
              </label>
              <input
                type="number"
                value={foundationData.width}
                onChange={(e) => onFoundationChange({ ...foundationData, width: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Length ({lengthUnit})
              </label>
              <input
                type="number"
                value={foundationData.length}
                onChange={(e) => onFoundationChange({ ...foundationData, length: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Thickness ({lengthUnit})
              </label>
              <input
                type="number"
                value={foundationData.thickness}
                onChange={(e) => onFoundationChange({ ...foundationData, thickness: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {foundationData.type === 'sloped' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Embedded Depth ({lengthUnit})
                </label>
                <input
                  type="number"
                  value={foundationData.embeddedDepth}
                  onChange={(e) => onFoundationChange({ ...foundationData, embeddedDepth: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </InputCard>

      {/* Column Geometry */}
      <InputCard title="Column Geometry" icon={<Ruler size={20} />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Column Shape
            </label>
            <select
              value={columnData.shape}
              onChange={(e) => onColumnChange({ ...columnData, shape: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {columnShapes.map(shape => (
                <option key={shape.value} value={shape.value}>{shape.label}</option>
              ))}
            </select>
          </div>
          {renderColumnDimensions()}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Height ({lengthUnit})
            </label>
            <input
              type="number"
              value={columnData.height}
              onChange={(e) => onColumnChange({ ...columnData, height: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </InputCard>
    </div>
  );
};