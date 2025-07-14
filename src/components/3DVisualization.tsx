import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Eye, Settings, Maximize2, Minimize2 } from 'lucide-react';

interface Visualization3DProps {
  width: number;
  depth: number;
  height: number;
  mainBars: number;
  stirrupSpacing: number;
  clearCover: number;
  className?: string;
  viewAngle?: 'isometric' | 'top' | 'front' | 'side';
  projection?: 'orthographic' | 'perspective';
  zoom?: number;
  pinned?: boolean;
}

interface ViewSettings {
  showReinforcement: boolean;
  showDimensions: boolean;
  showStirrupSpacing: boolean;
  wireframe: boolean;
  exploded: boolean;
  showGrid: boolean;
  showAxes: boolean;
}

export const Visualization3D: React.FC<Visualization3DProps> = ({
  width,
  depth,
  height,
  mainBars,
  stirrupSpacing,
  clearCover,
  className = '',
  viewAngle = 'isometric',
  projection = 'perspective',
  zoom = 1,
  pinned = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    showReinforcement: true,
    showDimensions: true,
    showStirrupSpacing: true,
    wireframe: false,
    exploded: false,
    showGrid: true,
    showAxes: true
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    drawColumn(ctx, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
  }, [width, depth, height, mainBars, stirrupSpacing, clearCover, viewAngle, projection, zoom, viewSettings]);

  const drawColumn = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Calculate scale to fit column in canvas
    const maxDimension = Math.max(width, depth, height);
    const scale = Math.min(canvasWidth, canvasHeight) * 0.5 / maxDimension * zoom;

    // Set rotation based on viewAngle
    let rotation = { x: 20, y: 45 };
    switch (viewAngle) {
      case 'top':
        rotation = { x: 90, y: 0 };
        break;
      case 'front':
        rotation = { x: 0, y: 0 };
        break;
      case 'side':
        rotation = { x: 0, y: 90 };
        break;
      case 'isometric':
      default:
        rotation = { x: 20, y: 45 };
        break;
    }

    // Use projection type if needed (currently not used in canvas, but can be used for future logic)

    // Apply rotation transformations
    const radX = (rotation.x * Math.PI) / 180;
    const radY = (rotation.y * Math.PI) / 180;

    // 3D projection matrices
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
    if (viewSettings.showGrid) {
      drawGrid(ctx, project3D, scale);
    }

    // Draw axes if enabled
    if (viewSettings.showAxes) {
      drawAxes(ctx, project3D, scale);
    }

    // Define column vertices (centered at origin)
    const w = width / 2;
    const d = depth / 2;
    const h = height / 2;
    
    const explodeOffset = viewSettings.exploded ? 20 : 0;
    
    const vertices = [
      // Bottom face
      { x: -w, y: -h - explodeOffset, z: -d },
      { x: w, y: -h - explodeOffset, z: -d },
      { x: w, y: -h - explodeOffset, z: d },
      { x: -w, y: -h - explodeOffset, z: d },
      // Top face
      { x: -w, y: h + explodeOffset, z: -d },
      { x: w, y: h + explodeOffset, z: -d },
      { x: w, y: h + explodeOffset, z: d },
      { x: -w, y: h + explodeOffset, z: d }
    ];

    // Project all vertices
    const projectedVertices = vertices.map(v => project3D(v.x, v.y, v.z));

    // Define faces (indices into vertices array)
    const faces = [
      { indices: [0, 1, 2, 3], color: '#e2e8f0', name: 'Bottom' }, // Bottom
      { indices: [4, 7, 6, 5], color: '#cbd5e1', name: 'Top' }, // Top
      { indices: [0, 4, 5, 1], color: '#94a3b8', name: 'Front' }, // Front
      { indices: [2, 6, 7, 3], color: '#64748b', name: 'Back' }, // Back
      { indices: [1, 5, 6, 2], color: '#475569', name: 'Right' }, // Right
      { indices: [0, 3, 7, 4], color: '#334155', name: 'Left' }  // Left
    ];

    // Sort faces by average Z depth for proper rendering
    const facesWithDepth = faces.map(face => {
      const avgZ = face.indices.reduce((sum, idx) => sum + projectedVertices[idx].z, 0) / face.indices.length;
      return { ...face, avgZ };
    });
    facesWithDepth.sort((a, b) => a.avgZ - b.avgZ);

    // Draw concrete column
    facesWithDepth.forEach(({ indices, color, name }) => {
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

      if (viewSettings.wireframe) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Apply gradient shading
        const gradient = ctx.createLinearGradient(
          projectedVertices[indices[0]].x, projectedVertices[indices[0]].y,
          projectedVertices[indices[2]].x, projectedVertices[indices[2]].y
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, adjustBrightness(color, -20));
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Draw reinforcement if enabled
    if (viewSettings.showReinforcement) {
      drawReinforcement(ctx, project3D, scale, explodeOffset);
    }

    // Draw dimensions if enabled
    if (viewSettings.showDimensions) {
      drawDimensions(ctx, projectedVertices, scale);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, project3D: Function, scale: number) => {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    
    const gridSize = 500;
    const gridSpacing = 100;
    
    for (let i = -gridSize; i <= gridSize; i += gridSpacing) {
      // X-axis lines
      const start1 = project3D(i, -height/2 - 50, -gridSize);
      const end1 = project3D(i, -height/2 - 50, gridSize);
      ctx.beginPath();
      ctx.moveTo(start1.x, start1.y);
      ctx.lineTo(end1.x, end1.y);
      ctx.stroke();
      
      // Z-axis lines
      const start2 = project3D(-gridSize, -height/2 - 50, i);
      const end2 = project3D(gridSize, -height/2 - 50, i);
      ctx.beginPath();
      ctx.moveTo(start2.x, start2.y);
      ctx.lineTo(end2.x, end2.y);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D, project3D: Function, scale: number) => {
    const axisLength = 200;
    const origin = project3D(0, -height/2 - 100, 0);
    
    // X-axis (red)
    const xEnd = project3D(axisLength, -height/2 - 100, 0);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(xEnd.x, xEnd.y);
    ctx.stroke();
    
    // Y-axis (green)
    const yEnd = project3D(0, -height/2 - 100 + axisLength, 0);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(yEnd.x, yEnd.y);
    ctx.stroke();
    
    // Z-axis (blue)
    const zEnd = project3D(0, -height/2 - 100, axisLength);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(zEnd.x, zEnd.y);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('X', xEnd.x + 10, xEnd.y);
    ctx.fillText('Y', yEnd.x, yEnd.y - 10);
    ctx.fillText('Z', zEnd.x + 10, zEnd.y);
  };

  const drawReinforcement = (ctx: CanvasRenderingContext2D, project3D: Function, scale: number, explodeOffset: number) => {
    const effectiveCover = clearCover + 8; // Assuming 8mm stirrup diameter
    const effectiveWidth = width - 2 * effectiveCover;
    const effectiveDepth = depth - 2 * effectiveCover;
    
    // Draw main reinforcement bars with enhanced styling
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 5;
    
    // Calculate bar positions (simplified for rectangular arrangement)
    const barsPerSide = Math.ceil(Math.sqrt(mainBars));
    const barSpacingX = effectiveWidth / (barsPerSide - 1);
    const barSpacingZ = effectiveDepth / (barsPerSide - 1);
    
    for (let i = 0; i < barsPerSide; i++) {
      for (let j = 0; j < barsPerSide; j++) {
        if (i * barsPerSide + j >= mainBars) break;
        
        const barX = -effectiveWidth/2 + i * barSpacingX;
        const barZ = -effectiveDepth/2 + j * barSpacingZ;
        
        const topPoint = project3D(barX, height/2 - effectiveCover + explodeOffset, barZ);
        const bottomPoint = project3D(barX, -height/2 + effectiveCover - explodeOffset, barZ);
        
        ctx.beginPath();
        ctx.moveTo(topPoint.x, topPoint.y);
        ctx.lineTo(bottomPoint.x, bottomPoint.y);
        ctx.stroke();
        
        // Draw bar end circles with gradient
        const gradient = ctx.createRadialGradient(topPoint.x, topPoint.y, 0, topPoint.x, topPoint.y, 4);
        gradient.addColorStop(0, '#fbbf24');
        gradient.addColorStop(1, '#f59e0b');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(topPoint.x, topPoint.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bottomPoint.x, bottomPoint.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    ctx.shadowBlur = 0; // Reset shadow

    // Draw stirrups if spacing is shown
    if (viewSettings.showStirrupSpacing && stirrupSpacing > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 3;
      
      const numStirrupsVisible = Math.min(5, Math.floor(height / stirrupSpacing));
      const stirrupInterval = height / (numStirrupsVisible + 1);
      
      for (let i = 1; i <= numStirrupsVisible; i++) {
        const stirrupY = -height/2 + i * stirrupInterval;
        
        // Draw rectangular stirrup with rounded corners
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
        
        // Add stirrup hooks
        const hookLength = 10;
        corners.forEach(corner => {
          ctx.beginPath();
          ctx.arc(corner.x, corner.y, 2, 0, 2 * Math.PI);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        });
      }
      
      ctx.shadowBlur = 0; // Reset shadow
    }
  };

  const drawDimensions = (ctx: CanvasRenderingContext2D, projectedVertices: any[], scale: number) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    // Draw width dimension with enhanced styling
    const bottomLeft = projectedVertices[0];
    const bottomRight = projectedVertices[1];
    const midX = (bottomLeft.x + bottomRight.x) / 2;
    const dimY = bottomLeft.y + 40;
    
    // Dimension line
    ctx.beginPath();
    ctx.moveTo(bottomLeft.x, bottomLeft.y + 15);
    ctx.lineTo(bottomLeft.x, dimY);
    ctx.moveTo(bottomRight.x, bottomRight.y + 15);
    ctx.lineTo(bottomRight.x, dimY);
    ctx.moveTo(bottomLeft.x, dimY);
    ctx.lineTo(bottomRight.x, dimY);
    ctx.stroke();
    
    // Arrowheads
    drawArrowhead(ctx, bottomLeft.x + 10, dimY, 0);
    drawArrowhead(ctx, bottomRight.x - 10, dimY, Math.PI);
    
    // Dimension text with background
    const textWidth = ctx.measureText(`${width}mm`).width;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(midX - textWidth/2 - 5, dimY - 20, textWidth + 10, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`${width}mm`, midX, dimY - 5);
    
    // Draw height dimension
    const topLeft = projectedVertices[4];
    const midY = (bottomLeft.y + topLeft.y) / 2;
    const dimX = bottomLeft.x - 40;
    
    ctx.beginPath();
    ctx.moveTo(bottomLeft.x - 15, bottomLeft.y);
    ctx.lineTo(dimX, bottomLeft.y);
    ctx.moveTo(topLeft.x - 15, topLeft.y);
    ctx.lineTo(dimX, topLeft.y);
    ctx.moveTo(dimX, bottomLeft.y);
    ctx.lineTo(dimX, topLeft.y);
    ctx.stroke();
    
    // Arrowheads for height
    drawArrowhead(ctx, dimX, bottomLeft.y - 10, -Math.PI/2);
    drawArrowhead(ctx, dimX, topLeft.y + 10, Math.PI/2);
    
    // Height text
    ctx.save();
    ctx.translate(dimX - 25, midY);
    ctx.rotate(-Math.PI / 2);
    const heightTextWidth = ctx.measureText(`${height}mm`).width;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(-heightTextWidth/2 - 5, -10, heightTextWidth + 10, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`${height}mm`, 0, 5);
    ctx.restore();
  };

  const drawArrowhead = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    const size = 8;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size/2);
    ctx.lineTo(-size, size/2);
    ctx.closePath();
    ctx.fill();
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    // Dragging is disabled for controlled rotation
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    // No-op: rotation and zoom are controlled by props
  };

  const toggleSetting = (setting: keyof ViewSettings) => {
    setViewSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl ${className} ${pinned ? 'ring-4 ring-green-400' : ''} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Enhanced Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg mr-3">
            <Eye size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              🎯 3D Column Visualization
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Interactive 3D model with real-time updates
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
      {/* Zoom and reset buttons are disabled in controlled mode */}
      <button
        className="p-2 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-800 rounded-lg"
        title="Zoom In (controlled by parent)"
        disabled
      >
        <ZoomIn size={16} />
      </button>
      <button
        className="p-2 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-800 rounded-lg"
        title="Zoom Out (controlled by parent)"
        disabled
      >
        <ZoomOut size={16} />
      </button>
      <button
        className="p-2 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-800 rounded-lg"
        title="Reset View (controlled by parent)"
        disabled
      >
        <RotateCcw size={16} />
      </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className={`w-full cursor-move bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-indigo-900 ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {/* Enhanced View Settings Panel */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 p-4 max-w-xs">
          <div className="flex items-center mb-3">
            <Settings size={16} className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">View Settings</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(viewSettings).map(([key, value]) => (
              <label key={key} className="flex items-center text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleSetting(key as keyof ViewSettings)}
                  className="mr-2 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Enhanced Instructions */}
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-xl border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Move3D size={14} className="mr-2 text-blue-400" />
              <span>Drag to rotate</span>
            </div>
            <div className="flex items-center">
              <ZoomIn size={14} className="mr-2 text-green-400" />
              <span>Scroll to zoom</span>
            </div>
            <div className="flex items-center">
              <Eye size={14} className="mr-2 text-purple-400" />
              <span>Settings panel →</span>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isDragging && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
            Rotating...
          </div>
        )}
      </div>

      {/* Enhanced Information Panel */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-indigo-900 text-sm border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-2"></div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {width} × {depth} × {height} mm
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-2"></div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Main Bars:</span>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {mainBars} nos
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-2"></div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Stirrup Spacing:</span>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {stirrupSpacing} mm c/c
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-2"></div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Clear Cover:</span>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {clearCover} mm
              </div>
            </div>
          </div>
        </div>
        
        {/* Zoom and Rotation Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
            <span>View: {viewAngle.charAt(0).toUpperCase() + viewAngle.slice(1)}</span>
          </div>
          <div className="flex items-center space-x-2">
            {viewSettings.showReinforcement && <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs">Rebar</span>}
            {viewSettings.showDimensions && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">Dims</span>}
            {viewSettings.wireframe && <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs">Wire</span>}
          </div>
        </div>
      </div>
    </div>
  );
};