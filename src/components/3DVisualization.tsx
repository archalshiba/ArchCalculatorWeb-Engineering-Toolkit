import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Eye, Settings } from 'lucide-react';

interface Visualization3DProps {
  width: number;
  depth: number;
  height: number;
  mainBars: number;
  stirrupSpacing: number;
  clearCover: number;
  className?: string;
}

interface ViewSettings {
  showReinforcement: boolean;
  showDimensions: boolean;
  showStirrupSpacing: boolean;
  wireframe: boolean;
  exploded: boolean;
}

export const Visualization3D: React.FC<Visualization3DProps> = ({
  width,
  depth,
  height,
  mainBars,
  stirrupSpacing,
  clearCover,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 20, y: 45 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    showReinforcement: true,
    showDimensions: true,
    showStirrupSpacing: true,
    wireframe: false,
    exploded: false
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
  }, [width, depth, height, mainBars, stirrupSpacing, clearCover, rotation, zoom, viewSettings]);

  const drawColumn = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Calculate scale to fit column in canvas
    const maxDimension = Math.max(width, depth, height);
    const scale = Math.min(canvasWidth, canvasHeight) * 0.6 / maxDimension * zoom;
    
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

    // Define column vertices (centered at origin)
    const w = width / 2;
    const d = depth / 2;
    const h = height / 2;
    
    const vertices = [
      // Bottom face
      { x: -w, y: -h, z: -d },
      { x: w, y: -h, z: -d },
      { x: w, y: -h, z: d },
      { x: -w, y: -h, z: d },
      // Top face
      { x: -w, y: h, z: -d },
      { x: w, y: h, z: -d },
      { x: w, y: h, z: d },
      { x: -w, y: h, z: d }
    ];

    // Project all vertices
    const projectedVertices = vertices.map(v => project3D(v.x, v.y, v.z));

    // Define faces (indices into vertices array)
    const faces = [
      [0, 1, 2, 3], // Bottom
      [4, 7, 6, 5], // Top
      [0, 4, 5, 1], // Front
      [2, 6, 7, 3], // Back
      [1, 5, 6, 2], // Right
      [0, 3, 7, 4]  // Left
    ];

    // Sort faces by average Z depth for proper rendering
    const facesWithDepth = faces.map(face => {
      const avgZ = face.reduce((sum, idx) => sum + projectedVertices[idx].z, 0) / face.length;
      return { face, avgZ };
    });
    facesWithDepth.sort((a, b) => a.avgZ - b.avgZ);

    // Draw concrete column
    facesWithDepth.forEach(({ face }, index) => {
      ctx.beginPath();
      face.forEach((vertexIndex, i) => {
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
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Apply shading based on face orientation
        const lightness = 0.7 + (index / facesWithDepth.length) * 0.3;
        ctx.fillStyle = `rgba(156, 163, 175, ${lightness})`;
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw reinforcement if enabled
    if (viewSettings.showReinforcement) {
      drawReinforcement(ctx, project3D, scale);
    }

    // Draw dimensions if enabled
    if (viewSettings.showDimensions) {
      drawDimensions(ctx, projectedVertices, scale);
    }
  };

  const drawReinforcement = (ctx: CanvasRenderingContext2D, project3D: Function, scale: number) => {
    const effectiveCover = clearCover + 8; // Assuming 8mm stirrup diameter
    const effectiveWidth = width - 2 * effectiveCover;
    const effectiveDepth = depth - 2 * effectiveCover;
    
    // Draw main reinforcement bars
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    
    // Calculate bar positions (simplified for rectangular arrangement)
    const barsPerSide = Math.ceil(Math.sqrt(mainBars));
    const barSpacingX = effectiveWidth / (barsPerSide - 1);
    const barSpacingZ = effectiveDepth / (barsPerSide - 1);
    
    for (let i = 0; i < barsPerSide; i++) {
      for (let j = 0; j < barsPerSide; j++) {
        if (i * barsPerSide + j >= mainBars) break;
        
        const barX = -effectiveWidth/2 + i * barSpacingX;
        const barZ = -effectiveDepth/2 + j * barSpacingZ;
        
        const topPoint = project3D(barX, height/2 - effectiveCover, barZ);
        const bottomPoint = project3D(barX, -height/2 + effectiveCover, barZ);
        
        ctx.beginPath();
        ctx.moveTo(topPoint.x, topPoint.y);
        ctx.lineTo(bottomPoint.x, bottomPoint.y);
        ctx.stroke();
        
        // Draw bar end circles
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(topPoint.x, topPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bottomPoint.x, bottomPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw stirrups if spacing is shown
    if (viewSettings.showStirrupSpacing && stirrupSpacing > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      
      const numStirrupsVisible = 3; // Show a few stirrups for visualization
      const stirrupInterval = height / (numStirrupsVisible + 1);
      
      for (let i = 1; i <= numStirrupsVisible; i++) {
        const stirrupY = -height/2 + i * stirrupInterval;
        
        // Draw rectangular stirrup
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
    }
  };

  const drawDimensions = (ctx: CanvasRenderingContext2D, projectedVertices: any[], scale: number) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Draw width dimension
    const bottomLeft = projectedVertices[0];
    const bottomRight = projectedVertices[1];
    const midX = (bottomLeft.x + bottomRight.x) / 2;
    const dimY = bottomLeft.y + 30;
    
    ctx.beginPath();
    ctx.moveTo(bottomLeft.x, bottomLeft.y + 10);
    ctx.lineTo(bottomLeft.x, dimY);
    ctx.moveTo(bottomRight.x, bottomRight.y + 10);
    ctx.lineTo(bottomRight.x, dimY);
    ctx.moveTo(bottomLeft.x, dimY);
    ctx.lineTo(bottomRight.x, dimY);
    ctx.stroke();
    
    ctx.fillText(`${width}mm`, midX, dimY + 15);
    
    // Draw height dimension
    const topLeft = projectedVertices[4];
    const midY = (bottomLeft.y + topLeft.y) / 2;
    const dimX = bottomLeft.x - 30;
    
    ctx.beginPath();
    ctx.moveTo(bottomLeft.x - 10, bottomLeft.y);
    ctx.lineTo(dimX, bottomLeft.y);
    ctx.moveTo(topLeft.x - 10, topLeft.y);
    ctx.lineTo(dimX, topLeft.y);
    ctx.moveTo(dimX, bottomLeft.y);
    ctx.lineTo(dimX, topLeft.y);
    ctx.stroke();
    
    ctx.save();
    ctx.translate(dimX - 15, midY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${height}mm`, 0, 0);
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation({ x: 20, y: 45 });
    setZoom(1);
  };

  const toggleSetting = (setting: keyof ViewSettings) => {
    setViewSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          3D Column Visualization
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.3, prev / 1.2))}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            title="Reset View"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-80 cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {/* View Settings Panel */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center mb-2">
            <Settings size={16} className="text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View</span>
          </div>
          <div className="space-y-2">
            {Object.entries(viewSettings).map(([key, value]) => (
              <label key={key} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleSetting(key as keyof ViewSettings)}
                  className="mr-2 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs px-3 py-2 rounded">
          <div className="flex items-center">
            <Move3D size={14} className="mr-2" />
            Drag to rotate • Scroll to zoom
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {width} × {depth} × {height} mm
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Main Bars:</span>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {mainBars} nos
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Stirrup Spacing:</span>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {stirrupSpacing} mm c/c
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Clear Cover:</span>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {clearCover} mm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};