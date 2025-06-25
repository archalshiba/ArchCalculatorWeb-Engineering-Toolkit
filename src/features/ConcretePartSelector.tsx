const PARTS = [
	{
		label: "Foundations / Footings",
		desc: "RC footings (isolated, strip, raft, combined)",
		id: "foundations",
		icon: (
			<svg width="48" height="48" fill="none" className="text-teal-400">
				<rect
					x="8"
					y="32"
					width="32"
					height="8"
					rx="2"
					fill="currentColor"
				/>
				<rect x="16" y="16" width="16" height="16" rx="2" fill="#F87171" />
			</svg>
		),
	},
	{
		label: "Columns",
		desc: "RC columns (tied / spiral reinforcement)",
		id: "columns",
		icon: (
			<svg width="48" height="48" fill="none" className="text-teal-400">
				<rect
					x="20"
					y="8"
					width="8"
					height="32"
					rx="2"
					fill="currentColor"
				/>
				<rect x="18" y="6" width="12" height="6" rx="2" fill="#F87171" />
			</svg>
		),
	},
	{
		label: "Beams",
		desc: "RC beams (prestressed / precast)",
		id: "beams",
		icon: (
			<svg width="48" height="48" fill="none" className="text-teal-400">
				<rect
					x="8"
					y="20"
					width="32"
					height="8"
					rx="2"
					fill="currentColor"
				/>
				<rect x="36" y="18" width="6" height="12" rx="2" fill="#F87171" />
			</svg>
		),
	},
	{
		label: "Walls",
		desc: "RC shear / core / basement walls",
		id: "walls",
		icon: (
			<svg width="48" height="48" fill="none" className="text-teal-400">
				<rect
					x="16"
					y="8"
					width="16"
					height="32"
					rx="2"
					fill="currentColor"
				/>
				<rect x="14" y="6" width="20" height="6" rx="2" fill="#F87171" />
			</svg>
		),
	},
	{
		label: "Stairs & Elevator Shafts",
		desc: "Cast-in-place & precast",
		id: "stairs",
		icon: (
			<svg width="48" height="48" fill="none" className="text-teal-400">
				<rect
					x="10"
					y="34"
					width="28"
					height="4"
					rx="2"
					fill="currentColor"
				/>
				<rect x="14" y="28" width="20" height="4" rx="2" fill="#F87171" />
				<rect
					x="18"
					y="22"
					width="12"
					height="4"
					rx="2"
					fill="currentColor"
				/>
			</svg>
		),
	},
	{
		label: "Ground Beams & Slab-on-Grade",
		desc: "Slab-on-grade & ground beams",
		id: "groundbeams",
		icon: (
			<svg width="48" height="48" fill="none" className="text-teal-400">
				<rect
					x="8"
					y="36"
					width="32"
					height="4"
					rx="2"
					fill="currentColor"
				/>
				<rect x="20" y="28" width="8" height="8" rx="2" fill="#F87171" />
			</svg>
		),
	},
	{
		label: "Specialized Elements",
		desc: "Prestressed, fiber-reinforced",
		id: "specialized",
		icon: (
			<svg width="48" height="48" fill="none" className="text-teal-400">
				<circle cx="24" cy="24" r="12" fill="currentColor" />
				<rect x="20" y="20" width="8" height="8" rx="2" fill="#F87171" />
			</svg>
		),
	},
];

interface ConcretePartSelectorProps {
	onSelect: (part: string) => void;
}

export function ConcretePartSelector({ onSelect }: ConcretePartSelectorProps) {
	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex items-center mb-4">
				<button className="mr-2 text-teal-500 hover:text-teal-700">
					{/* Back arrow icon */}
					<svg width="28" height="28" fill="none">
						<path
							d="M18 24l-8-8 8-8"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
				<h1 className="text-2xl font-bold text-gray-800 flex-1">
					Concrete Calculator
				</h1>
				<nav className="text-sm text-gray-500">
					Home <span className="mx-1">&gt;</span> Quantity{" "}
					<span className="mx-1">&gt;</span> Concrete
				</nav>
			</div>
			<p className="mb-6 text-gray-600">
				Select the building part and concrete type to calculate.
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{PARTS.map((part) => (
					<button
						key={part.id}
						className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center border-2 border-transparent hover:border-teal-300"
						onClick={() => onSelect(part.id)}
					>
						<div className="mb-4">{part.icon}</div>
						<div className="font-semibold text-lg text-gray-800">
							{part.label}
						</div>
						<div className="text-sm text-gray-500 mt-1">{part.desc}</div>
					</button>
				))}
			</div>
		</div>
	);
}
