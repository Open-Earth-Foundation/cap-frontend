import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsivePie } from '@nivo/pie';
import { TitleMedium } from './Texts/Title';

const EmissionsCharts = ({ city }) => {
  const { t } = useTranslation();

  const sectorData = [
    {
      id: t('stationary_energy'),
      label: t('stationary_energy'),
      value: city.stationaryEnergyEmissions / 1000,
      color: '#FFAB51'
    },
    {
      id: t('transportation'),
      label: t('transportation'),
      value: city.transportationEmissions / 1000,
      color: '#5162FF'
    },
    {
      id: t('waste'),
      label: t('waste'),
      value: city.wasteEmissions / 1000,
      color: '#51ABFF'
    },
    {
      id: t('ippu'),
      label: t('ippu'),
      value: city.ippuEmissions / 1000,
      color: '#CFAE53'
    },
    {
      id: t('afolu'),
      label: t('afolu'),
      value: city.agricultureEmissions / 1000,
      color: '#D45252'
    },
  ];

  const scopeData = [
    {
      id: t('scope1'),
      label: t('scope1'),
      value: city.scope1Emissions / 1000,
      color: '#FFAB51'
    },
    {
      id: t('scope2'),
      label: t('scope2'),
      value: city.scope2Emissions / 1000,
      color: '#5162FF'
    },
    {
      id: t('scope3'),
      label: t('scope3'),
      value: city.scope3Emissions / 1000,
      color: '#51ABFF'
    },
  ]

  const formatValue = (value) => `${value.toFixed(2)} ${t('tCO2e')}`;

  return (
    <div className="space-y-8 ">
      <div className="space-y-8 p-4">
        <TitleMedium>{t('emissionsBySector')}</TitleMedium>
        <div className="h-[260px]">
          <ResponsivePie
            data={sectorData.filter(item => item.value !== null && !isNaN(item.value))}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            enableArcLabels={false}
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

      </div>

      <div className="space-y-8 p-4" >
        <TitleMedium>{t('emissionsByScope')}</TitleMedium>
        <div className="h-[260px]">
          <ResponsivePie
            data={scopeData.filter(item => item.value !== null && !isNaN(item.value))}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            enableArcLabels={false}
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
      </div>
    </div>
  );
};

export default EmissionsCharts;
