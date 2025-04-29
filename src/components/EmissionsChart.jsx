import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

const EmissionsChart = ({ city }) => {
  const { t } = useTranslation();

  const sectorData = [
    {
      id: t('stationary_energy'),
      label: t('stationary_energy'),
      value: city.stationaryEnergyEmissions / 1000,
      color: '#0088FE'
    },
    {
      id: t('transportation'),
      label: t('transportation'),
      value: city.transportationEmissions / 1000,
      color: '#00C49F'
    },
    {
      id: t('waste'),
      label: t('waste'),
      value: city.wasteEmissions / 1000,
      color: '#FFBB28'
    },
    {
      id: t('ippu'),
      label: t('ippu'),
      value: city.ippuEmissions / 1000,
      color: '#FF8042'
    },
    {
      id: t('afolu'),
      label: t('afolu'),
      value: city.agricultureEmissions / 1000,
      color: '#8884d8'
    },
  ];

  console.log('sectorData', JSON.stringify(sectorData));// TODO NINA

  const formatValue = (value) => `${value.toFixed(2)} ${t('tCO2e')}`;

  return (
    <div className="space-y-4">
      <div>
        <div className="h-[220px]">
          <ResponsivePie
            data={sectorData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            colors={{ datum: 'data.color' }}
            tooltip={({ datum }) => (
              <div className="bg-white p-2 shadow-lg rounded">
                <strong>{datum.label}</strong>
                <br />
                {formatValue(datum.value)}
              </div>
            )}
            arcLinkLabel={d => `${d.label} (${formatValue(d.value)})`}
            arcLabel={d => formatValue(d.value)}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {t('totalEmissions')}: {formatValue(city.totalEmissions / 1000)}
        </p>
      </div>

      <div className="emissions-chart">
        <h2 className="text-2xl font-bold mb-4">{t('emissionsBySector')}</h2>
        <div className="h-[400px]">
          <ResponsiveBar
            data={sectorData}
            keys={['value']}
            indexBy="label"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            colors={{ datum: 'data.color' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: t('sector'),
              legendPosition: 'middle',
              legendOffset: 45
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: t('tCO2e'),
              legendPosition: 'middle',
              legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            tooltip={({ value, color, indexValue }) => (
              <div className="bg-white p-2 shadow-lg rounded">
                <strong>{indexValue}</strong>
                <br />
                {formatValue(value)}
              </div>
            )}
            valueFormat={value => formatValue(value)}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default EmissionsChart;
