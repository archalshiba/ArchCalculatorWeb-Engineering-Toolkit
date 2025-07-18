import React from 'react';
import { BarChart3, Download, FileText, Table } from 'lucide-react';
import { InputCard } from './InputCard';
import BssTablePanel from '../../components/BssTablePanel';

interface ResultsPanelProps {
  results: any | null;
  unitSystem: 'metric' | 'imperial';
  onExport: (format: 'pdf' | 'excel' | 'json') => void;
  bbsBreakdown?: any;
  rebarCuts?: any;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, unitSystem, onExport, bbsBreakdown, rebarCuts }) => {
  const volumeUnit = unitSystem === 'metric' ? 'm³' : 'ft³';
  const weightUnit = unitSystem === 'metric' ? 'kg' : 'lb';
  const currencyUnit = '$'; // Could be made configurable

  if (!results) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 to-blue-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto text-slate-400 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Results Yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Run calculations to see detailed quantity results
          </p>
        </div>
      </div>
    );
  }

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* You can add summary cards here if needed */}
      </div>

      {/* Detailed Results */}
      <InputCard title="Column Quantities" icon={<Table size={20} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 text-slate-600 dark:text-slate-400">Item</th>
                <th className="text-right py-2 text-slate-600 dark:text-slate-400">Quantity</th>
                <th className="text-right py-2 text-slate-600 dark:text-slate-400">Unit</th>
                <th className="text-right py-2 text-slate-600 dark:text-slate-400">Cost</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-medium text-slate-900 dark:text-slate-100">Concrete Volume</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {formatNumber(results.column.concreteVolume)}
                </td>
                <td className="text-right py-2 text-slate-600 dark:text-slate-400">{volumeUnit}</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {currencyUnit}{formatNumber(results.column.concreteCost)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-medium text-slate-900 dark:text-slate-100">Main Bars Weight</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {formatNumber(results.column.mainBarsWeight)}
                </td>
                <td className="text-right py-2 text-slate-600 dark:text-slate-400">{weightUnit}</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {currencyUnit}{formatNumber(results.column.mainBarsCost)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-medium text-slate-900 dark:text-slate-100">Stirrups Weight</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {formatNumber(results.column.stirrupsWeight)}
                </td>
                <td className="text-right py-2 text-slate-600 dark:text-slate-400">{weightUnit}</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {currencyUnit}{formatNumber(results.column.stirrupsCost)}
                </td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <td className="py-2 font-bold text-slate-900 dark:text-slate-100">Column Total</td>
                <td className="text-right py-2 font-bold text-slate-900 dark:text-slate-100">-</td>
                <td className="text-right py-2 text-slate-600 dark:text-slate-400">-</td>
                <td className="text-right py-2 font-bold text-slate-900 dark:text-slate-100">
                  {currencyUnit}{formatNumber(results.column.totalCost)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </InputCard>

      <InputCard title="Foundation Quantities" icon={<Table size={20} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 text-slate-600 dark:text-slate-400">Item</th>
                <th className="text-right py-2 text-slate-600 dark:text-slate-400">Quantity</th>
                <th className="text-right py-2 text-slate-600 dark:text-slate-400">Unit</th>
                <th className="text-right py-2 text-slate-600 dark:text-slate-400">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-medium text-slate-900 dark:text-slate-100">Concrete Volume</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {formatNumber(results.foundation.concreteVolume)}
                </td>
                <td className="text-right py-2 text-slate-600 dark:text-slate-400">{volumeUnit}</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {currencyUnit}{formatNumber(results.foundation.concreteCost)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-medium text-slate-900 dark:text-slate-100">Bottom Bars Weight</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {formatNumber(results.foundation.bottomBarsWeight)}
                </td>
                <td className="text-right py-2 text-slate-600 dark:text-slate-400">{weightUnit}</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {currencyUnit}{formatNumber(results.foundation.bottomBarsCost)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-medium text-slate-900 dark:text-slate-100">Top Bars Weight</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {formatNumber(results.foundation.topBarsWeight)}
                </td>
                <td className="text-right py-2 text-slate-600 dark:text-slate-400">{weightUnit}</td>
                <td className="text-right py-2 text-slate-700 dark:text-slate-300">
                  {currencyUnit}{formatNumber(results.foundation.topBarsCost)}
                </td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <td className="py-2 font-bold text-slate-900 dark:text-slate-100">Foundation Total</td>
                <td className="text-right py-2 font-bold text-slate-900 dark:text-slate-100">-</td>
                <td className="text-right py-2 text-slate-600 dark:text-slate-400">-</td>
                <td className="text-right py-2 font-bold text-slate-900 dark:text-slate-100">
                  {currencyUnit}{formatNumber(results.foundation.totalCost)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </InputCard>

      {/* BSS Table Panel for advanced breakdowns */}
      <BssTablePanel
        data={results?.combined}
        bbsBreakdown={bbsBreakdown}
        rebarCuts={rebarCuts}
      />

      {/* Export Options */}
      <InputCard title="Export Options" icon={<Download size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onExport('pdf')}
            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText size={20} className="mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => onExport('excel')}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Table size={20} className="mr-2" />
            Export Excel
          </button>
          <button
            onClick={() => onExport('json')}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} className="mr-2" />
            Export JSON
          </button>
        </div>
      </InputCard>
    </div>
  );
};

export default ResultsPanel;