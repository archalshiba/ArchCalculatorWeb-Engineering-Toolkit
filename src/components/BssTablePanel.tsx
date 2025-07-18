import React, { useState } from 'react';
import type { BBSBreakdown, RebarCut } from '../utils/calculations';

type BssTablePanelProps = {
  data: any;
  bbsBreakdown?: BBSBreakdown;
  rebarCuts?: RebarCut[];
};

const BssTablePanel: React.FC<BssTablePanelProps> = ({ data, bbsBreakdown, rebarCuts }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const handleCopy = (value: any) => {
    navigator.clipboard.writeText(String(value));
    alert('Copied to clipboard!');
  };

  // Only show specific keys and allow expand/collapse for details
  const keysToShow = [
    'totalConcreteVolume',
    'totalSteelWeight',
    'totalCost',
    // Add more keys as needed
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 mt-4">
      <h3 className="text-lg font-bold mb-2 text-indigo-700 dark:text-indigo-300">BSS Table</h3>
      {bbsBreakdown && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total Concrete Volume:</div>
            <div className="font-bold">{bbsBreakdown.totalConcreteVolume.toFixed(2)} m³</div>
            <div>Total Concrete Cost:</div>
            <div className="font-bold">₹{bbsBreakdown.totalConcreteCost.toFixed(2)}</div>
            <div>Total Steel Weight:</div>
            <div className="font-bold">{bbsBreakdown.totalSteelWeight.toFixed(2)} kg</div>
            <div>Total Steel Cost:</div>
            <div className="font-bold">₹{bbsBreakdown.totalSteelCost.toFixed(2)}</div>
            <div>Total Cutting Cost:</div>
            <div className="font-bold">₹{bbsBreakdown.totalCuttingCost.toFixed(2)}</div>
            <div>Total Cost:</div>
            <div className="font-bold">₹{bbsBreakdown.totalCost.toFixed(2)}</div>
          </div>
        </div>
      )}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-indigo-50 dark:bg-indigo-900">
            <th className="p-2 border">Parameter</th>
            <th className="p-2 border">Value</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && keysToShow.map((key) => (
            <tr key={key}>
              <td className="p-2 border font-medium">
                <button
                  className="mr-2 text-indigo-500 hover:underline"
                  onClick={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))}
                >
                  {expanded[key] ? '▼' : '▶'}
                </button>
                {key}
              </td>
              <td className="p-2 border">{data[key] !== undefined ? data[key] : '-'}</td>
              <td className="p-2 border">
                <button
                  className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-xs hover:bg-indigo-200 dark:hover:bg-indigo-800"
                  onClick={() => handleCopy(data[key])}
                  disabled={data[key] === undefined}
                >
                  Copy
                </button>
              </td>
            </tr>
          ))}
          {/* Expandable details for each key */}
          {data && keysToShow.map((key) => (
            expanded[key] && data[key] !== undefined ? (
              <tr key={key + '-details'}>
                <td colSpan={3} className="p-2 border bg-indigo-50 dark:bg-indigo-900 text-xs text-gray-700 dark:text-gray-300">
                  {/* Replace with more detailed info if available */}
                  Details for <span className="font-bold">{key}</span>: {data[key]}
                </td>
              </tr>
            ) : null
          ))}
          {/* Rebar cutting details */}
          {rebarCuts && rebarCuts.length > 0 && (
            <tr>
              <td colSpan={3} className="p-2 border bg-yellow-50 dark:bg-yellow-900 text-xs text-gray-700 dark:text-gray-300">
                <div className="font-bold mb-2">Rebar Cutting Details</div>
                <table className="w-full text-xs border">
                  <thead>
                    <tr>
                      <th className="p-1 border">Shape</th>
                      <th className="p-1 border">Length (mm)</th>
                      <th className="p-1 border">Count</th>
                      <th className="p-1 border">Bend Allowance (mm)</th>
                      <th className="p-1 border">Cost/Cut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rebarCuts.map((cut: RebarCut, idx: number) => (
                      <tr key={idx}>
                        <td className="p-1 border">{cut.shape}</td>
                        <td className="p-1 border">{cut.length}</td>
                        <td className="p-1 border">{cut.count}</td>
                        <td className="p-1 border">{cut.bendAllowance ?? '-'}</td>
                        <td className="p-1 border">₹{cut.costPerCut ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BssTablePanel;
