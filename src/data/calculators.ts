import { Calculator, CalculatorIcon, Hammer, Ruler, Box, ArrowRightLeft, Building, Square, Circle, Triangle, Cuboid as Cube, Cherry as Sphere, Cylinder, Thermometer, Scale, Clock, Gauge, Zap, Wrench, Home, Droplets, TreePine, Sun, Package, RotateCcw, Shapes, Activity, Target, PieChart, Hexagon, Hash, Crown } from 'lucide-react';

export interface CalculatorItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'quantity' | 'area' | 'volume' | 'converter';
  isPro?: boolean;
  tags?: string[];
}

export const calculators: CalculatorItem[] = [
  // Quantity Calculators
  {
    id: 'rebar-calculator',
    title: 'Rebar Calculator',
    description: 'Calculate rebar weight and quantity for reinforced concrete',
    icon: Building,
    category: 'quantity',
    tags: ['structural', 'civil', 'design']
  },
  {
    id: 'steel-weight-calculator',
    title: 'Steel Weight Calculator',
    description: 'Determine weight of steel sections and plates',
    icon: Scale,
    category: 'quantity',
    tags: ['structural', 'materials', 'calculation']
  },
  {
    id: 'concrete-calculator',
    title: 'Concrete Calculator',
    description: 'Calculate concrete volume for slabs, columns, and beams',
    icon: Cube,
    category: 'quantity',
    tags: ['structural', 'civil', 'materials']
  },
  {
    id: 'rcc-foundation-calculator',
    title: 'RCC Foundation & Column Calculator',
    description: 'Professional foundation and column quantity calculator with 3D visualization',
    icon: Building,
    category: 'quantity',
    tags: ['structural', 'civil', 'foundation', 'professional']
  },
  {
    id: 'excavation-calculator',
    title: 'Excavation Calculator',
    description: 'Estimate earthwork and excavation quantities',
    icon: Hammer,
    category: 'quantity',
    tags: ['civil', 'geotechnical', 'calculation']
  },
  {
    id: 'refill-calculator',
    title: 'Refill Calculator',
    description: 'Calculate backfill material requirements',
    icon: Package,
    category: 'quantity',
    tags: ['civil', 'geotechnical', 'materials']
  },
  {
    id: 'masonry-calculator',
    title: 'Masonry Calculator',
    description: 'Estimate bricks, blocks, and mortar quantities',
    icon: Building,
    category: 'quantity',
    tags: ['structural', 'materials', 'design']
  },
  {
    id: 'tile-calculator',
    title: 'Tile Calculator',
    description: 'Calculate tiles needed for flooring and walls',
    icon: Square,
    category: 'quantity',
    tags: ['design', 'materials', 'calculation']
  },
  {
    id: 'plaster-calculator',
    title: 'Plaster Calculator',
    description: 'Estimate plaster material and coverage area',
    icon: Hammer,
    category: 'quantity',
    tags: ['design', 'materials', 'calculation']
  },
  {
    id: 'drawing-estimator',
    title: 'Drawing Estimator',
    description: 'Estimate quantities from architectural drawings',
    icon: Ruler,
    category: 'quantity',
    tags: ['design', 'analysis', 'measurement']
  },
  {
    id: 'water-tank-capacity',
    title: 'Water Tank Capacity',
    description: 'Calculate rectangular and circular tank volumes',
    icon: Droplets,
    category: 'quantity',
    tags: ['civil', 'environmental', 'calculation']
  },
  {
    id: 'material-density',
    title: 'Material Density Calculator',
    description: 'Calculate material density and weight ratios',
    icon: Activity,
    category: 'quantity',
    tags: ['materials', 'analysis', 'calculation']
  },
  {
    id: 'capacity-calculator',
    title: 'Capacity Calculator',
    description: 'General capacity calculations for containers',
    icon: Box,
    category: 'quantity',
    tags: ['calculation', 'measurement', 'basic']
  },
  {
    id: 'swimming-pool-volume',
    title: 'Swimming Pool Volume',
    description: 'Calculate pool water volume and chemical needs',
    icon: Droplets,
    category: 'quantity',
    tags: ['civil', 'environmental', 'calculation']
  },
  {
    id: 'solar-electric',
    title: 'Solar Electric Calculator',
    description: 'Size solar panel systems and battery requirements',
    icon: Sun,
    category: 'quantity',
    tags: ['electrical', 'environmental', 'design']
  },
  {
    id: 'solar-water-heater',
    title: 'Solar Water Heater',
    description: 'Calculate solar water heating system capacity',
    icon: Thermometer,
    category: 'quantity',
    tags: ['mechanical', 'environmental', 'design']
  },
  {
    id: 'plywood-sheet',
    title: 'Plywood Sheet Calculator',
    description: 'Estimate plywood sheets for formwork and construction',
    icon: Package,
    category: 'quantity',
    tags: ['materials', 'calculation', 'design']
  },
  {
    id: 'paver-block',
    title: 'Paver Block Calculator',
    description: 'Calculate paver blocks for walkways and driveways',
    icon: Square,
    category: 'quantity',
    tags: ['civil', 'materials', 'design']
  },
  {
    id: 'concrete-cement-ratio',
    title: 'Concrete Cement Ratio',
    description: 'Calculate proper concrete mix ratios',
    icon: RotateCcw,
    category: 'quantity',
    tags: ['materials', 'calculation', 'design']
  },
  {
    id: 'rainwater-harvesting',
    title: 'Rainwater Harvesting',
    description: 'Calculate rainwater collection potential',
    icon: TreePine,
    category: 'quantity',
    tags: ['environmental', 'civil', 'calculation']
  },
  {
    id: 'water-usage',
    title: 'Water Usage Calculator',
    description: 'Estimate daily and monthly water consumption',
    icon: Droplets,
    category: 'quantity',
    tags: ['environmental', 'calculation', 'analysis']
  },
  {
    id: 'screw-calculator',
    title: 'Screw Calculator',
    description: 'Calculate screw quantities for construction',
    icon: Wrench,
    category: 'quantity',
    tags: ['materials', 'calculation', 'basic']
  },
  {
    id: 'grout-calculator',
    title: 'Grout Calculator',
    description: 'Estimate grout quantities for tile installation',
    icon: Target,
    category: 'quantity',
    tags: ['materials', 'calculation', 'design']
  },

  // Area Calculators
  {
    id: 'area-measurement',
    title: 'Area Measurement Tool',
    description: 'Multi-purpose area calculation tool',
    icon: Ruler,
    category: 'area',
    tags: ['measurement', 'calculation', 'basic']
  },
  {
    id: 'land-area',
    title: 'Land Area Calculator',
    description: 'Calculate land area from coordinates and measurements',
    icon: Home,
    category: 'area',
    tags: ['civil', 'measurement', 'calculation']
  },
  {
    id: 'circle-area',
    title: 'Circle Area',
    description: 'Calculate area of circles and circular segments',
    icon: Circle,
    category: 'area',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'rectangle-area',
    title: 'Rectangle Area',
    description: 'Calculate rectangular and square areas',
    icon: Square,
    category: 'area',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'triangle-area',
    title: 'Triangle Area',
    description: 'Calculate triangular areas using various methods',
    icon: Triangle,
    category: 'area',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'rhombus-area',
    title: 'Rhombus Area',
    description: 'Calculate rhombus and diamond shapes',
    icon: Shapes,
    category: 'area',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'l-plot-area',
    title: 'L-Plot Area',
    description: 'Calculate L-shaped plot areas',
    icon: Square,
    category: 'area',
    tags: ['calculation', 'measurement', 'design']
  },
  {
    id: 'square-area',
    title: 'Square Area',
    description: 'Calculate perfect square areas',
    icon: Square,
    category: 'area',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'right-angle-area',
    title: 'Right Angle Area',
    description: 'Calculate areas with right angles',
    icon: Triangle,
    category: 'area',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'quadrilateral-area',
    title: 'Quadrilateral Area',
    description: 'Calculate four-sided polygon areas',
    icon: Shapes,
    category: 'area',
    tags: ['calculation', 'measurement', 'advanced']
  },
  {
    id: 'sector-area',
    title: 'Sector Area',
    description: 'Calculate circular sector and segment areas',
    icon: PieChart,
    category: 'area',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'pentagon-area',
    title: 'Pentagon Area',
    description: 'Calculate pentagon and five-sided shapes',
    icon: Shapes,
    category: 'area',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'hexagon-area',
    title: 'Hexagon Area',
    description: 'Calculate hexagonal areas',
    icon: Hexagon,
    category: 'area',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'octagon-area',
    title: 'Octagon Area',
    description: 'Calculate octagonal areas',
    icon: Shapes,
    category: 'area',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'trapezoid-area',
    title: 'Trapezoid Area',
    description: 'Calculate trapezoidal areas',
    icon: Shapes,
    category: 'area',
    tags: ['calculation', 'basic', 'measurement']
  },

  // Volume Calculators
  {
    id: 'sphere-volume',
    title: 'Sphere Volume',
    description: 'Calculate sphere and ball volumes',
    icon: Sphere,
    category: 'volume',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'cube-volume',
    title: 'Cube Volume',
    description: 'Calculate cubic volumes',
    icon: Cube,
    category: 'volume',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'generic-volume',
    title: 'Generic Volume Calculator',
    description: 'Multi-purpose volume calculations',
    icon: Box,
    category: 'volume',
    tags: ['calculation', 'measurement', 'basic']
  },
  {
    id: 'pack-volume',
    title: 'Pack Volume',
    description: 'Calculate package and container volumes',
    icon: Package,
    category: 'volume',
    tags: ['calculation', 'measurement', 'basic']
  },
  {
    id: 'semi-sphere-volume',
    title: 'Semi-Sphere Volume',
    description: 'Calculate hemisphere and dome volumes',
    icon: Sphere,
    category: 'volume',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'cone-volume',
    title: 'Cone Volume',
    description: 'Calculate conical volumes',
    icon: Triangle,
    category: 'volume',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'cylinder-volume',
    title: 'Cylinder Volume',
    description: 'Calculate cylindrical volumes',
    icon: Cylinder,
    category: 'volume',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'trapezoid-volume',
    title: 'Trapezoid Volume',
    description: 'Calculate trapezoidal prism volumes',
    icon: Box,
    category: 'volume',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'rectangular-prism',
    title: 'Rectangular Prism Volume',
    description: 'Calculate rectangular box volumes',
    icon: Box,
    category: 'volume',
    tags: ['calculation', 'basic', 'measurement']
  },
  {
    id: 'spherical-cap',
    title: 'Spherical Cap Volume',
    description: 'Calculate partial sphere volumes',
    icon: Sphere,
    category: 'volume',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'frustum-volume',
    title: 'Frustum Volume',
    description: 'Calculate truncated cone volumes',
    icon: Triangle,
    category: 'volume',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'rectangular-cavity',
    title: 'Rectangular Cavity Volume',
    description: 'Calculate hollow rectangular volumes',
    icon: Box,
    category: 'volume',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'pipe-volume',
    title: 'Pipe Volume',
    description: 'Calculate pipe and tube volumes',
    icon: Cylinder,
    category: 'volume',
    tags: ['mechanical', 'calculation', 'measurement']
  },
  {
    id: 'slope-volume',
    title: 'Slope Volume',
    description: 'Calculate sloped earthwork volumes',
    icon: Triangle,
    category: 'volume',
    tags: ['civil', 'geotechnical', 'calculation']
  },
  {
    id: 'paralleloid-volume',
    title: 'Paralleloid Volume',
    description: 'Calculate parallelogram-based volumes',
    icon: Box,
    category: 'volume',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'cut-cylinder',
    title: 'Cut Cylinder Volume',
    description: 'Calculate partially cut cylinder volumes',
    icon: Cylinder,
    category: 'volume',
    tags: ['calculation', 'advanced', 'measurement']
  },
  {
    id: 'barrel-volume',
    title: 'Barrel Volume',
    description: 'Calculate barrel and tank volumes',
    icon: Cylinder,
    category: 'volume',
    tags: ['calculation', 'measurement', 'basic']
  },

  // Unit Converters
  {
    id: 'length-converter',
    title: 'Length',
    description: 'Convert between length units (mm, cm, m, ft, in)',
    icon: Ruler,
    category: 'converter',
    tags: ['basic', 'measurement', 'calculation']
  },
  {
    id: 'weight-converter',
    title: 'Weight',
    description: 'Convert between weight units (kg, lb, ton, gram)',
    icon: Scale,
    category: 'converter',
    tags: ['basic', 'measurement', 'calculation']
  },
  {
    id: 'area-converter',
    title: 'Area',
    description: 'Convert between area units (m², ft², acre, hectare)',
    icon: Square,
    category: 'converter',
    tags: ['basic', 'measurement', 'calculation']
  },
  {
    id: 'volume-converter',
    title: 'Volume',
    description: 'Convert between volume units (m³, ft³, liter, gallon)',
    icon: Box,
    category: 'converter',
    tags: ['basic', 'measurement', 'calculation']
  },
  {
    id: 'temperature-converter',
    title: 'Temperature',
    description: 'Convert between °C, °F, and Kelvin',
    icon: Thermometer,
    category: 'converter',
    tags: ['basic', 'measurement', 'calculation']
  },
  {
    id: 'pressure-converter',
    title: 'Pressure',
    description: 'Convert between pressure units (Pa, PSI, bar, atm)',
    icon: Gauge,
    category: 'converter',
    tags: ['mechanical', 'measurement', 'calculation']
  },
  {
    id: 'time-converter',
    title: 'Time',
    description: 'Convert between time units (sec, min, hr, day)',
    icon: Clock,
    category: 'converter',
    tags: ['basic', 'measurement', 'calculation']
  },
  {
    id: 'fuel-converter',
    title: 'Fuel',
    description: 'Convert fuel consumption units',
    icon: Zap,
    category: 'converter',
    tags: ['mechanical', 'measurement', 'calculation']
  },
  {
    id: 'angle-converter',
    title: 'Angle',
    description: 'Convert between degrees, radians, and gradians',
    icon: RotateCcw,
    category: 'converter',
    tags: ['basic', 'measurement', 'calculation']
  },
  {
    id: 'speed-converter',
    title: 'Speed',
    description: 'Convert between speed units (m/s, km/h, mph)',
    icon: Activity,
    category: 'converter',
    tags: ['mechanical', 'measurement', 'calculation']
  },
  {
    id: 'force-converter',
    title: 'Force',
    description: 'Convert between force units (N, kN, lbf, kgf)',
    icon: Hammer,
    category: 'converter',
    tags: ['mechanical', 'measurement', 'calculation']
  },
  {
    id: 'density-converter',
    title: 'Density',
    description: 'Convert between density units',
    icon: Package,
    category: 'converter',
    tags: ['materials', 'measurement', 'calculation']
  },
  {
    id: 'fraction-decimal',
    title: 'Fraction to Decimal',
    description: 'Convert fractions to decimals and vice versa',
    icon: Hash,
    category: 'converter',
    tags: ['basic', 'calculation', 'measurement']
  },
  {
    id: 'number-word',
    title: 'Number to Word',
    description: 'Convert numbers to written words',
    icon: Hash,
    category: 'converter',
    tags: ['basic', 'calculation', 'measurement']
  }
];

