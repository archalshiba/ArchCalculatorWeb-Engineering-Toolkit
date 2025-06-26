import { useState } from "react";

const CONCRETE_STRENGTHS: number[] = [20, 25, 30, 35, 40];

interface Results {
  volume: number;
  cementBags: number;
  sand: number;
  gravel: number;
  water: number;
  proportions: {
    cement: number;
    sand: number;
    gravel: number;
    water: number;
  };
}

export function RectangularColumnCalculator({ onBack }: { onBack: () => void }) {
  const [inputs, setInputs] = useState({
    width: "",
    depth: "",
    height: "",
    strength: 25,
    cover: "",
    ratio: "",
  });
  const [results, setResults] = useState<Results | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Placeholder calculation logic
  const calculate = () => {
    setResults({
      volume: 1.23,
      cementBags: 10,
      sand: 0.45,
      gravel: 0.89,
      water: 120,
      proportions: { cement: 1, sand: 2, gravel: 3, water: 0.5 },
    });
  };

  const reset = () => {
    setInputs({ width: "", depth: "", height: "", strength: 25, cover: "", ratio: "" });
    setResults(null);
    setShowDetails(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          type="button"
          className="mr-2 text-teal-500 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-full"
          aria-label="Back"
          onClick={onBack}
        >
          <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="2" fill="white" className="dark:fill-gray-900" />
            <path d="M22 27l-9-9 9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1">Rectangular Column Calculator</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* SVG Diagram - 3D Enhanced with Dimensions */}
        <div className="flex-1 flex justify-center items-start">
          <svg width="260" height="340" viewBox="0 0 260 340" className="bg-gray-50 rounded-2xl shadow p-2">
            {/* 3D body */}
            <g>
              {/* Main front face */}
              <rect x="90" y="80" width="80" height="160" rx="10" fill="#2dd4bf" stroke="#0f766e" strokeWidth="5" />
              {/* Top face */}
              <polygon points="90,80 130,50 210,50 170,80" fill="#F87171" stroke="#b91c1c" strokeWidth="2.5" />
              {/* Side face */}
              <polygon points="170,80 210,50 210,210 170,240" fill="#0f766e" fillOpacity="0.12" />
              {/* 3D effect lines */}
              <line x1="90" y1="80" x2="170" y2="80" stroke="#0f766e" strokeWidth="2" />
              <line x1="170" y1="80" x2="170" y2="240" stroke="#0f766e" strokeWidth="2" />
              <line x1="90" y1="240" x2="170" y2="240" stroke="#0f766e" strokeWidth="2" />
            </g>
            {/* Stirrups (horizontal) */}
            <g stroke="#F87171" strokeWidth="2.5">
              <line x1="100" y1="100" x2="160" y2="100" />
              <line x1="100" y1="140" x2="160" y2="140" />
              <line x1="100" y1="180" x2="160" y2="180" />
              <line x1="100" y1="220" x2="160" y2="220" />
            </g>
            {/* Longitudinal bars (vertical) */}
            <circle cx="110" cy="95" r="5" fill="#fbbf24" />
            <circle cx="150" cy="95" r="5" fill="#fbbf24" />
            <circle cx="110" cy="225" r="5" fill="#fbbf24" />
            <circle cx="150" cy="225" r="5" fill="#fbbf24" />
            {/* Dimension lines and labels */}
            {/* Height */}
            <g>
              <line x1="220" y1="80" x2="220" y2="240" stroke="#F59E42" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="230" y="170" fill="#F59E42" fontSize="16" textAnchor="start" alignmentBaseline="middle">Height (h)</text>
            </g>
            {/* Width */}
            <g>
              <line x1="90" y1="260" x2="170" y2="260" stroke="#F87171" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="130" y="278" fill="#F87171" fontSize="16" textAnchor="middle">Width (b)</text>
            </g>
            {/* Depth (length) */}
            <g>
              <line x1="170" y1="240" x2="210" y2="210" stroke="#0ea5e9" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="200" y="235" fill="#0ea5e9" fontSize="16" textAnchor="start">Depth (d)</text>
            </g>
            {/* Arrow marker definition */}
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>
        {/* Input Form */}
        <form
          className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
          onSubmit={e => { e.preventDefault(); calculate(); }}
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">Width (mm)</label>
            <input type="number" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.width} onChange={e => setInputs({ ...inputs, width: e.target.value })} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Depth (mm)</label>
            <input type="number" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.depth} onChange={e => setInputs({ ...inputs, depth: e.target.value })} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Height (m)</label>
            <input type="number" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.height} onChange={e => setInputs({ ...inputs, height: e.target.value })} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Concrete Strength (MPa)</label>
            <select className="w-full border rounded-xl p-2" value={inputs.strength} onChange={e => setInputs({ ...inputs, strength: Number(e.target.value) })}>
              {CONCRETE_STRENGTHS.map((s: number) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Cover (mm)</label>
            <input type="number" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.cover} onChange={e => setInputs({ ...inputs, cover: e.target.value })} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Reinforcement Ratio (%)</label>
            <input type="number" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.ratio} onChange={e => setInputs({ ...inputs, ratio: e.target.value })} />
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 mt-2">
            <button type="submit" className="flex-1 bg-[#F87171] text-white font-bold py-2 rounded-xl shadow hover:bg-[#fb6f6f] transition">Calculate</button>
            <button type="button" className="flex-1 border-2 border-[#F87171] text-[#F87171] font-bold py-2 rounded-xl hover:bg-[#fff0f0] transition" onClick={reset}>Reset</button>
          </div>
        </form>
      </div>
      {/* Results Panel */}
      {results && (
        <div className="mt-8 bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto">
          <div className="font-semibold text-lg mb-2 text-gray-800">Results</div>
          <div className="grid grid-cols-2 gap-4">
            <div>Volume:</div>
            <div className="font-mono">{results.volume} m³</div>
            <div>Total Cement Bags:</div>
            <div className="font-mono">{results.cementBags} bags</div>
            <div>Sand:</div>
            <div className="font-mono">{results.sand} m³</div>
            <div>Gravel:</div>
            <div className="font-mono">{results.gravel} m³</div>
            <div>Water:</div>
            <div className="font-mono">{results.water} liters</div>
          </div>
          <button className="mt-4 text-teal-600 underline" onClick={() => setShowDetails(true)}>
            More Details
          </button>
        </div>
      )}
      {/* More Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowDetails(false)}>✕</button>
            <div className="font-bold text-lg mb-4">Mix Proportions</div>
            {/* Pie chart placeholder */}
            <svg width="160" height="160" className="mx-auto mb-4">
              {/* Replace with a real pie chart */}
              <circle cx="80" cy="80" r="70" fill="#E0F2F1" />
              <path d="M80,80 L80,10 A70,70 0 0,1 150,80 Z" fill="#F87171" />
              <path d="M80,80 L150,80 A70,70 0 0,1 80,150 Z" fill="#F59E42" />
              <path d="M80,80 L80,150 A70,70 0 0,1 10,80 Z" fill="#14B8A6" />
              <path d="M80,80 L10,80 A70,70 0 0,1 80,10 Z" fill="#FDBA74" />
            </svg>
            {/* Step-by-step table */}
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="text-left text-gray-600">
                  <th>Step</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">1</td>
                  <td>Calculate required volume of concrete.</td>
                </tr>
                <tr>
                  <td className="py-1">2</td>
                  <td>Determine mix proportions by strength.</td>
                </tr>
                <tr>
                  <td className="py-1">3</td>
                  <td>Estimate cement, sand, gravel, and water quantities.</td>
                </tr>
                <tr>
                  <td className="py-1">4</td>
                  <td>Adjust for reinforcement and cover.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
