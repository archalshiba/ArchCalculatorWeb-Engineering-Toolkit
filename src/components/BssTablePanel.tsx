import React, { useState } from 'react';

interface BssTablePanelProps {
  data: any;
}

const BssTablePanel: React.FC<BssTablePanelProps> = ({ data }) => {
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
        </tbody>
      </table>
    </div>
  );
};

export default BssTablePanel;
