import React, { useState } from "react";

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

export function RectangularColumnCalculator() {
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
        <button className="mr-2 text-teal-500 hover:text-teal-700">
          {/* Back arrow icon */}
          <svg width="28" height="28" fill="none"><path d="M18 24l-8-8 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1">Rectangular Column Calculator</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* SVG Diagram */}
        <div className="flex-1 flex justify-center items-start">
          {/* Placeholder SVG for column with dimension lines */}
          <svg width="180" height="260" viewBox="0 0 180 260" className="bg-gray-50 rounded-2xl shadow p-2">
            {/* Column outline */}
            <rect x="40" y="40" width="100" height="180" rx="12" fill="#E0F2F1" stroke="#14B8A6" strokeWidth="4"/>
            {/* Width dimension */}
            <line x1="40" y1="230" x2="140" y2="230" stroke="#F87171" strokeWidth="2"/>
            <text x="90" y="250" textAnchor="middle" fill="#F87171" fontSize="14">Width (mm)</text>
            {/* Depth dimension */}
            <line x1="30" y1="40" x2="30" y2="220" stroke="#F87171" strokeWidth="2"/>
            <text x="10" y="140" textAnchor="middle" fill="#F87171" fontSize="14" transform="rotate(-90 10,140)">Depth (mm)</text>
            {/* Height dimension */}
            <line x1="140" y1="40" x2="140" y2="220" stroke="#F59E42" strokeWidth="2"/>
            <text x="160" y="140" textAnchor="middle" fill="#F59E42" fontSize="14" transform="rotate(-90 160,140)">Height (m)</text>
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
