import React, { useState, useEffect, useRef } from "react";

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
  dryVolume: number;
  admixture: number;
  cost: number | null;
}

const STANDARD_MIXES = [
  { code: "1:1.5:3", label: "M20 (1:1.5:3)", cement: 1, sand: 1.5, aggregate: 3 },
  { code: "1:2:4", label: "M15 (1:2:4)", cement: 1, sand: 2, aggregate: 4 },
  { code: "1:3:6", label: "M10 (1:3:6)", cement: 1, sand: 3, aggregate: 6 },
  { code: "custom", label: "Custom Mix", cement: 1, sand: 2, aggregate: 4 },
];

const MIX_RECOMMENDATIONS: Record<string, { wc: [number, number], admixture: [number, number], wcDefault: number, admixtureDefault: number }> = {
  "1:1.5:3": { wc: [0.45, 0.55], admixture: [0, 1], wcDefault: 0.5, admixtureDefault: 0 }, // M20
  "1:2:4": { wc: [0.5, 0.6], admixture: [0, 1], wcDefault: 0.55, admixtureDefault: 0 }, // M15
  "1:3:6": { wc: [0.55, 0.65], admixture: [0, 1], wcDefault: 0.6, admixtureDefault: 0 }, // M10
  "custom": { wc: [0.4, 0.7], admixture: [0, 2], wcDefault: 0.5, admixtureDefault: 0 },
};

// --- Helper for tracking changed fields ---
function getChangedFields(inputs: any, prevInputs: any) {
  const changed: Record<string, boolean> = {};
  for (const key in inputs) {
    if (inputs[key] !== prevInputs[key]) changed[key] = true;
  }
  return changed;
}

