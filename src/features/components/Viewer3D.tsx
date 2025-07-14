import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, Move3D, Eye } from 'lucide-react';
// ...existing code...
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
  };
  unitSystem: 'metric' | 'imperial';
}

export const Viewer3D: React.FC<Viewer3DProps> = ({
  foundationData,
  columnData,
  reinforcementData,
  settings,
  unitSystem
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'rotate' | 'pan'>('rotate');
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 20, y: 45 });
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawFoundationAndColumn(ctx, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
  }, [foundationData, columnData, reinforcementData, settings, rotation, pan]);

  const drawFoundationAndColumn = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Pan and rotation
    const centerX = canvasWidth / 2 + pan.x;
    const centerY = canvasHeight / 2 + pan.y;
    // Calculate scale to fit both foundation and column
    const maxDimension = Math.max(
      foundationData.width, 
      foundationData.length, 
      foundationData.thickness + columnData.height
    );
    const scale = Math.min(canvasWidth, canvasHeight) * 0.3 / maxDimension * (settings.zoom ?? 1);
    // Use rotation state
    const radX = (rotation.x * Math.PI) / 180;
    const radY = (rotation.y * Math.PI) / 180;
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const project3D = (x: number, y: number, z: number) => {
      // Apply rotation
      const rotatedY = y * cosX - z * sinX;
      const rotatedZ = y * sinX + z * cosX;
      const rotatedX = x * cosY + rotatedZ * sinY;
      const finalZ = -x * sinY + rotatedZ * cosY;
      // Project to 2D
      const projectedX = centerX + rotatedX * scale;
      const projectedY = centerY - rotatedY * scale;
      return { x: projectedX, y: projectedY, z: finalZ };
    };

    // Draw grid if enabled
    if (settings.showConcrete) {
      drawGrid(ctx, project3D, scale);
    }

    // Draw foundation
    if (settings.showConcrete) {
      drawFoundation(ctx, project3D);
    }

    // Draw column
    if (settings.showConcrete) {
      drawColumn(ctx, project3D);
    }

    // Draw reinforcement
    if (settings.showMainBars || settings.showStirrupsAndTies || settings.showMesh) {
      drawReinforcement(ctx, project3D);
    }

    // Draw dimensions
    drawDimensions(ctx, project3D, scale);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, project3D: Function, scale: number) => {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    
    const gridSize = Math.max(foundationData.width, foundationData.length) * 1.5;
    const gridSpacing = Math.max(foundationData.width, foundationData.length) / 10;
    
    for (let i = -gridSize; i <= gridSize; i += gridSpacing) {
      // X-axis lines
      const start1 = project3D(i, -foundationData.thickness - 50, -gridSize);
      const end1 = project3D(i, -foundationData.thickness - 50, gridSize);
      ctx.beginPath();
      ctx.moveTo(start1.x, start1.y);
      ctx.lineTo(end1.x, end1.y);
      ctx.stroke();
      
      // Z-axis lines
      const start2 = project3D(-gridSize, -foundationData.thickness - 50, i);
      const end2 = project3D(gridSize, -foundationData.thickness - 50, i);
      ctx.beginPath();
      ctx.moveTo(start2.x, start2.y);
      ctx.lineTo(end2.x, end2.y);
      ctx.stroke();
    }
  };

  const drawFoundation = (ctx: CanvasRenderingContext2D, project3D: Function) => {
    const w = foundationData.width / 2;
    const l = foundationData.length / 2;
    const t = foundationData.thickness;
    
    const vertices = [
      // Bottom face
      { x: -w, y: -t, z: -l },
      { x: w, y: -t, z: -l },
      { x: w, y: -t, z: l },
      { x: -w, y: -t, z: l },
      // Top face
      { x: -w, y: 0, z: -l },
      { x: w, y: 0, z: -l },
      { x: w, y: 0, z: l },
      { x: -w, y: 0, z: l }
    ];

    const projectedVertices = vertices.map(v => project3D(v.x, v.y, v.z));

    const faces = [
      { indices: [0, 1, 2, 3], color: '#94a3b8' }, // Bottom
      { indices: [4, 7, 6, 5], color: '#cbd5e1' }, // Top
      { indices: [0, 4, 5, 1], color: '#64748b' }, // Front
      { indices: [2, 6, 7, 3], color: '#475569' }, // Back
      { indices: [1, 5, 6, 2], color: '#334155' }, // Right
      { indices: [0, 3, 7, 4], color: '#1e293b' }  // Left
    ];

    // Sort faces by depth
    const facesWithDepth = faces.map(face => {
      const avgZ = face.indices.reduce((sum, idx) => sum + projectedVertices[idx].z, 0) / face.indices.length;
      return { ...face, avgZ };
    });
    facesWithDepth.sort((a, b) => a.avgZ - b.avgZ);

    // Draw foundation faces
    facesWithDepth.forEach(({ indices, color }) => {
      ctx.beginPath();
      indices.forEach((vertexIndex, i) => {
        const vertex = projectedVertices[vertexIndex];
        if (i === 0) {
          ctx.moveTo(vertex.x, vertex.y);
        } else {
          ctx.lineTo(vertex.x, vertex.y);
        }
      });
      ctx.closePath();

      const gradient = ctx.createLinearGradient(
        projectedVertices[indices[0]].x, projectedVertices[indices[0]].y,
        projectedVertices[indices[2]].x, projectedVertices[indices[2]].y
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, adjustBrightness(color, -20));
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  const drawColumn = (ctx: CanvasRenderingContext2D, project3D: Function) => {
    let vertices: any[] = [];

    switch (columnData.shape) {
      case 'rectangular':
        const w = columnData.width / 2;
        const d = columnData.depth / 2;
        const h = columnData.height;
        
        vertices = [
          // Bottom face
          { x: -w, y: 0, z: -d },
          { x: w, y: 0, z: -d },
          { x: w, y: 0, z: d },
          { x: -w, y: 0, z: d },
          // Top face
          { x: -w, y: h, z: -d },
          { x: w, y: h, z: -d },
          { x: w, y: h, z: d },
          { x: -w, y: h, z: d }
        ];
        break;
      
      case 'circular':
        const radius = columnData.diameter / 2;
        const segments = 16;
        const h_circ = columnData.height;
        
        vertices = [];
        // Bottom circle
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * 2 * Math.PI;
          vertices.push({
            x: radius * Math.cos(angle),
            y: 0,
            z: radius * Math.sin(angle)
          });
        }
        // Top circle
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * 2 * Math.PI;
          vertices.push({
            x: radius * Math.cos(angle),
            y: h_circ,
            z: radius * Math.sin(angle)
          });
        }
        break;
    }

    const projectedVertices = vertices.map(v => project3D(v.x, v.y, v.z));

    if (columnData.shape === 'rectangular') {
      const faces = [
        { indices: [0, 1, 2, 3], color: '#3b82f6' }, // Bottom
        { indices: [4, 7, 6, 5], color: '#60a5fa' }, // Top
        { indices: [0, 4, 5, 1], color: '#2563eb' }, // Front
        { indices: [2, 6, 7, 3], color: '#1d4ed8' }, // Back
        { indices: [1, 5, 6, 2], color: '#1e40af' }, // Right
        { indices: [0, 3, 7, 4], color: '#1e3a8a' }  // Left
      ];

      const facesWithDepth = faces.map(face => {
        const avgZ = face.indices.reduce((sum, idx) => sum + projectedVertices[idx].z, 0) / face.indices.length;
        return { ...face, avgZ };
      });
      facesWithDepth.sort((a, b) => a.avgZ - b.avgZ);

      facesWithDepth.forEach(({ indices, color }) => {
        ctx.beginPath();
        indices.forEach((vertexIndex, i) => {
          const vertex = projectedVertices[vertexIndex];
          if (i === 0) {
            ctx.moveTo(vertex.x, vertex.y);
          } else {
            ctx.lineTo(vertex.x, vertex.y);
          }
        });
        ctx.closePath();

        const gradient = ctx.createLinearGradient(
          projectedVertices[indices[0]].x, projectedVertices[indices[0]].y,
          projectedVertices[indices[2]].x, projectedVertices[indices[2]].y
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, adjustBrightness(color, -20));
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  };

  const drawReinforcement = (ctx: CanvasRenderingContext2D, project3D: Function) => {
    if (settings.showMainBars) {
      drawMainBars(ctx, project3D);
    }
    
    if (settings.showStirrupsAndTies) {
      drawStirrupsAndTies(ctx, project3D);
    }
    
    if (settings.showMesh) {
      drawMesh(ctx, project3D);
    }
  };

  const drawMainBars = (ctx: CanvasRenderingContext2D, project3D: Function) => {
    const cover = reinforcementData.column.mainBars.cover;
    const effectiveWidth = columnData.width - 2 * cover;
    const effectiveDepth = columnData.depth - 2 * cover;
    const count = reinforcementData.column.mainBars.count;
    
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    
    // Calculate bar positions for rectangular arrangement
    const barsPerSide = Math.ceil(Math.sqrt(count));
    const barSpacingX = effectiveWidth / (barsPerSide - 1);
    const barSpacingZ = effectiveDepth / (barsPerSide - 1);
    
    for (let i = 0; i < barsPerSide && i * barsPerSide < count; i++) {
      for (let j = 0; j < barsPerSide && i * barsPerSide + j < count; j++) {
        const barX = -effectiveWidth/2 + i * barSpacingX;
        const barZ = -effectiveDepth/2 + j * barSpacingZ;
        
        const topPoint = project3D(barX, columnData.height - cover, barZ);
        const bottomPoint = project3D(barX, cover, barZ);
        
        ctx.beginPath();
        ctx.moveTo(topPoint.x, topPoint.y);
        ctx.lineTo(bottomPoint.x, bottomPoint.y);
        ctx.stroke();
        
        // Draw bar end circles
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(topPoint.x, topPoint.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bottomPoint.x, bottomPoint.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const drawStirrupsAndTies = (ctx: CanvasRenderingContext2D, project3D: Function) => {
    const cover = reinforcementData.column.mainBars.cover;
    const effectiveWidth = columnData.width - 2 * cover;
    const effectiveDepth = columnData.depth - 2 * cover;
    const spacing = reinforcementData.column.stirrups.spacing;
    
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    
    const numStirrupsVisible = Math.min(8, Math.floor(columnData.height / spacing));
    const stirrupInterval = columnData.height / (numStirrupsVisible + 1);
    
    for (let i = 1; i <= numStirrupsVisible; i++) {
      const stirrupY = i * stirrupInterval;
      
      const corners = [
        project3D(-effectiveWidth/2, stirrupY, -effectiveDepth/2),
        project3D(effectiveWidth/2, stirrupY, -effectiveDepth/2),
        project3D(effectiveWidth/2, stirrupY, effectiveDepth/2),
        project3D(-effectiveWidth/2, stirrupY, effectiveDepth/2)
      ];
      
      ctx.beginPath();
      corners.forEach((corner, index) => {
        if (index === 0) {
          ctx.moveTo(corner.x, corner.y);
        } else {
          ctx.lineTo(corner.x, corner.y);
        }
      });
      ctx.closePath();
      ctx.stroke();
    }
  };

  const drawMesh = (ctx: CanvasRenderingContext2D, project3D: Function) => {
    if (!reinforcementData.footing.mesh.enabled) return;
    
    const meshSize = reinforcementData.footing.mesh.meshSize;
    const w = foundationData.width / 2;
    const l = foundationData.length / 2;
    
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    
    // Draw mesh grid on foundation top
    for (let x = -w; x <= w; x += meshSize) {
      const start = project3D(x, -10, -l);
      const end = project3D(x, -10, l);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
    
    for (let z = -l; z <= l; z += meshSize) {
      const start = project3D(-w, -10, z);
      const end = project3D(w, -10, z);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  };

  const drawDimensions = (ctx: CanvasRenderingContext2D, project3D: Function, scale: number) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    const unit = unitSystem === 'metric' ? 'mm' : 'in';
    
    // Foundation dimensions
    const foundationCorners = [
      project3D(-foundationData.width/2, 0, -foundationData.length/2),
      project3D(foundationData.width/2, 0, -foundationData.length/2),
      project3D(foundationData.width/2, 0, foundationData.length/2),
      project3D(-foundationData.width/2, 0, foundationData.length/2)
    ];
    
    // Draw foundation width dimension
    const midX = (foundationCorners[0].x + foundationCorners[1].x) / 2;
    const dimY = foundationCorners[0].y + 30;
    
    ctx.beginPath();
    ctx.moveTo(foundationCorners[0].x, foundationCorners[0].y + 10);
    ctx.lineTo(foundationCorners[0].x, dimY);
    ctx.moveTo(foundationCorners[1].x, foundationCorners[1].y + 10);
    ctx.lineTo(foundationCorners[1].x, dimY);
    ctx.moveTo(foundationCorners[0].x, dimY);
    ctx.lineTo(foundationCorners[1].x, dimY);
    ctx.stroke();
    
    ctx.fillText(`${foundationData.width}${unit}`, midX, dimY + 15);
    
    // Column height dimension
    const columnBottom = project3D(columnData.width/2 + 50, 0, 0);
    const columnTop = project3D(columnData.width/2 + 50, columnData.height, 0);
    const midY = (columnBottom.y + columnTop.y) / 2;
    
    ctx.beginPath();
    ctx.moveTo(columnBottom.x - 10, columnBottom.y);
    ctx.lineTo(columnBottom.x, columnBottom.y);
    ctx.moveTo(columnTop.x - 10, columnTop.y);
    ctx.lineTo(columnTop.x, columnTop.y);
    ctx.moveTo(columnBottom.x, columnBottom.y);
    ctx.lineTo(columnBottom.x, columnTop.y);
    ctx.stroke();
    
    ctx.save();
    ctx.translate(columnBottom.x + 20, midY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${columnData.height}${unit}`, 0, 5);
    ctx.restore();
  };

  const adjustBrightness = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    if (dragMode === 'rotate') {
      setRotation(prev => ({
        x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
        y: prev.y + deltaX * 0.5
      }));
    } else if (dragMode === 'pan') {
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    }
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation({ x: 20, y: 45 });
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl ${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'}`}>
      {/* Canvas */}
      <div className="relative h-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-move bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-indigo-900 rounded-2xl"
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={e => {
            if (e.touches.length === 1) {
              setIsDragging(true);
              setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
            }
          }}
          onTouchMove={e => {
            if (isDragging && e.touches.length === 1) {
              const touch = e.touches[0];
              handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as any);
            }
          }}
          onTouchEnd={() => setIsDragging(false)}
        />
        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className={`flex items-center px-2 py-1 rounded-lg mr-2 ${dragMode === 'rotate' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setDragMode('rotate')}
                title="Rotate Mode"
              >
                <Move3D size={14} className="mr-2" />
                <span>Rotate</span>
              </button>
              <button
                className={`flex items-center px-2 py-1 rounded-lg ${dragMode === 'pan' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setDragMode('pan')}
                title="Pan Mode"
              >
                <Eye size={14} className="mr-2" />
                <span>Pan</span>
              </button>
              <button
                className="flex items-center px-2 py-1 rounded-lg bg-gray-700 text-gray-300"
                onClick={resetView}
                title="Reset View"
              >
                <RotateCcw size={14} className="mr-2" />
                <span>Reset</span>
              </button>
              <div className="flex items-center">
                <ZoomIn size={14} className="mr-2 text-green-400" />
                <span>Scroll to zoom</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span>Zoom: {(settings.zoom ? settings.zoom * 100 : 100).toFixed(0)}%</span>
              <span>•</span>
              <span>Rotation: X{rotation.x.toFixed(0)}° Y{rotation.y.toFixed(0)}°</span>
              <span>•</span>
              <span>Pan: X{pan.x.toFixed(0)} Y{pan.y.toFixed(0)}</span>
            </div>
          </div>
        </div>
        {/* Loading Indicator */}
        {isDragging && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
            {dragMode === 'rotate' ? 'Rotating...' : 'Panning...'}
          </div>
        )}
      </div>
    </div>
  );
};