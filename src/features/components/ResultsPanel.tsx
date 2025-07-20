import React, { useRef, useState } from 'react';
import { BarChart3, Download, FileText, Table, Printer, Info, Calculator } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { InputCard } from './InputCard';
import BssTablePanel from '../../components/BssTablePanel';
import ColumnSvgDiagram from './ColumnSvgDiagram';
import MaterialBreakdownChart from './MaterialBreakdownChart';

interface ResultsPanelProps {
  results: any | null;
  onExport: (format: 'pdf' | 'excel' | 'json') => void;
  bbsBreakdown?: any;
  rebarCuts?: any;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onExport, bbsBreakdown, rebarCuts }) => {
  const [exportStatus, setExportStatus] = useState<string>('');
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const handleExport = (type: 'pdf' | 'excel' | 'json') => {
    setExportStatus(`Exporting as ${type.toUpperCase()}...`);
    onExport(type);
    setTimeout(() => setExportStatus(''), 2000);
  };

  const handlePrint = () => {
    setExportStatus('Sending to printer...');
    window.print();
    setTimeout(() => setExportStatus(''), 2000);
  };

  if (!results) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 to-blue-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto text-slate-400 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Results Yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Run calculations to see detailed quantity results
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Run Calculations"
          >
            <Calculator size={18} className="mr-2 inline" />Run Calculations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sticky bottom-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2 rounded-t-xl shadow-lg">
      {/* Guided Tour Button */}
      <div className="flex justify-end mb-2">
        <button
          className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Show guided tour"
          onClick={() => alert('Guided tour coming soon!')}
        >
          <Info size={20} />
        </button>
      </div>

      <InputCard title="Column Diagram" icon={<Table size={20} />}>
        <ColumnSvgDiagram
          width={results?.column?.width || 200}
          height={results?.column?.height || 400}
          rebar={results?.column?.rebarPositions || []}
        />
      </InputCard>

      {/* Material Breakdown Chart */}
      <InputCard title="Material Breakdown" icon={<Download size={20} />}>
        <MaterialBreakdownChart
          cement={results?.foundation?.cement || 0}
          sand={results?.foundation?.sand || 0}
          aggregate={results?.foundation?.aggregate || 0}
          water={results?.foundation?.water || 0}
        />
      </InputCard>

      {/* BSS Table Panel for advanced breakdowns */}
      <BssTablePanel
        data={results?.combined}
        bbsBreakdown={bbsBreakdown}
        rebarCuts={rebarCuts}
      />

      {/* Export Options */}
      <InputCard title="Export & Share" icon={<Download size={20} />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Export PDF"
            tabIndex={0}
            data-tooltip-id="pdf-tip"
            data-tooltip-content="Export as PDF"
          >
            <FileText size={20} className="mr-2" />
            Export PDF
          </button>
          <Tooltip id="pdf-tip" />
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Export Excel"
            tabIndex={0}
            data-tooltip-id="excel-tip"
            data-tooltip-content="Export as Excel"
          >
            <Table size={20} className="mr-2" />
            Export Excel
          </button>
          <Tooltip id="excel-tip" />
          <button
            onClick={() => handleExport('json')}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Export JSON"
            tabIndex={0}
            data-tooltip-id="json-tip"
            data-tooltip-content="Export as JSON"
          >
            <Download size={20} className="mr-2" />
            Export JSON
          </button>
          <Tooltip id="json-tip" />
          <button
            onClick={handlePrint}
            className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Print Results"
            tabIndex={0}
            data-tooltip-id="print-tip"
            data-tooltip-content="Print results"
          >
            <Printer size={20} className="mr-2" />
            Print
          </button>
          <Tooltip id="print-tip" />
        </div>
        <div
          ref={liveRegionRef}
          aria-live="polite"
          className="sr-only"
        >
          {exportStatus}
        </div>
      </InputCard>
    </div>
  );
};

export default ResultsPanel;