// Pro calculators (future locked features)
export const proCalculators: CalculatorItem[] = [
  {
    id: 'steel-foot-calculator',
    title: 'Steel Foot Calculator',
    description: 'Advanced steel footing calculations',
    icon: Crown,
    category: 'quantity',
    isPro: true,
    tags: ['structural', 'professional', 'analysis']
  },
  {
    id: 'steel-column-calculator',
    title: 'Steel Column Calculator',
    description: 'Steel column design and analysis',
    icon: Crown,
    category: 'quantity',
    isPro: true,
    tags: ['structural', 'professional', 'design']
  },
  {
    id: 'steel-beam-calculator',
    title: 'Steel Beam Calculator',
    description: 'Steel beam sizing and deflection',
    icon: Crown,
    category: 'quantity',
    isPro: true,
    tags: ['structural', 'professional', 'analysis']
  },
  {
    id: 'steel-slab-calculator',
    title: 'Steel Slab Calculator',
    description: 'Steel slab design calculations',
    icon: Crown,
    category: 'quantity',
    isPro: true,
    tags: ['structural', 'professional', 'design']
  },
  {
    id: 'concrete-pipe-calculator',
    title: 'Concrete Pipe Calculator',
    description: 'Concrete pipe design and capacity',
    icon: Crown,
    category: 'quantity',
    isPro: true,
    tags: ['civil', 'professional', 'design']
  },
  {
    id: 'shear-wall-calculator',
    title: 'Shear Wall Calculator',
    description: 'Shear wall design and analysis',
    icon: Crown,
    category: 'quantity',
    isPro: true,
    tags: ['structural', 'professional', 'analysis']
  },
  {
    id: 'cost-estimator',
    title: 'Construction Cost Estimator',
    description: 'Comprehensive construction cost analysis',
    icon: Crown,
    category: 'quantity',
    isPro: true,
    tags: ['professional', 'analysis', 'calculation']
  }
];

export const categoryLabels = {
  quantity: 'Quantity Calculators',
  area: 'Area Calculators',
  volume: 'Volume Calculators',
  converter: 'Unit Converters'
};

export const categoryIcons = {
  quantity: Calculator,
  area: Square,
  volume: Cube,
  converter: ArrowRightLeft
};