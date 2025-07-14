import React from 'react';
import { Beaker, Wrench, Percent } from 'lucide-react';
import { InputCard } from './InputCard';

interface MaterialsFormProps {
  data: any;
  unitSystem: 'metric' | 'imperial';
  onChange: (data: any) => void;
}

export const MaterialsForm: React.FC<MaterialsFormProps> = ({ data, unitSystem, onChange }) => {
  const densityUnit = unitSystem === 'metric' ? 'kg/m³' : 'lb/ft³';
  const slumpUnit = unitSystem === 'metric' ? 'mm' : 'in';

  const concreteGrades = [
    { value: 'M15', label: 'M15 (15 MPa)', fck: 15 },
    { value: 'M20', label: 'M20 (20 MPa)', fck: 20 },
    { value: 'M25', label: 'M25 (25 MPa)', fck: 25 },
    { value: 'M30', label: 'M30 (30 MPa)', fck: 30 },
    { value: 'M35', label: 'M35 (35 MPa)', fck: 35 },
    { value: 'M40', label: 'M40 (40 MPa)', fck: 40 },
    { value: 'M45', label: 'M45 (45 MPa)', fck: 45 },
    { value: 'M50', label: 'M50 (50 MPa)', fck: 50 }
  ];

  const steelGrades = [
    { value: 'Fe415', label: 'Fe415 (415 MPa)', fy: 415 },
    { value: 'Fe500', label: 'Fe500 (500 MPa)', fy: 500 },
    { value: 'Fe550', label: 'Fe550 (550 MPa)', fy: 550 },
    { value: 'Fe600', label: 'Fe600 (600 MPa)', fy: 600 }
  ];

  const admixtureTypes = [
    { value: 'none', label: 'None' },
    { value: 'plasticizer', label: 'Plasticizer' },
    { value: 'superplasticizer', label: 'Superplasticizer' },
    { value: 'retarder', label: 'Retarder' },
    { value: 'accelerator', label: 'Accelerator' },
    { value: 'airentraining', label: 'Air Entraining' }
  ];

  return (
    <div className="space-y-6">
      {/* Concrete Properties */}
      <InputCard title="Concrete Properties" icon={<Beaker size={20} />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Concrete Grade
            </label>
            <select
              value={data.concreteGrade}
              onChange={(e) => onChange({ ...data, concreteGrade: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {concreteGrades.map(grade => (
                <option key={grade.value} value={grade.value}>{grade.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Concrete Density ({densityUnit})
              </label>
              <input
                type="number"
                value={data.concreteDensity}
                onChange={(e) => onChange({ ...data, concreteDensity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Slump ({slumpUnit})
              </label>
              <input
                type="number"
                value={data.slump}
                onChange={(e) => onChange({ ...data, slump: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Admixture Type
              </label>
              <select
                value={data.admixtureType}
                onChange={(e) => onChange({ ...data, admixtureType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {admixtureTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Admixture Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={data.admixturePercent}
                onChange={(e) => onChange({ ...data, admixturePercent: Number(e.target.value) })}
                disabled={data.admixtureType === 'none'}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </InputCard>

      {/* Steel Properties */}
      <InputCard title="Steel Properties" icon={<Wrench size={20} />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Steel Grade
            </label>
            <select
              value={data.steelGrade}
              onChange={(e) => onChange({ ...data, steelGrade: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {steelGrades.map(grade => (
                <option key={grade.value} value={grade.value}>{grade.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Steel Density ({densityUnit})
            </label>
            <input
              type="number"
              value={data.steelDensity}
              onChange={(e) => onChange({ ...data, steelDensity: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </InputCard>

      {/* Waste Factors */}
      <InputCard title="Waste Factors" icon={<Percent size={20} />}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Concrete Waste Factor (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={data.concreteWasteFactor}
                onChange={(e) => onChange({ ...data, concreteWasteFactor: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Typical: 2-5% for good site conditions
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Steel Waste Factor (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="15"
                value={data.steelWasteFactor}
                onChange={(e) => onChange({ ...data, steelWasteFactor: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Typical: 2-5% for cutting and bending losses
              </p>
            </div>
          </div>
        </div>
      </InputCard>

      {/* Material Properties Reference */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📚 Material Properties Reference
        </h4>
        <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <p>• Normal weight concrete: 2300-2500 kg/m³</p>
          <p>• Lightweight concrete: 1400-1900 kg/m³</p>
          <p>• Steel reinforcement: 7850 kg/m³</p>
          <p>• Typical slump for columns: 50-100mm</p>
          <p>• Admixture dosage: 0.2-2% by weight of cement</p>
        </div>
      </div>
    </div>
  );
};