import React from "react";

const PART_TYPES: Record<string, { id: string; label: string; desc?: string; icon?: React.ReactNode }[]> = {
  columns: [
    {
      id: "rectangular",
      label: "Rectangular Column",
      icon: (
        <svg width="104" height="104" aria-label="Rectangular Column 3D" className="text-teal-400 dark:text-teal-300" viewBox="0 0 104 104">
          {/* 3D body */}
          <g>
            {/* Main front face */}
            <rect x="36" y="28" width="32" height="48" rx="4" fill="currentColor" stroke="#0f766e" strokeWidth="2.5" />
            {/* Top face */}
            <polygon points="36,28 52,18 84,18 68,28" fill="#F87171" stroke="#b91c1c" strokeWidth="1.5" />
            {/* Side face */}
            <polygon points="68,28 84,18 84,66 68,76" fill="#0f766e" fillOpacity="0.15" />
            {/* 3D effect lines */}
            <line x1="36" y1="28" x2="68" y2="28" stroke="#0f766e" strokeWidth="1.2" />
            <line x1="68" y1="28" x2="68" y2="76" stroke="#0f766e" strokeWidth="1.2" />
            <line x1="36" y1="76" x2="68" y2="76" stroke="#0f766e" strokeWidth="1.2" />
          </g>
          {/* Stirrups (horizontal) */}
          <g stroke="#F87171" strokeWidth="1.2">
            <line x1="40" y1="36" x2="64" y2="36" />
            <line x1="40" y1="48" x2="64" y2="48" />
            <line x1="40" y1="60" x2="64" y2="60" />
            <line x1="40" y1="72" x2="64" y2="72" />
          </g>
          {/* Longitudinal bars (vertical) */}
          <circle cx="42" cy="34" r="2" fill="#fbbf24" />
          <circle cx="62" cy="34" r="2" fill="#fbbf24" />
          <circle cx="42" cy="70" r="2" fill="#fbbf24" />
          <circle cx="62" cy="70" r="2" fill="#fbbf24" />
        </svg>
      ),
    },
    { id: "circular", label: "Circular Column", icon: <svg width="104" height="104" aria-label="Circular Column" className="text-teal-400 dark:text-teal-300" viewBox="0 0 104 104"><ellipse cx="52" cy="52" rx="12" ry="34" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" /></svg> },
    { id: "lshape", label: "L-Shape Column", icon: <svg width="104" height="104" aria-label="L-Shape Column" className="text-teal-400 dark:text-teal-300" viewBox="0 0 104 104"><rect x="44" y="44" width="28" height="16" rx="4.5" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" /><rect x="44" y="44" width="16" height="28" rx="4.5" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" /></svg> },
    { id: "tshape", label: "T-Shape Column", icon: <svg width="104" height="104" aria-label="T-Shape Column" className="text-teal-400 dark:text-teal-300" viewBox="0 0 104 104"><rect x="44" y="44" width="16" height="28" rx="4.5" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" /><rect x="36" y="44" width="32" height="16" rx="4.5" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" /></svg> },
  ],
  foundations: [
    { id: "isolated", label: "Isolated Footing" },
    { id: "strip", label: "Strip Footing" },
    { id: "raft", label: "Raft Foundation" },
    { id: "combined", label: "Combined Footing" },
  ],
  beams: [
    { id: "rectangular", label: "Rectangular Beam" },
    { id: "tbeam", label: "T-Beam" },
    { id: "lbeam", label: "L-Beam" },
    { id: "precast", label: "Precast Beam" },
  ],
  walls: [
    { id: "shear", label: "Shear Wall" },
    { id: "core", label: "Core Wall" },
    { id: "basement", label: "Basement Wall" },
  ],
  stairs: [
    { id: "castinplace", label: "Cast-in-place Stairs" },
    { id: "precast", label: "Precast Stairs" },
    { id: "elevator", label: "Elevator Shaft" },
  ],
  groundbeams: [
    { id: "slabongrade", label: "Slab-on-Grade" },
    { id: "groundbeam", label: "Ground Beam" },
  ],
  specialized: [
    { id: "prestressed", label: "Prestressed Element" },
    { id: "fiber", label: "Fiber-Reinforced Element" },
  ],
};

export function PartTypeSelector({ partId, onSelect, onBack, partLabel }: { partId: string; onSelect: (typeId: string) => void; onBack: () => void; partLabel: string }) {
  const types = PART_TYPES[partId] || [];
  return (
    <div className="max-w-4xl mx-auto p-4">
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex-1">
          {partLabel} Types
        </h1>
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          Home <span className="mx-1">&gt;</span> Quantity <span className="mx-1">&gt;</span> Concrete <span className="mx-1">&gt;</span> {partLabel}
        </nav>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Select the type of {partLabel.toLowerCase()} to calculate.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((type) => (
          <button
            key={type.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-8 flex flex-col items-center border-2 border-transparent hover:border-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 group"
            onClick={() => onSelect(type.id)}
            aria-label={type.label}
          >
            <div className="mb-6 scale-100 group-hover:scale-105 group-focus:scale-105 transition-transform duration-200 drop-shadow-lg">
              {type.icon}
            </div>
            <div className="font-semibold text-xl text-gray-800 dark:text-gray-100 text-center">
              {type.label}
            </div>
            {type.desc && (
              <div className="text-base text-gray-500 dark:text-gray-400 mt-2 text-center">
                {type.desc}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
