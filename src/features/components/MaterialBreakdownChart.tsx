import React from 'react';
import Plot from 'react-plotly.js';

interface MaterialBreakdownChartProps {
  cement: number;
  sand: number;
  aggregate: number;
  water: number;
}

const MaterialBreakdownChart: React.FC<MaterialBreakdownChartProps> = ({ cement, sand, aggregate, water }) => (
  <Plot
    data={[{
      type: 'pie',
      values: [cement, sand, aggregate, water],
      labels: ['Cement', 'Sand', 'Aggregate', 'Water'],
      textinfo: 'label+percent',
      marker: {
        colors: ['#607d8b', '#ffe082', '#a5d6a7', '#81d4fa']
      }
    }]}
    layout={{
      width: 400,
      height: 300,
      title: { text: 'Material Breakdown' },
      font: { family: 'Inter, Arial, sans-serif', size: 16 },
      showlegend: true,
      paper_bgcolor: '#f8fafc',
      plot_bgcolor: '#f8fafc',
    }}
    config={{
      displayModeBar: true,
      toImageButtonOptions: {
        format: 'png',
        filename: 'material-breakdown',
        height: 300,
        width: 400,
        scale: 2
      }
    }}
    aria-label="Material breakdown chart"
  />
);

export default MaterialBreakdownChart;
