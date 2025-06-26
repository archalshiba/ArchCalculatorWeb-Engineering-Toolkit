export const PARTS = [
	{
		label: "Foundations / Footings",
		desc: "RC footings (isolated, strip, raft, combined)",
		id: "foundations",
		icon: (
			<svg width="104" height="104" fill="none" className="text-teal-400 dark:text-teal-300" aria-label="Foundations / Footings technical icon" role="img">
				{/* Base slab */}
				<rect x="18" y="70" width="68" height="18" rx="4.5" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" />
				{/* Foundation body */}
				<rect x="34" y="34" width="36" height="36" rx="4.5" fill="#F87171" stroke="#b91c1c" strokeWidth="2.8" />
				{/* Reinforcement bars */}
				<g stroke="#fbbf24" strokeWidth="2.8">
					<line x1="38" y1="88" x2="38" y2="70" />
					<line x1="52" y1="88" x2="52" y2="70" />
					<line x1="66" y1="88" x2="66" y2="70" />
				</g>
				{/* Hatching for concrete */}
				<g stroke="#a3a3a3" strokeWidth="1.6">
					<line x1="22" y1="82" x2="38" y2="88" />
					<line x1="38" y1="88" x2="54" y2="82" />
					<line x1="54" y1="82" x2="70" y2="88" />
					<line x1="70" y1="88" x2="82" y2="82" />
				</g>
			</svg>
		),
	},
	{
		label: "Columns",
		desc: "RC columns (tied / spiral reinforcement)",
		id: "columns",
		icon: (
			<svg width="104" height="104" fill="none" className="text-teal-400 dark:text-teal-300">
				{/* Column body */}
				<rect x="44" y="18" width="16" height="68" rx="4.5" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" />
				{/* Stirrups (horizontal lines) */}
				<g stroke="#F87171" strokeWidth="3.5">
					<line x1="44" y1="28" x2="60" y2="28" />
					<line x1="44" y1="44" x2="60" y2="44" />
					<line x1="44" y1="60" x2="60" y2="60" />
					<line x1="44" y1="76" x2="60" y2="76" />
				</g>
				{/* Longitudinal bars (vertical) */}
				<circle cx="48.5" cy="22" r="2.8" fill="#fbbf24" />
				<circle cx="55.5" cy="22" r="2.8" fill="#fbbf24" />
				<circle cx="48.5" cy="84" r="2.8" fill="#fbbf24" />
				<circle cx="55.5" cy="84" r="2.8" fill="#fbbf24" />
				{/* Top cap */}
				<rect x="40" y="13" width="24" height="13" rx="4.5" fill="#F87171" />
			</svg>
		),
	},
	{
		label: "Beams",
		desc: "RC beams (prestressed / precast)",
		id: "beams",
		icon: (
			<svg width="104" height="104" fill="none" className="text-teal-400 dark:text-teal-300" aria-label="Beams technical icon" role="img">
				{/* Beam body */}
				<rect x="18" y="44" width="68" height="18" rx="4.5" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" />
				{/* Stirrups */}
				<g stroke="#F87171" strokeWidth="2.8">
					<rect x="22" y="48" width="9" height="9" rx="2.2" fill="none" />
					<rect x="73" y="48" width="9" height="9" rx="2.2" fill="none" />
				</g>
				{/* Longitudinal bars */}
				<circle cx="31" cy="62" r="2.5" fill="#fbbf24" />
				<circle cx="73" cy="62" r="2.5" fill="#fbbf24" />
				<circle cx="31" cy="48" r="2.5" fill="#fbbf24" />
				<circle cx="73" cy="48" r="2.5" fill="#fbbf24" />
				{/* End cap */}
				<rect x="80" y="40" width="13" height="28" rx="4.5" fill="#F87171" stroke="#b91c1c" strokeWidth="2.8" />
			</svg>
		),
	},
	{
		label: "Walls",
		desc: "RC shear / core / basement walls",
		id: "walls",
		icon: (
			<svg width="104" height="104" fill="none" className="text-teal-400 dark:text-teal-300" aria-label="Walls technical icon" role="img">
				{/* Wall body */}
				<rect x="34" y="18" width="36" height="68" rx="4.5" fill="currentColor" stroke="#0f766e" strokeWidth="3.5" />
				{/* Top cap */}
				<rect x="29" y="13" width="46" height="13" rx="4.5" fill="#F87171" stroke="#b91c1c" strokeWidth="2.8" />
				{/* Vertical rebars */}
				<g stroke="#fbbf24" strokeWidth="2.5">
					<line x1="43" y1="22" x2="43" y2="86" />
					<line x1="52" y1="22" x2="52" y2="86" />
					<line x1="61" y1="22" x2="61" y2="86" />
				</g>
				{/* Horizontal rebars */}
				<g stroke="#fbbf24" strokeWidth="2.5">
					<line x1="38" y1="36" x2="66" y2="36" />
					<line x1="38" y1="54" x2="66" y2="54" />
					<line x1="38" y1="72" x2="66" y2="72" />
				</g>
			</svg>
		),
	},
	{
		label: "Stairs & Elevator Shafts",
		desc: "Cast-in-place & precast",
		id: "stairs",
		icon: (
			<svg width="104" height="104" fill="none" className="text-teal-400 dark:text-teal-300" aria-label="Stairs and Elevator Shafts technical icon" role="img">
				{/* Shaft */}
				<rect x="22" y="82" width="60" height="9" rx="2.2" fill="currentColor" stroke="#0f766e" strokeWidth="2.8" />
				{/* Stairs */}
				<g>
					<rect x="29" y="68" width="46" height="9" rx="2.2" fill="#F87171" stroke="#b91c1c" strokeWidth="2.5" />
					<rect x="38" y="54" width="28" height="9" rx="2.2" fill="currentColor" stroke="#0f766e" strokeWidth="2.5" />
				</g>
				{/* Steps (lines) */}
				<g stroke="#fbbf24" strokeWidth="2.2">
					<line x1="38" y1="63" x2="66" y2="63" />
					<line x1="38" y1="59" x2="52" y2="59" />
				</g>
			</svg>
		),
	},
	{
		label: "Ground Beams & Slab-on-Grade",
		desc: "Slab-on-grade & ground beams",
		id: "groundbeams",
		icon: (
			<svg width="104" height="104" fill="none" className="text-teal-400 dark:text-teal-300" aria-label="Ground Beams and Slab-on-Grade technical icon" role="img">
				{/* Slab */}
				<rect x="18" y="88" width="68" height="9" rx="2.2" fill="currentColor" stroke="#0f766e" strokeWidth="2.5" />
				{/* Ground beam */}
				<rect x="44" y="70" width="16" height="18" rx="2.2" fill="#F87171" stroke="#b91c1c" strokeWidth="2.2" />
				{/* Rebars */}
				<g stroke="#fbbf24" strokeWidth="2.2">
					<line x1="52" y1="88" x2="52" y2="70" />
					<line x1="60" y1="88" x2="60" y2="70" />
				</g>
			</svg>
		),
	},
	{
		label: "Specialized Elements",
		desc: "Prestressed, fiber-reinforced",
		id: "specialized",
		icon: (
			<svg width="104" height="104" fill="none" className="text-teal-400 dark:text-teal-300" aria-label="Specialized Elements technical icon" role="img">
				{/* Main element */}
				<circle cx="52" cy="52" r="26" fill="currentColor" stroke="#0f766e" strokeWidth="2.8" />
				{/* Fiber/Prestress lines */}
				<g stroke="#fbbf24" strokeWidth="2.5">
					<line x1="38" y1="38" x2="66" y2="66" />
					<line x1="66" y1="38" x2="38" y2="66" />
				</g>
				{/* Core */}
				<rect x="44" y="44" width="16" height="16" rx="2.2" fill="#F87171" stroke="#b91c1c" strokeWidth="2.2" />
			</svg>
		),
	},
];

