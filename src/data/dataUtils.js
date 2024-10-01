import Papa from 'papaparse';

export const processCSVData = (csvData) => {
  const parsedData = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  }).data;

  const cities = [...new Set(parsedData.map(row => row.city_name))].filter(Boolean);
  const years = [...new Set(parsedData.map(row => row.indicator_year))].filter(Boolean);
  const scenarios = [...new Set(parsedData.map(row => row.scenario_name))].filter(Boolean);
  const sectors = [...new Set(parsedData.map(row => row.level_2_name))].filter(Boolean);
  const threats = [...new Set(parsedData.map(row => row.level_3_name))].filter(Boolean);

  return {
    data: parsedData,
    cities,
    years,
    scenarios,
    sectors,
    threats
  };
};

export const filterData = (data, city, year, scenario, sector, threat) => {
  return data.filter(row => 
    (city === 'all' || row.city_name === city) &&
    (year === 'all' || row.indicator_year === parseInt(year)) &&
    (scenario === 'all' || row.scenario_name === scenario) &&
    (sector === 'all' || row.level_2_name === sector) &&
    (threat === 'all' || row.level_3_name === threat)
  );
};