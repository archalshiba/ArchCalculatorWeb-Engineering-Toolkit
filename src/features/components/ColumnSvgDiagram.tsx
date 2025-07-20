import React from 'react';

interface Rebar {
  x: number;
  y: number;
}

interface ColumnSvgDiagramProps {
  width: number;
  height: number;
  rebar: Rebar[];
}

const ColumnSvgDiagram: React.FC<ColumnSvgDiagramProps> = ({ width, height, rebar }) => (
  <svg
    width={width + 100}
    height={height + 100}
    viewBox={`0 0 ${width + 100} ${height + 100}`}
    role="img"
    aria-label="Column diagram with rebar"
    tabIndex={0}
    style={{ background: '#f8fafc', borderRadius: 16 }}
  >
    {/* Column */}
    <rect
      x={50}
      y={50}
      width={width}
      height={height}
      fill="#b0bec5"
      stroke="#263238"
      strokeWidth={4}
      rx={16}
      aria-label="Column body"
    />
    {/* Rebar */}
    {rebar.map((bar, i) => (
      <circle
        key={i}
        cx={50 + bar.x}
        cy={50 + bar.y}
        r={8}
        fill="#ff9800"
        stroke="#263238"
        strokeWidth={2}
        aria-label={`Rebar ${i + 1}`}
      />
    ))}
    {/* Dimensions */}
    <line
      x1={50}
      y1={50}
      x2={50}
      y2={50 + height}
      stroke="#1976d2"
      strokeWidth={2}
      aria-label="Column height dimension"
    />
    <text
      x={30}
      y={50 + height / 2}
      fontSize={16}
      fill="#1976d2"
      aria-label="Height label"
    >
      {height} mm
    </text>
  </svg>
);

export default ColumnSvgDiagram;