interface ConcretePartSelectorProps {
	onSelect: (part: string) => void;
}

export function ConcretePartSelector({ onSelect, onBack }: ConcretePartSelectorProps & { onBack?: () => void }) {
	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="flex items-center mb-4">
				<button
					type="button"
					className="mr-2 text-teal-500 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-full disabled:opacity-40 disabled:pointer-events-none"
					aria-label="Back"
					disabled={!onBack}
					onClick={onBack}
				>
					<svg width="36" height="36" fill="none" viewBox="0 0 36 36">
						<circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="2" fill="white" className="dark:fill-gray-900" />
						<path
							d="M22 27l-9-9 9-9"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex-1">
					Concrete Calculator
				</h1>
				<nav className="text-sm text-gray-500 dark:text-gray-400">
					Home <span className="mx-1">&gt;</span> Quantity <span className="mx-1">&gt;</span> Concrete
				</nav>
			</div>
			<p className="mb-6 text-gray-600 dark:text-gray-300">
				Select the building part and concrete type to calculate.
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{PARTS.map((part) => (
					<button
						key={part.id}
						className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-8 flex flex-col items-center border-2 border-transparent hover:border-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 group"
						onClick={() => onSelect(part.id)}
						aria-label={part.label}
					>
						<div className="mb-6 scale-100 group-hover:scale-105 group-focus:scale-105 transition-transform duration-200 drop-shadow-lg">
							{part.icon}
						</div>
						<div className="font-semibold text-xl text-gray-800 dark:text-gray-100 text-center">
							{part.label}
						</div>
						<div className="text-base text-gray-500 dark:text-gray-400 mt-2 text-center">
							{part.desc}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
