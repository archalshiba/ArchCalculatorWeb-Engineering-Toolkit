import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  OrthographicCamera,
  Text,
  Box,
  Cylinder,
  Environment,
  Grid,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { FoundationData, ColumnData } from '../types/calculator';

interface Viewer3DProps {
  foundationData: FoundationData;
  columnData: ColumnData;
  reinforcementData: any;
  settings: {
    showConcrete: boolean;
    showMainBars: boolean;
    showStirrupsAndTies: boolean;
    showMesh: boolean;
    projection: 'orthographic' | 'perspective';
    viewAngle: 'top' | 'front' | 'side' | 'isometric';
    zoom?: number;
    pinned?: boolean;
  };
  unitSystem: 'metric' | 'imperial';
}

// Foundation Component
const Foundation: React.FC<{
  data: FoundationData;
  visible: boolean;
}> = ({ data, visible }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  if (!visible) return null;

  return (
    <group position={[0, -data.thickness / 2000, 0]}>
      <Box
        ref={meshRef}
        args={[data.width / 1000, data.thickness / 1000, data.length / 1000]}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#8B9DC3"
          roughness={0.8}
          metalness={0.1}
          clearcoat={0.1}
          transparent={false}
        />
      </Box>
      
      {/* Foundation edges for better definition */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(data.width / 1000, data.thickness / 1000, data.length / 1000)]} />
        <lineBasicMaterial color="#2D3748" linewidth={2} />
      </lineSegments>
    </group>
  );
};

// Column Component
const Column: React.FC<{
  data: ColumnData;
  visible: boolean;
}> = ({ data, visible }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  if (!visible) return null;

  const renderColumnShape = () => {
    switch (data.shape) {
      case 'rectangular':
        return (
          <Box
            ref={meshRef}
            args={[data.width / 1000, data.height / 1000, data.depth / 1000]}
            position={[0, data.height / 2000, 0]}
          >
            <meshPhysicalMaterial
              color="#4A90E2"
              roughness={0.7}
              metalness={0.1}
              clearcoat={0.2}
            />
          </Box>
        );
      
      case 'circular':
        return (
          <Cylinder
            ref={meshRef}
            args={[data.diameter / 2000, data.diameter / 2000, data.height / 1000, 32]}
            position={[0, data.height / 2000, 0]}
          >
            <meshPhysicalMaterial
              color="#4A90E2"
              roughness={0.7}
              metalness={0.1}
              clearcoat={0.2}
            />
          </Cylinder>
        );
      
      default:
        return (
          <Box
            ref={meshRef}
            args={[data.width / 1000, data.height / 1000, data.depth / 1000]}
            position={[0, data.height / 2000, 0]}
          >
            <meshPhysicalMaterial
              color="#4A90E2"
              roughness={0.7}
              metalness={0.1}
              clearcoat={0.2}
            />
          </Box>
        );
    }
  };

  return (
    <group>
      {renderColumnShape()}
      
      {/* Column edges */}
      <lineSegments position={[0, data.height / 2000, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(data.width / 1000, data.height / 1000, data.depth / 1000)]} />
        <lineBasicMaterial color="#1A365D" linewidth={2} />
      </lineSegments>
    </group>
  );
};

// Main Bars Component
const MainBars: React.FC<{
  columnData: ColumnData;
  reinforcementData: any;
  visible: boolean;
}> = ({ columnData, reinforcementData, visible }) => {
  if (!visible) return null;

  const cover = reinforcementData.column.mainBars.cover;
  const effectiveWidth = columnData.width - 2 * cover;
  const effectiveDepth = columnData.depth - 2 * cover;
  const count = reinforcementData.column.mainBars.count;
  const diameter = reinforcementData.column.mainBars.diameter;
  
  const bars = useMemo(() => {
    const barPositions = [];
    const barsPerSide = Math.ceil(Math.sqrt(count));
    const barSpacingX = effectiveWidth / (barsPerSide - 1);
    const barSpacingZ = effectiveDepth / (barsPerSide - 1);
    
    for (let i = 0; i < barsPerSide && i * barsPerSide < count; i++) {
      for (let j = 0; j < barsPerSide && i * barsPerSide + j < count; j++) {
        const barX = (-effectiveWidth/2 + i * barSpacingX) / 1000;
        const barZ = (-effectiveDepth/2 + j * barSpacingZ) / 1000;
        barPositions.push({ x: barX, z: barZ });
      }
    }
    return barPositions;
  }, [effectiveWidth, effectiveDepth, count]);

  return (
    <group>
      {bars.map((pos, index) => (
        <Cylinder
          key={index}
          args={[diameter / 2000, diameter / 2000, columnData.height / 1000, 8]}
          position={[pos.x, columnData.height / 2000, pos.z]}
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.8}
            roughness={0.2}
          />
        </Cylinder>
      ))}
    </group>
  );
};

