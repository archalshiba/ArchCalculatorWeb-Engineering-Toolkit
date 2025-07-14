export interface FoundationData {
  id: string;
  type: 'isolated' | 'strip' | 'raft' | 'combined' | 'sloped';
  width: number;
  length: number;
  thickness: number;
  embeddedDepth: number;
  elementLabel: string;
}

export interface ColumnData {
  shape: 'rectangular' | 'circular' | 'tshape' | 'lshape' | 'polygon';
  width: number;
  depth: number;
  height: number;
  diameter: number;
  flangeWidth: number;
  flangeThickness: number;
  webWidth: number;
  webThickness: number;
  sideLength: number;
  numberOfSides: number;
}

export interface CalculationResults {
  column: {
    concreteVolume: number;
    mainBarsWeight: number;
    stirrupsWeight: number;
    totalSteelWeight: number;
    concreteCost: number;
    mainBarsCost: number;
    stirrupsCost: number;
    totalCost: number;
  };
  foundation: {
    concreteVolume: number;
    bottomBarsWeight: number;
    topBarsWeight: number;
    meshWeight: number;
    totalSteelWeight: number;
    concreteCost: number;
    bottomBarsCost: number;
    topBarsCost: number;
    meshCost: number;
    totalCost: number;
  };
  combined: {
    totalConcreteVolume: number;
    totalSteelWeight: number;
    totalCost: number;
  };
}