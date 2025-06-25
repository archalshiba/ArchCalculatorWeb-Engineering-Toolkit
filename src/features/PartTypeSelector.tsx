import React from "react";

const PART_TYPES: Record<string, { id: string; label: string; desc?: string }[]> = {
  columns: [
    { id: "rectangular", label: "Rectangular Column" },
    { id: "circular", label: "Circular Column" },
    { id: "lshape", label: "L-Shape Column" },
    { id: "tshape", label: "T-Shape Column" },
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

export function PartTypeSelector({ partId, onSelect, onBack }: { partId: string; onSelect: (typeId: string) => void; onBack: () => void }) {
  const types = PART_TYPES[partId] || [];
  return (
    <div className="max-w-xl mx-auto p-6">
      <button onClick={onBack} className="mb-4 text-teal-500 hover:text-teal-700">&larr; Back</button>
      <h2 className="text-2xl font-bold mb-6">Select {partId.charAt(0).toUpperCase() + partId.slice(1)} Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {types.map(type => (
          <button
            key={type.id}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
            onClick={() => onSelect(type.id)}
          >
            <span className="font-semibold">{type.label}</span>
            {type.desc && <span className="text-xs text-gray-500 mt-1">{type.desc}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