// Stirrups Component
const Stirrups: React.FC<{
  columnData: ColumnData;
  reinforcementData: any;
  visible: boolean;
}> = ({ columnData, reinforcementData, visible }) => {
  if (!visible) return null;

  const cover = reinforcementData.column.mainBars.cover;
  const effectiveWidth = columnData.width - 2 * cover;
  const effectiveDepth = columnData.depth - 2 * cover;
  const spacing = reinforcementData.column.stirrups.spacing;
  const diameter = reinforcementData.column.stirrups.diameter;
  
  const stirrupPositions = useMemo(() => {
    const positions = [];
    const numStirrupsVisible = Math.min(12, Math.floor(columnData.height / spacing));
    const stirrupInterval = columnData.height / (numStirrupsVisible + 1);
    
    for (let i = 1; i <= numStirrupsVisible; i++) {
      positions.push(i * stirrupInterval);
    }
    return positions;
  }, [columnData.height, spacing]);

  return (
    <group>
      {stirrupPositions.map((yPos, index) => (
        <group key={index} position={[0, yPos / 1000, 0]}>
          {/* Stirrup rectangle made of 4 cylinders */}
          <Cylinder
            args={[diameter / 2000, diameter / 2000, effectiveWidth / 1000, 6]}
            position={[0, 0, -effectiveDepth / 2000]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#E53E3E" metalness={0.7} roughness={0.3} />
          </Cylinder>
          <Cylinder
            args={[diameter / 2000, diameter / 2000, effectiveWidth / 1000, 6]}
            position={[0, 0, effectiveDepth / 2000]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#E53E3E" metalness={0.7} roughness={0.3} />
          </Cylinder>
          <Cylinder
            args={[diameter / 2000, diameter / 2000, effectiveDepth / 1000, 6]}
            position={[-effectiveWidth / 2000, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#E53E3E" metalness={0.7} roughness={0.3} />
          </Cylinder>
          <Cylinder
            args={[diameter / 2000, diameter / 2000, effectiveDepth / 1000, 6]}
            position={[effectiveWidth / 2000, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#E53E3E" metalness={0.7} roughness={0.3} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
};

// Mesh Component
const ReinforcementMesh: React.FC<{
  foundationData: FoundationData;
  reinforcementData: any;
  visible: boolean;
}> = ({ foundationData, reinforcementData, visible }) => {
  if (!visible || !reinforcementData.footing.mesh.enabled) return null;

  const meshSize = reinforcementData.footing.mesh.meshSize;
  const barSize = reinforcementData.footing.mesh.barSize;
  
  const meshLines = useMemo(() => {
    const lines = [];
    const w = foundationData.width / 2000;
    const l = foundationData.length / 2000;
    
    // X-direction lines
    for (let x = -w; x <= w; x += meshSize / 1000) {
      lines.push({
        start: [x, -0.01, -l],
        end: [x, -0.01, l],
        direction: 'x'
      });
    }
    
    // Z-direction lines
    for (let z = -l; z <= l; z += meshSize / 1000) {
      lines.push({
        start: [-w, -0.01, z],
        end: [w, -0.01, z],
        direction: 'z'
      });
    }
    
    return lines;
  }, [foundationData.width, foundationData.length, meshSize]);

  return (
    <group>
      {meshLines.map((line, index) => {
        const length = line.direction === 'x' 
          ? foundationData.length / 1000 
          : foundationData.width / 1000;
        const midPoint = [
          (line.start[0] + line.end[0]) / 2,
          (line.start[1] + line.end[1]) / 2,
          (line.start[2] + line.end[2]) / 2
        ];
        
        return (
          <Cylinder
            key={index}
            args={[barSize / 2000, barSize / 2000, length, 6]}
            position={midPoint}
            rotation={line.direction === 'x' ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial
              color="#38A169"
              metalness={0.6}
              roughness={0.4}
              transparent
              opacity={0.8}
            />
          </Cylinder>
        );
      })}
    </group>
  );
};

// Dimensions Component
const Dimensions: React.FC<{
  foundationData: FoundationData;
  columnData: ColumnData;
  unitSystem: 'metric' | 'imperial';
}> = ({ foundationData, columnData, unitSystem }) => {
  const unit = unitSystem === 'metric' ? 'mm' : 'in';
  
  return (
    <group>
      {/* Foundation width dimension */}
      <Html
        position={[0, -foundationData.thickness / 1000 - 0.2, -foundationData.length / 2000 - 0.3]}
        center
      >
        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
          {foundationData.width}{unit}
        </div>
      </Html>
      
      {/* Foundation length dimension */}
      <Html
        position={[-foundationData.width / 2000 - 0.3, -foundationData.thickness / 1000 - 0.2, 0]}
        center
      >
        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg transform -rotate-90">
          {foundationData.length}{unit}
        </div>
      </Html>
      
      {/* Column height dimension */}
      <Html
        position={[columnData.width / 2000 + 0.3, columnData.height / 2000, 0]}
        center
      >
        <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg transform -rotate-90">
          {columnData.height}{unit}
        </div>
      </Html>
    </group>
  );
};

// Camera Controller Component
const CameraController: React.FC<{
  viewAngle: string;
  projection: string;
  zoom: number;
  foundationData: FoundationData;
  columnData: ColumnData;
}> = ({ viewAngle, projection, zoom, foundationData, columnData }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>();
  
  // Calculate bounding box for auto-fit
  const boundingBox = useMemo(() => {
    const maxDim = Math.max(
      foundationData.width / 1000,
      foundationData.length / 1000,
      (foundationData.thickness + columnData.height) / 1000
    );
    return maxDim * 1.5; // Add some padding
  }, [foundationData, columnData]);

  useEffect(() => {
    if (!controlsRef.current) return;

    const distance = boundingBox * zoom;
    let position: [number, number, number];
    let target: [number, number, number] = [0, 0, 0];

    switch (viewAngle) {
      case 'top':
        position = [0, distance, 0];
        break;
      case 'front':
        position = [0, 0, distance];
        break;
      case 'side':
        position = [distance, 0, 0];
        break;
      case 'isometric':
      default:
        position = [distance * 0.7, distance * 0.7, distance * 0.7];
        break;
    }

    camera.position.set(...position);
    controlsRef.current.target.set(...target);
    controlsRef.current.update();
  }, [viewAngle, zoom, boundingBox, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      dampingFactor={0.05}
      enableDamping={true}
      maxDistance={boundingBox * 3}
      minDistance={boundingBox * 0.1}
    />
  );
};

// Main Scene Component
const Scene: React.FC<{
  foundationData: FoundationData;
  columnData: ColumnData;
  reinforcementData: any;
  settings: any;
  unitSystem: 'metric' | 'imperial';
}> = ({ foundationData, columnData, reinforcementData, settings, unitSystem }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.5}
      />

      {/* Environment */}
      <Environment preset="city" />
      
      {/* Grid */}
      <Grid
        position={[0, -foundationData.thickness / 1000 - 0.1, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Foundation */}
      <Foundation
        data={foundationData}
        visible={settings.showConcrete}
      />

      {/* Column */}
      <Column
        data={columnData}
        visible={settings.showConcrete}
      />

      {/* Main Bars */}
      <MainBars
        columnData={columnData}
        reinforcementData={reinforcementData}
        visible={settings.showMainBars}
      />

      {/* Stirrups */}
      <Stirrups
        columnData={columnData}
        reinforcementData={reinforcementData}
        visible={settings.showStirrupsAndTies}
      />

      {/* Mesh */}
      <ReinforcementMesh
        foundationData={foundationData}
        reinforcementData={reinforcementData}
        visible={settings.showMesh}
      />

      {/* Dimensions */}
      <Dimensions
        foundationData={foundationData}
        columnData={columnData}
        unitSystem={unitSystem}
      />

      {/* Camera Controller */}
      <CameraController
        viewAngle={settings.viewAngle}
        projection={settings.projection}
        zoom={settings.zoom || 1}
        foundationData={foundationData}
        columnData={columnData}
      />
    </>
  );
};

// Main Viewer3D Component
export const Viewer3D: React.FC<Viewer3DProps> = ({
  foundationData,
  columnData,
  reinforcementData,
  settings,
  unitSystem
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-indigo-900 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading 3D Scene...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-indigo-900 rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{
          fov: 50,
          near: 0.1,
          far: 1000,
          position: [3, 3, 3]
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene
          foundationData={foundationData}
          columnData={columnData}
          reinforcementData={reinforcementData}
          settings={settings}
          unitSystem={unitSystem}
        />
      </Canvas>
      
      {/* Loading overlay for scene updates */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>3D Scene Active</span>
        </div>
      </div>
    </div>
  );
};