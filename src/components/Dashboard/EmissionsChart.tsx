import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface EmissionsChartProps {
  emissionsByCategory: Record<string, number>;
  emissionsByScope: Record<string, number>;
}

export const EmissionsChart: React.FC<EmissionsChartProps> = ({
  emissionsByCategory,
  emissionsByScope,
}) => {
  const categoryLabels: Record<string, string> = {
    energy: 'Énergie',
    transport: 'Transport',
    waste: 'Déchets',
    purchases: 'Achats',
    it: 'Informatique',
    realEstate: 'Immobilier',
  };

  const categoryColors = [
    '#059669', // green-600
    '#DC2626', // red-600
    '#D97706', // amber-600
    '#7C3AED', // violet-600
    '#2563EB', // blue-600
    '#DB2777', // pink-600
  ];

  const doughnutData = {
    labels: Object.keys(emissionsByCategory).map(key => categoryLabels[key]),
    datasets: [
      {
        data: Object.values(emissionsByCategory),
        backgroundColor: categoryColors,
        borderColor: categoryColors.map(color => color),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toFixed(1)} t CO₂e (${percentage}%)`;
          },
        },
      },
    },
  };

  const barData = {
    labels: ['Scope 1\n(Direct)', 'Scope 2\n(Électricité)', 'Scope 3\n(Indirect)'],
    datasets: [
      {
        label: 'Émissions (t CO₂e)',
        data: [emissionsByScope.scope1, emissionsByScope.scope2, emissionsByScope.scope3],
        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6'],
        borderColor: ['#DC2626', '#D97706', '#2563EB'],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toFixed(1)} t CO₂e`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + ' t';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Category Breakdown Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par catégorie
        </h3>
        <div className="h-80">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Scope Breakdown Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par scope GHG
        </h3>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="mt-4 text-xs text-gray-600 space-y-1">
          <p><strong>Scope 1:</strong> Émissions directes (combustion sur site, véhicules)</p>
          <p><strong>Scope 2:</strong> Émissions indirectes liées à l'électricité</p>
          <p><strong>Scope 3:</strong> Autres émissions indirectes (achats, transports, etc.)</p>
        </div>
      </div>
    </div>
  );
};