export function RectangularColumnCalculator({ onBack }: { onBack: () => void }) {
  const [inputs, setInputs] = useState({
    width: "",
    depth: "",
    height: "",
    numColumns: "1",
    mix: "1:2:4",
    customCement: "1",
    customSand: "2",
    customAggregate: "4",
    wcRatio: "0.5",
    admixture: "0",
    dryVolumeFactor: "1.54",
    wastage: "5",
    rate: "",
  });
  const [results, setResults] = useState<Results | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [prevInputs, setPrevInputs] = useState(inputs);
  const [changedFields, setChangedFields] = useState<Record<string, boolean>>({});
  const [showReference, setShowReference] = useState(false);

  useEffect(() => {
    setChangedFields(getChangedFields(inputs, prevInputs));
    setPrevInputs(inputs);
  }, [inputs]);

  function calculate() {
    // Parse inputs
    const width = Number(inputs.width) / 100; // cm to m
    const depth = Number(inputs.depth) / 100; // cm to m
    const height = Number(inputs.height); // m
    const numColumns = Number(inputs.numColumns);
    const dryVolumeFactor = Number(inputs.dryVolumeFactor);
    const wastage = Number(inputs.wastage) / 100;
    const wcRatio = Number(inputs.wcRatio);
    const admixturePct = Number(inputs.admixture) / 100;
    const rate = Number(inputs.rate) || 0;

    // Mix ratios
    let cement = 1, sand = 2, aggregate = 4;
    if (inputs.mix === "custom") {
      cement = Number(inputs.customCement);
      sand = Number(inputs.customSand);
      aggregate = Number(inputs.customAggregate);
    } else {
      const mix = STANDARD_MIXES.find(m => m.code === inputs.mix);
      if (mix) {
        cement = mix.cement;
        sand = mix.sand;
        aggregate = mix.aggregate;
      }
    }
    const totalParts = cement + sand + aggregate;

    // Volumes
    const volPerCol = width * depth * height;
    const wetVolume = volPerCol * numColumns;
    const dryVolume = wetVolume * dryVolumeFactor * (1 + wastage);

    // Material calculations
    const cementVolume = (cement / totalParts) * dryVolume;
    const sandVolume = (sand / totalParts) * dryVolume;
    const aggVolume = (aggregate / totalParts) * dryVolume;
    // Assume 1 bag cement = 0.035 m³, 50kg
    const cementWeight = cementVolume * 1440; // kg (density)
    const cementBags = cementWeight / 50;
    const water = wcRatio * cementWeight;
    const admixture = admixturePct * cementWeight;
    const cost = rate ? dryVolume * rate : null;

    setResults({
      volume: wetVolume,
      cementBags,
      sand: sandVolume,
      gravel: aggVolume,
      water,
      proportions: { cement, sand, gravel: aggregate, water: wcRatio },
      // ...add more as needed
      admixture,
      dryVolume,
      cost,
    } as any);
  }

  // --- Input validation and auto-correction logic ---
  function validate() {
    const newErrors: { [key: string]: string } = {};
    // Auto-correct units if width/depth > 100 (assume mm, convert to cm)
    let width = Number(inputs.width);
    let depth = Number(inputs.depth);
    let height = Number(inputs.height);
    let numColumns = Number(inputs.numColumns);
    let customCement = Number(inputs.customCement);
    let customSand = Number(inputs.customSand);
    let customAggregate = Number(inputs.customAggregate);
    let wcRatio = Number(inputs.wcRatio);
    let admixture = Number(inputs.admixture);
    let dryVolumeFactor = Number(inputs.dryVolumeFactor);
    let wastage = Number(inputs.wastage);
    let rate = Number(inputs.rate);

    // Auto-correct mm to cm for width/depth
    let autoCorrected = false;
    if (width > 1000) { width = width / 10; autoCorrected = true; }
    else if (width > 100) { width = width / 10; autoCorrected = true; }
    if (depth > 1000) { depth = depth / 10; autoCorrected = true; }
    else if (depth > 100) { depth = depth / 10; autoCorrected = true; }
    if (autoCorrected) {
      setInputs({ ...inputs, width: width.toString(), depth: depth.toString() });
      newErrors.unit = "Width/Depth values were auto-corrected from mm to cm.";
    }

    if (!width || width <= 0) newErrors.width = "Width is required and must be positive.";
    if (!depth || depth <= 0) newErrors.depth = "Depth is required and must be positive.";
    if (!height || height <= 0) newErrors.height = "Height is required and must be positive.";
    if (!numColumns || numColumns < 1) newErrors.numColumns = "Number of columns must be at least 1.";
    if (inputs.mix === "custom") {
      if (!customCement || customCement <= 0) newErrors.customCement = "Cement ratio must be positive.";
      if (!customSand || customSand < 0) newErrors.customSand = "Sand ratio must be zero or positive.";
      if (!customAggregate || customAggregate < 0) newErrors.customAggregate = "Aggregate ratio must be zero or positive.";
      if (customCement + customSand + customAggregate < 2) newErrors.mix = "Custom mix ratios are unrealistic (sum too low).";
    }
    if (!wcRatio || wcRatio < 0.3 || wcRatio > 0.7) newErrors.wcRatio = "W/C ratio should be between 0.3 and 0.7.";
    if (admixture < 0 || admixture > 10) newErrors.admixture = "Admixture % should be 0-10.";
    if (!dryVolumeFactor || dryVolumeFactor < 1 || dryVolumeFactor > 2) newErrors.dryVolumeFactor = "Dry volume factor should be 1-2.";
    if (wastage < 0 || wastage > 20) newErrors.wastage = "Wastage % should be 0-20.";
    if (inputs.rate && rate < 0) newErrors.rate = "Rate cannot be negative.";
    // Warnings for unrealistic values
    if (width < 10 || width > 100) newErrors.width = (newErrors.width ? newErrors.width + " " : "") + "Width is outside typical range (10-100 cm).";
    if (depth < 10 || depth > 100) newErrors.depth = (newErrors.depth ? newErrors.depth + " " : "") + "Depth is outside typical range (10-100 cm).";
    if (height < 2 || height > 10) newErrors.height = (newErrors.height ? newErrors.height + " " : "") + "Height is outside typical range (2-10 m).";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    calculate();
  }

  function reset() {
    setInputs({ width: "", depth: "", height: "", numColumns: "1", mix: "1:2:4", customCement: "1", customSand: "2", customAggregate: "4", wcRatio: "0.5", admixture: "0", dryVolumeFactor: "1.54", wastage: "5", rate: "" });
    setResults(null);
    setErrors({});
  }

  function handleMixChange(mixCode: string) {
    const rec = MIX_RECOMMENDATIONS[mixCode] || MIX_RECOMMENDATIONS["custom"];
    setInputs(inputs => ({
      ...inputs,
      mix: mixCode,
      wcRatio: rec.wcDefault.toString(),
      admixture: rec.admixtureDefault.toString(),
      ...(mixCode !== "custom" ? {} : { customCement: "1", customSand: "2", customAggregate: "4" })
    }));
  }

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
        <button
          className="mb-4 self-end px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition w-fit"
          type="button"
          onClick={() => setShowReference(true)}
        >
          Reference Table / Docs
        </button>
        <ReferenceTableModal open={showReference} onClose={() => setShowReference(false)} />
        {/* SVG 3D diagram with dimensions (already implemented) */}
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
        {/* Input Card */}
        <form
          className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow p-6 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-2 text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/30 rounded p-2">
            <strong>Tip:</strong> Enter all dimensions in centimeters (cm). For example, a typical column might be 30 cm wide, 50 cm deep, and 300 cm high.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Width (W, cm)</label>
              <input type="number" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.width} onChange={e => setInputs({ ...inputs, width: e.target.value })} required />
              <div className="text-xs text-gray-400 mt-1">Width of the column cross-section (e.g., 30 for 30 cm)</div>
              {errors.width && <div className="text-red-500 text-xs mt-1">{errors.width}</div>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Depth (D, cm)</label>
              <input type="number" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.depth} onChange={e => setInputs({ ...inputs, depth: e.target.value })} required />
              <div className="text-xs text-gray-400 mt-1">Depth of the column cross-section (e.g., 50 for 50 cm)</div>
              {errors.depth && <div className="text-red-500 text-xs mt-1">{errors.depth}</div>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Height (H, m)</label>
              <input type="number" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.height} onChange={e => setInputs({ ...inputs, height: e.target.value })} required />
              <div className="text-xs text-gray-400 mt-1">Height of the column (e.g., 3 for 3 meters)</div>
              {errors.height && <div className="text-red-500 text-xs mt-1">{errors.height}</div>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Number of Columns</label>
              <input type="number" min="1" className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-teal-300" value={inputs.numColumns} onChange={e => setInputs({ ...inputs, numColumns: e.target.value })} required />
              <div className="text-xs text-gray-400 mt-1">How many identical columns?</div>
              {errors.numColumns && <div className="text-red-500 text-xs mt-1">{errors.numColumns}</div>}
            </div>
          </div>
          {/* Mix Proportions */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mix Proportions</label>
            <select
              className="w-full border rounded-xl p-2 mb-2"
              value={inputs.mix}
              onChange={e => handleMixChange(e.target.value)}
            >
              {STANDARD_MIXES.map(mix => (
                <option key={mix.code} value={mix.code}>{mix.label}</option>
              ))}
            </select>
            {inputs.mix === "custom" && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <label className="block text-xs text-gray-500">Cement</label>
                  <input type="number" min="1" className="w-full border rounded-xl p-2" value={inputs.customCement} onChange={e => setInputs({ ...inputs, customCement: e.target.value })} />
                  {errors.customCement && <div className="text-red-500 text-xs mt-1">{errors.customCement}</div>}
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Sand</label>
                  <input type="number" min="0" className="w-full border rounded-xl p-2" value={inputs.customSand} onChange={e => setInputs({ ...inputs, customSand: e.target.value })} />
                  {errors.customSand && <div className="text-red-500 text-xs mt-1">{errors.customSand}</div>}
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Aggregate</label>
                  <input type="number" min="0" className="w-full border rounded-xl p-2" value={inputs.customAggregate} onChange={e => setInputs({ ...inputs, customAggregate: e.target.value })} />
                  {errors.customAggregate && <div className="text-red-500 text-xs mt-1">{errors.customAggregate}</div>}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <label className="block text-xs text-gray-500">Water/Cement Ratio (W/C)
                  <span className="ml-1 cursor-help" title={`Typical for this mix: ${MIX_RECOMMENDATIONS[inputs.mix]?.wc[0]}–${MIX_RECOMMENDATIONS[inputs.mix]?.wc[1]}`}>ⓘ</span>
                </label>
                <input type="number" step="0.01" min="0.3" max="0.7" className="w-full border rounded-xl p-2" value={inputs.wcRatio} onChange={e => setInputs({ ...inputs, wcRatio: e.target.value })} />
                <div className="text-xs text-gray-400 mt-1">Recommended: {MIX_RECOMMENDATIONS[inputs.mix]?.wc[0]}–{MIX_RECOMMENDATIONS[inputs.mix]?.wc[1]}</div>
                {Number(inputs.wcRatio) < MIX_RECOMMENDATIONS[inputs.mix]?.wc[0] || Number(inputs.wcRatio) > MIX_RECOMMENDATIONS[inputs.mix]?.wc[1] ? (
                  <div className="text-yellow-600 text-xs mt-1">W/C ratio is outside the typical range for this mix. High W/C reduces strength.</div>
                ) : null}
                {errors.wcRatio && <div className="text-red-500 text-xs mt-1">{errors.wcRatio}</div>}
              </div>
              <div className="relative">
                <label className="block text-xs text-gray-500">Admixture %
                  <span className="ml-1 cursor-help" title={`Typical for this mix: ${MIX_RECOMMENDATIONS[inputs.mix]?.admixture[0]}–${MIX_RECOMMENDATIONS[inputs.mix]?.admixture[1]}`}>ⓘ</span>
                </label>
                <input type="number" step="0.1" min="0" max="10" className="w-full border rounded-xl p-2" value={inputs.admixture} onChange={e => setInputs({ ...inputs, admixture: e.target.value })} />
                <div className="text-xs text-gray-400 mt-1">Recommended: {MIX_RECOMMENDATIONS[inputs.mix]?.admixture[0]}–{MIX_RECOMMENDATIONS[inputs.mix]?.admixture[1]}</div>
                {Number(inputs.admixture) < MIX_RECOMMENDATIONS[inputs.mix]?.admixture[0] || Number(inputs.admixture) > MIX_RECOMMENDATIONS[inputs.mix]?.admixture[1] ? (
                  <div className="text-yellow-600 text-xs mt-1">Admixture % is outside the typical range for this mix.</div>
                ) : null}
                {errors.admixture && <div className="text-red-500 text-xs mt-1">{errors.admixture}</div>}
              </div>
            </div>
          </div>
          {/* Other Parameters */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500">Dry Volume Factor</label>
              <input type="number" step="0.01" min="1" max="2" className="w-full border rounded-xl p-2" value={inputs.dryVolumeFactor} onChange={e => setInputs({ ...inputs, dryVolumeFactor: e.target.value })} />
              {errors.dryVolumeFactor && <div className="text-red-500 text-xs mt-1">{errors.dryVolumeFactor}</div>}
            </div>
            <div>
              <label className="block text-xs text-gray-500">Wastage %</label>
              <input type="number" step="0.1" min="0" max="20" className="w-full border rounded-xl p-2" value={inputs.wastage} onChange={e => setInputs({ ...inputs, wastage: e.target.value })} />
              {errors.wastage && <div className="text-red-500 text-xs mt-1">{errors.wastage}</div>}
            </div>
            <div>
              <label className="block text-xs text-gray-500">Concrete Rate (per m³)</label>
              <input type="number" min="0" className="w-full border rounded-xl p-2" value={inputs.rate} onChange={e => setInputs({ ...inputs, rate: e.target.value })} />
              {errors.rate && <div className="text-red-500 text-xs mt-1">{errors.rate}</div>}
            </div>
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
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-lg text-gray-800 dark:text-gray-100">Results</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
                onClick={() => window.print()}
                title="Print results"
                type="button"
              >
                Print
              </button>
              <button
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => {
                  const el = document.createElement('a');
                  const text = `Rectangular Column Calculator Results\n\n` +
                    `Width: ${inputs.width} cm\nDepth: ${inputs.depth} cm\nHeight: ${inputs.height} m\nNumber of Columns: ${inputs.numColumns}\nMix: ${inputs.mix === 'custom' ? `${inputs.customCement}:${inputs.customSand}:${inputs.customAggregate}` : inputs.mix}\nW/C Ratio: ${inputs.wcRatio}\nAdmixture: ${inputs.admixture} %\nDry Volume Factor: ${inputs.dryVolumeFactor}\nWastage: ${inputs.wastage} %\n` +
                    (inputs.rate ? `Concrete Rate: ${inputs.rate}\n` : '') +
                    `\nResults:\nWet Volume: ${results.volume.toFixed(3)} m³\nDry Volume: ${results.dryVolume?.toFixed(3)} m³\nCement: ${results.cementBags.toFixed(2)} bags (${(results.cementBags * 50).toFixed(0)} kg)\nSand: ${results.sand.toFixed(3)} m³\nAggregate: ${results.gravel.toFixed(3)} m³\nWater: ${results.water.toFixed(1)} kg\nAdmixture: ${results.admixture?.toFixed(2)} kg\n` +
                    (results.cost !== null ? `Estimated Cost: ${results.cost?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}\n` : '');
                  const blob = new Blob([text], { type: 'text/plain' });
                  el.href = URL.createObjectURL(blob);
                  el.download = 'rectangular-column-results.txt';
                  el.click();
                }}
                title="Save results as text file"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={changedFields.width || changedFields.depth || changedFields.height || changedFields.numColumns ? "font-bold text-teal-700" : undefined}>Wet Volume:
              <span className="ml-1 text-xs text-gray-400 cursor-help" title="Formula: width × depth × height × number of columns = {((Number(inputs.width)/100)*(Number(inputs.depth)/100)*Number(inputs.height)*Number(inputs.numColumns)).toFixed(3)} m³">[?]</span>
            </div>
            <div className={changedFields.width || changedFields.depth || changedFields.height || changedFields.numColumns ? "font-mono font-bold text-teal-700" : "font-mono"}>{results.volume.toFixed(3)} m³</div>
            <div className={changedFields.dryVolumeFactor || changedFields.wastage ? "font-bold text-teal-700" : undefined}>Dry Volume:
              <span className="ml-1 text-xs text-gray-400 cursor-help" title="Formula: Wet Volume × Dry Volume Factor × (1 + Wastage %)">[?]</span>
            </div>
            <div className={changedFields.dryVolumeFactor || changedFields.wastage ? "font-mono font-bold text-teal-700" : "font-mono"}>{results.dryVolume?.toFixed(3)} m³</div>
            <div className={changedFields.mix || changedFields.customCement || changedFields.customSand || changedFields.customAggregate ? "font-bold text-teal-700" : undefined}>Cement:
              <span className="ml-1 text-xs text-gray-400 cursor-help" title="Formula: (Cement parts / Total parts) × Dry Volume / 0.035 (bag volume)">[?]</span>
            </div>
            <div className={changedFields.mix || changedFields.customCement || changedFields.customSand || changedFields.customAggregate ? "font-mono font-bold text-teal-700" : "font-mono"}>{results.cementBags.toFixed(2)} bags ({(results.cementBags * 50).toFixed(0)} kg)</div>
            <div className={changedFields.mix || changedFields.customCement || changedFields.customSand || changedFields.customAggregate ? "font-bold text-teal-700" : undefined}>Sand:
              <span className="ml-1 text-xs text-gray-400 cursor-help" title="Formula: (Sand parts / Total parts) × Dry Volume">[?]</span>
            </div>
            <div className={changedFields.mix || changedFields.customCement || changedFields.customSand || changedFields.customAggregate ? "font-mono font-bold text-teal-700" : "font-mono"}>{results.sand.toFixed(3)} m³</div>
            <div className={changedFields.mix || changedFields.customCement || changedFields.customSand || changedFields.customAggregate ? "font-bold text-teal-700" : undefined}>Aggregate:
              <span className="ml-1 text-xs text-gray-400 cursor-help" title="Formula: (Aggregate parts / Total parts) × Dry Volume">[?]</span>
            </div>
            <div className={changedFields.mix || changedFields.customCement || changedFields.customSand || changedFields.customAggregate ? "font-mono font-bold text-teal-700" : "font-mono"}>{results.gravel.toFixed(3)} m³</div>
            <div className={changedFields.wcRatio ? "font-bold text-teal-700" : undefined}>Water:
              <span className="ml-1 text-xs text-gray-400 cursor-help" title="Formula: W/C × Cement Weight">[?]</span>
            </div>
            <div className={changedFields.wcRatio ? "font-mono font-bold text-teal-700" : "font-mono"}>{results.water.toFixed(1)} kg</div>
            <div className={changedFields.admixture ? "font-bold text-teal-700" : undefined}>Admixture:
              <span className="ml-1 text-xs text-gray-400 cursor-help" title="Formula: (Admixture % / 100) × Cement Weight">[?]</span>
            </div>
            <div className={changedFields.admixture ? "font-mono font-bold text-teal-700" : "font-mono"}>{results.admixture?.toFixed(2)} kg</div>
            {results.cost !== null && (
              <><div className={changedFields.rate ? "font-bold text-teal-700" : undefined}>Estimated Cost:
                <span className="ml-1 text-xs text-gray-400 cursor-help" title="Formula: Dry Volume × Rate">[?]</span>
              </div><div className={changedFields.rate ? "font-mono font-bold text-teal-700" : "font-mono"}>{results.cost?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</div></>
            )}
          </div>
          <div className="mt-4">
            <div className="text-gray-500 text-sm">Total Volume (all columns):</div>
            <div className="font-mono font-bold text-lg">{results.volume.toFixed(3)} m³</div>
          </div>
          <button className="mt-4 text-teal-600 underline" onClick={() => setShowBreakdown(b => !b)}>
            {showBreakdown ? "Hide Breakdown" : "View Calculation Breakdown"}
          </button>
          {showBreakdown && (
            <div className="mt-6 border-t pt-4 text-sm text-gray-700 dark:text-gray-200">
              <div className="font-bold mb-2 text-lg text-teal-700 dark:text-teal-300 flex items-center gap-2">
                <svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="9" stroke="#0f766e" strokeWidth="2" /><path d="M10 5v5l3 3" stroke="#0f766e" strokeWidth="2" strokeLinecap="round"/></svg>
                Calculation Breakdown
              </div>
              <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <span className="font-semibold">Input Summary:</span>
                <ul className="ml-4 list-disc">
                  <li><b>Width:</b> {inputs.width} cm</li>
                  <li><b>Depth:</b> {inputs.depth} cm</li>
                  <li><b>Height:</b> {inputs.height} m</li>
                  <li><b>Number of Columns:</b> {inputs.numColumns}</li>
                  <li><b>Mix:</b> {inputs.mix === 'custom' ? `${inputs.customCement}:{inputs.customSand}:{inputs.customAggregate}` : inputs.mix}</li>
                  <li><b>W/C Ratio:</b> {inputs.wcRatio}</li>
                  <li><b>Admixture:</b> {inputs.admixture} %</li>
                  <li><b>Dry Volume Factor:</b> {inputs.dryVolumeFactor}</li>
                  <li><b>Wastage:</b> {inputs.wastage} %</li>
                  {inputs.rate && <li><b>Concrete Rate:</b> {inputs.rate}</li>}
                </ul>
              </div>
              <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                <span className="font-semibold">Step-by-Step Explanation:</span>
                <div>
                  <StepCard
                    title="Convert dimensions to meters"
                    icon={<span className="text-lg">📏</span>}
                    formula={`Width = ${inputs.width} cm = ${(Number(inputs.width)/100).toFixed(2)} m, Depth = ${inputs.depth} cm = ${(Number(inputs.depth)/100).toFixed(2)} m`}
                    explanation="All calculations use SI units (meters)."
                  />
                  <StepCard
                    title="Calculate volume per column"
                    icon={<span className="text-lg">🧮</span>}
                    formula={`V = width × depth × height = ${(Number(inputs.width)/100).toFixed(2)} × ${(Number(inputs.depth)/100).toFixed(2)} × ${inputs.height} = ${((Number(inputs.width)/100)*(Number(inputs.depth)/100)*Number(inputs.height)).toFixed(3)} m³`}
                    explanation="This is the net volume of one column."
                  />
                  <StepCard
                    title="Total wet volume"
                    icon={<span className="text-lg">💧</span>}
                    formula={`Wet Volume = volume per column × number of columns = ${((Number(inputs.width)/100)*(Number(inputs.depth)/100)*Number(inputs.height)).toFixed(3)} × ${inputs.numColumns} = ${results.volume.toFixed(3)} m³`}
                    explanation="Total concrete required for all columns before bulking/wastage."
                  />
                  <StepCard
                    title="Calculate dry volume"
                    icon={<span className="text-lg">🌫️</span>}
                    formula={`Dry Volume = Wet Volume × Dry Volume Factor × (1 + Wastage %) = ${results.volume.toFixed(3)} × ${inputs.dryVolumeFactor} × (1 + ${Number(inputs.wastage)/100}) = ${results.dryVolume?.toFixed(3)} m³`}
                    explanation="Accounts for bulking and site wastage."
                  />
                  <StepCard
                    title="Mix ratio and material volumes"
                    icon={<span className="text-lg">⚖️</span>}
                    formula={`Cement:Sand:Aggregate = ${results.proportions.cement}:${results.proportions.sand}:${results.proportions.gravel}`}
                    explanation={`Material volumes are calculated as (part/total) × dry volume.`}
                  >
                    <div className="text-xs mt-1">
                      Cement = {(results.proportions.cement/(results.proportions.cement+results.proportions.sand+results.proportions.gravel)*results.dryVolume).toFixed(3)} m³<br/>
                      Sand = {(results.proportions.sand/(results.proportions.cement+results.proportions.sand+results.proportions.gravel)*results.dryVolume).toFixed(3)} m³<br/>
                      Aggregate = {(results.proportions.gravel/(results.proportions.cement+results.proportions.sand+results.proportions.gravel)*results.dryVolume).toFixed(3)} m³
                    </div>
                  </StepCard>
                  <StepCard
                    title="Cement weight and bags"
                    icon={<span className="text-lg">🪨</span>}
                    formula={`Cement Weight = Cement Volume × 1440 = ${(results.cementBags*50).toFixed(1)} kg, Bags = Weight / 50 = ${results.cementBags.toFixed(2)} bags`}
                    explanation="1 bag = 50 kg. Density of cement ≈ 1440 kg/m³."
                  />
                  <StepCard
                    title="Water and admixture required"
                    icon={<span className="text-lg">💧</span>}
                    formula={`Water = W/C × Cement Weight = ${inputs.wcRatio} × ${(results.cementBags*50).toFixed(1)} = ${results.water.toFixed(1)} kg, Admixture = (${inputs.admixture}% of cement) = ${results.admixture?.toFixed(2)} kg`}
                    explanation="Water/cement ratio affects strength and workability. Admixture is optional."
                  />
                  {results.cost !== null && (
                    <StepCard
                      title="Estimated Cost"
                      icon={<span className="text-lg">💲</span>}
                      formula={`Cost = Dry Volume × Rate = ${results.dryVolume?.toFixed(3)} × ${inputs.rate} = ${results.cost?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`}
                      explanation="Based on user-provided rate per m³."
                    />
                  )}
                </div>
              </div>
              {/* Animated Pie Chart */}
              <div className="mt-4">
                <div className="font-bold mb-1">Material Composition per 1 m³</div>
                <AnimatedPieChart
                  cement={results.proportions.cement}
                  sand={results.proportions.sand}
                  aggregate={results.proportions.gravel}
                  water={results.proportions.water}
                  admixture={results.admixture}
                />
                <div className="flex justify-center gap-4 text-xs mt-2">
                  <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-[#F87171] inline-block mr-1"></span>Cement</span>
                  <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-[#F59E42] inline-block mr-1"></span>Sand</span>
                  <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-[#14B8A6] inline-block mr-1"></span>Aggregate</span>
                  <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-[#3b82f6] inline-block mr-1"></span>Water</span>
                  <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full bg-[#a21caf] inline-block mr-1"></span>Admixture</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Reference Table Modal */}
      <ReferenceTableModal open={showReference} onClose={() => setShowReference(false)} />
    </div>
  );
}

// AnimatedPieChart component
function AnimatedPieChart({ cement, sand, aggregate, water, admixture }: { cement: number; sand: number; aggregate: number; water: number; admixture: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number; pct: number } | null>(null);
  const total = cement + sand + aggregate + water + admixture;
  const data = [
    { value: cement, color: "#F87171", label: "Cement" },
    { value: sand, color: "#F59E42", label: "Sand" },
    { value: aggregate, color: "#14B8A6", label: "Aggregate" },
    { value: water, color: "#3b82f6", label: "Water" },
    { value: admixture, color: "#a21caf", label: "Admixture" },
  ];
  // Animate the pie chart on mount
  useEffect(() => {
    if (!ref.current) return;
    data.forEach((_, i) => {
      const slice = ref.current?.querySelector(`#pie-slice-${i}`) as SVGPathElement;
      if (slice) {
        setTimeout(() => slice.style.opacity = "1", 200 + i * 200);
      }
    });
  }, [cement, sand, aggregate, water, admixture]);
  // Pie chart drawing
  let startAngle = 0;
  const radius = 70;
  const cx = 80, cy = 80;
  return (
    <div className="relative">
      <svg ref={ref} width="160" height="160" className="mx-auto mb-2">
        {data.map((d, i) => {
          const angle = (d.value / total) * 2 * Math.PI;
          const x1 = cx + radius * Math.cos(startAngle);
          const y1 = cy + radius * Math.sin(startAngle);
          const x2 = cx + radius * Math.cos(startAngle + angle);
          const y2 = cy + radius * Math.sin(startAngle + angle);
          const largeArc = angle > Math.PI ? 1 : 0;
          const path = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
          const midAngle = startAngle + angle / 2;
          const tooltipX = cx + (radius + 20) * Math.cos(midAngle);
          const tooltipY = cy + (radius + 20) * Math.sin(midAngle);
          const pct = (d.value / total) * 100;
          const isActive = hovered === i || selected === i;
          const slice = (
            <path
              key={i}
              id={`pie-slice-${i}`}
              d={path}
              fill={d.color}
              style={{ opacity: 0, transition: "opacity 0.7s", cursor: "pointer", filter: isActive ? "brightness(1.2) drop-shadow(0 0 8px #888)" : undefined, stroke: isActive ? "#222" : undefined, strokeWidth: isActive ? 3 : 0 }}
              onMouseEnter={() => {
                setHovered(i);
                setTooltip({ x: tooltipX, y: tooltipY, label: d.label, value: d.value, pct });
              }}
              onMouseLeave={() => {
                setHovered(null);
                setTooltip(null);
              }}
              onClick={() => setSelected(selected === i ? null : i)}
            />
          );
          startAngle += angle;
          return slice;
        })}
      </svg>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 px-3 py-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10, minWidth: 90 }}
        >
          <b>{tooltip.label}</b><br />
          {tooltip.value.toFixed(2)} parts<br />
          {tooltip.pct.toFixed(1)}%
        </div>
      )}
    </div>
  );
}

// --- Collapsible step-by-step cards for breakdown ---
function StepCard({ title, icon, formula, explanation, children }: { title: string, icon: React.ReactNode, formula: string, explanation: string, children?: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-2 border rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
      <button type="button" className="w-full flex items-center gap-2 px-3 py-2 font-semibold text-left" onClick={() => setOpen(o => !o)}>
        {icon}
        <span>{title}</span>
        <span className="ml-auto text-xs text-gray-400">{open ? "▼" : "►"}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 text-sm">
          <div className="mb-1 text-xs text-gray-500">{formula}</div>
          <div className="mb-1">{explanation}</div>
          {children}
        </div>
      )}
    </div>
  );
}

// --- Reference Table Modal for Standard Mixes ---
function ReferenceTableModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-teal-600" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="text-lg font-bold mb-2">Standard Mixes & Recommendations</h2>
        <table className="w-full text-xs border">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 border">Mix</th>
              <th className="p-2 border">W/C Range</th>
              <th className="p-2 border">Admixture %</th>
              <th className="p-2 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border p-1">M20 (1:1.5:3)</td><td className="border p-1">0.45–0.55</td><td className="border p-1">0–1</td><td className="border p-1">General RCC, beams, slabs</td></tr>
            <tr><td className="border p-1">M15 (1:2:4)</td><td className="border p-1">0.50–0.60</td><td className="border p-1">0–1</td><td className="border p-1">Footings, non-structural</td></tr>
            <tr><td className="border p-1">M10 (1:3:6)</td><td className="border p-1">0.55–0.65</td><td className="border p-1">0–1</td><td className="border p-1">Blinding, fill</td></tr>
            <tr><td className="border p-1">Custom</td><td className="border p-1">0.40–0.70</td><td className="border p-1">0–2</td><td className="border p-1">User-defined</td></tr>
          </tbody>
        </table>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-300">
          <b>Sources:</b> <a href="https://www.cement.org/" target="_blank" rel="noopener noreferrer" className="underline text-teal-600">ACI</a>, <a href="https://www.bis.gov.in/" target="_blank" rel="noopener noreferrer" className="underline text-teal-600">IS 456</a>, <a href="https://www.cement.org/learn/concrete-technology/concrete-construction/concrete-mix-design" target="_blank" rel="noopener noreferrer" className="underline text-teal-600">Mix Design Guide</a>
        </div>
      </div>
    </div>
  );
}
