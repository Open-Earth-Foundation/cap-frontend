import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

Chart.register(...registerables);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const EmissionsChart = ({ city }) => {
  const chartRef = useRef(null);
  const { t } = useTranslation();

  const sectorData = [
    { name: 'Stationary Energy', value: city.stationaryEnergyEmissions / 1000 },
    { name: 'Transportation', value: city.transportationEmissions / 1000 },
    { name: 'Waste', value: city.wasteEmissions / 1000 },
    { name: 'IPPU', value: city.ippuEmissions / 1000 },
    { name: 'Agriculture', value: city.agricultureEmissions / 1000 },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const shortName = name.split(' ')[0];
    return `${shortName} ${(percent * 100).toFixed(0)}%`;
  };

  useEffect(() => {
    if (!sectorData || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart if it exists
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sectorData.map(item => t(item.name)),
        datasets: [{
          label: t('emissions'),
          data: sectorData.map(item => item.value),
          backgroundColor: '#4B4C63',
          borderColor: '#4B4C63',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: t('emissionsUnit')
            }
          },
          x: {
            title: {
              display: true,
              text: t('sector')
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${t('emissions')}: ${context.raw} ${t('emissionsUnit')}`;
              }
            }
          }
        }
      }
    });

    // Store chart instance
    chartRef.current.chart = chart;

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [sectorData, t]);

  return (
    <div className="space-y-4">
      <div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {t('totalEmissions')}: {(city.totalEmissions / 1000).toFixed(2)} {t('emissionsUnit')}
        </p>
      </div>

      <div className="emissions-chart">
        <h2 className="text-2xl font-bold mb-4">{t('emissionsBySector')}</h2>
        <div className="chart-container" style={{ height: '400px' }}>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default EmissionsChart;
