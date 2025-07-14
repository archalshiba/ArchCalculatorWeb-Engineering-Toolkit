import React from 'react';
import { Grid, Circle, Square } from 'lucide-react';
import { InputCard } from './InputCard';

interface ReinforcementFormProps {
  data: any;
  unitSystem: 'metric' | 'imperial';
  onChange: (data: any) => void;
}

export const ReinforcementForm: React.FC<ReinforcementFormProps> = ({ data, unitSystem, onChange }) => {
  const lengthUnit = unitSystem === 'metric' ? 'mm' : 'in';

  const barDiameters = unitSystem === 'metric' 
    ? [6, 8, 10, 12, 16, 20, 25, 32, 40]
    : [0.25, 0.375, 0.5, 0.625, 0.75, 1, 1.25, 1.5];

  const hookTypes = [
    { value: '90', label: '90° Hook' },
    { value: '135', label: '135° Hook' },
    { value: '180', label: '180° Hook' }
  ];

  const updateColumnReinforcement = (field: string, value: any) => {
    onChange({
      ...data,
      column: {
        ...data.column,
        [field]: typeof data.column[field] === 'object' 
          ? { ...data.column[field], ...value }
          : value
      }
    });
  };

  const updateFootingReinforcement = (field: string, value: any) => {
    onChange({
      ...data,
      footing: {
        ...data.footing,
        [field]: typeof data.footing[field] === 'object' 
          ? { ...data.footing[field], ...value }
          : value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Column Reinforcement */}
      <InputCard title="Column Reinforcement" icon={<Grid size={20} />}>
        <div className="space-y-6">
          {/* Main Bars */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
              <Circle size={16} className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Main Bars
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Count
                </label>
                <input
                  type="number"
                  min="4"
                  value={data.column.mainBars.count}
                  onChange={(e) => updateColumnReinforcement('mainBars', { count: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Diameter ({lengthUnit})
                </label>
                <select
                  value={data.column.mainBars.diameter}
                  onChange={(e) => updateColumnReinforcement('mainBars', { diameter: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {barDiameters.map(dia => (
                    <option key={dia} value={dia}>{dia}{lengthUnit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cover ({lengthUnit})
                </label>
                <input
                  type="number"
                  value={data.column.mainBars.cover}
                  onChange={(e) => updateColumnReinforcement('mainBars', { cover: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Development Length ({lengthUnit})
                </label>
                <input
                  type="number"
                  value={data.column.mainBars.developmentLength}
                  onChange={(e) => updateColumnReinforcement('mainBars', { developmentLength: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stirrups */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
              <Square size={16} className="mr-2 text-purple-600 dark:text-purple-400" />
              Stirrups / Ties
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Shape
                </label>
                <select
                  value={data.column.stirrups.shape}
                  onChange={(e) => updateColumnReinforcement('stirrups', { shape: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="rectangular">Rectangular</option>
                  <option value="circular">Circular</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Diameter ({lengthUnit})
                </label>
                <select
                  value={data.column.stirrups.diameter}
                  onChange={(e) => updateColumnReinforcement('stirrups', { diameter: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {barDiameters.filter(d => d <= 12).map(dia => (
                    <option key={dia} value={dia}>{dia}{lengthUnit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Spacing ({lengthUnit})
                </label>
                <input
                  type="number"
                  value={data.column.stirrups.spacing}
                  onChange={(e) => updateColumnReinforcement('stirrups', { spacing: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hook Type
                </label>
                <select
                  value={data.column.stirrups.hookType}
                  onChange={(e) => updateColumnReinforcement('stirrups', { hookType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {hookTypes.map(hook => (
                    <option key={hook.value} value={hook.value}>{hook.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hook Length ({lengthUnit})
                </label>
                <input
                  type="number"
                  value={data.column.stirrups.hookLength}
                  onChange={(e) => updateColumnReinforcement('stirrups', { hookLength: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Number of Legs
                </label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={data.column.stirrups.numberOfLegs}
                  onChange={(e) => updateColumnReinforcement('stirrups', { numberOfLegs: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </InputCard>

      {/* Footing Reinforcement */}
      <InputCard title="Footing Reinforcement" icon={<Grid size={20} />}>
        <div className="space-y-6">
          {/* Bottom Bars */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
              <Circle size={16} className="mr-2 text-green-600 dark:text-green-400" />
              Bottom Bars
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    X-Direction Count
                  </label>
                  <input
                    type="number"
                    value={data.footing.bottomBarsX.count}
                    onChange={(e) => updateFootingReinforcement('bottomBarsX', { count: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Diameter ({lengthUnit})
                  </label>
                  <select
                    value={data.footing.bottomBarsX.diameter}
                    onChange={(e) => updateFootingReinforcement('bottomBarsX', { diameter: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {barDiameters.map(dia => (
                      <option key={dia} value={dia}>{dia}{lengthUnit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Spacing ({lengthUnit})
                  </label>
                  <input
                    type="number"
                    value={data.footing.bottomBarsX.spacing}
                    onChange={(e) => updateFootingReinforcement('bottomBarsX', { spacing: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Y-Direction Count
                  </label>
                  <input
                    type="number"
                    value={data.footing.bottomBarsY.count}
                    onChange={(e) => updateFootingReinforcement('bottomBarsY', { count: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Diameter ({lengthUnit})
                  </label>
                  <select
                    value={data.footing.bottomBarsY.diameter}
                    onChange={(e) => updateFootingReinforcement('bottomBarsY', { diameter: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {barDiameters.map(dia => (
                      <option key={dia} value={dia}>{dia}{lengthUnit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Spacing ({lengthUnit})
                  </label>
                  <input
                    type="number"
                    value={data.footing.bottomBarsY.spacing}
                    onChange={(e) => updateFootingReinforcement('bottomBarsY', { spacing: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Bars */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                <Circle size={16} className="mr-2 text-orange-600 dark:text-orange-400" />
                Top Bars (Optional)
              </h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.footing.topBars.enabled}
                  onChange={(e) => updateFootingReinforcement('topBars', { enabled: e.target.checked })}
                  className="mr-2 rounded"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">Enable</span>
              </label>
            </div>
            {data.footing.topBars.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Count
                  </label>
                  <input
                    type="number"
                    value={data.footing.topBars.count}
                    onChange={(e) => updateFootingReinforcement('topBars', { count: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Diameter ({lengthUnit})
                  </label>
                  <select
                    value={data.footing.topBars.diameter}
                    onChange={(e) => updateFootingReinforcement('topBars', { diameter: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {barDiameters.map(dia => (
                      <option key={dia} value={dia}>{dia}{lengthUnit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Spacing ({lengthUnit})
                  </label>
                  <input
                    type="number"
                    value={data.footing.topBars.spacing}
                    onChange={(e) => updateFootingReinforcement('topBars', { spacing: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mesh */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                <Grid size={16} className="mr-2 text-teal-600 dark:text-teal-400" />
                Reinforcement Mesh
              </h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.footing.mesh.enabled}
                  onChange={(e) => updateFootingReinforcement('mesh', { enabled: e.target.checked })}
                  className="mr-2 rounded"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">Enable</span>
              </label>
            </div>
            {data.footing.mesh.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Mesh Size ({lengthUnit})
                  </label>
                  <input
                    type="number"
                    value={data.footing.mesh.meshSize}
                    onChange={(e) => updateFootingReinforcement('mesh', { meshSize: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bar Size ({lengthUnit})
                  </label>
                  <select
                    value={data.footing.mesh.barSize}
                    onChange={(e) => updateFootingReinforcement('mesh', { barSize: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {barDiameters.filter(d => d <= 12).map(dia => (
                      <option key={dia} value={dia}>{dia}{lengthUnit}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </InputCard>

      {/* Reinforcement Guidelines */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
          🔧 Reinforcement Guidelines
        </h4>
        <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
          <p>• Minimum column reinforcement: 0.8% of gross area</p>
          <p>• Maximum column reinforcement: 4% of gross area</p>
          <p>• Stirrup spacing: ≤ 16 × main bar diameter</p>
          <p>• Minimum cover: 40mm for columns, 75mm for footings</p>
          <p>• Development length: 40 × bar diameter (minimum)</p>
        </div>
      </div>
    </div>
  );
};