import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const CityDropdown = ({ onCityChange, styles }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://adapta-brasil-api.replit.app/cities`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    const fetchCities = async () => {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);

        const cityOptions = parsedData.map(city => ({
          value: city.cityName,
          label: `${city.cityName} - ${city.region}`,
        }));
        setCities(cityOptions);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    if (selectedOption) {
      onCityChange(selectedOption.value);
    }
  };

  if (error) return (
    <div className="text-red-500 text-sm">Error loading cities: {error}</div>
  );

  return (
    <Select
      value={selectedCity}
      onChange={handleCityChange}
      options={cities}
      placeholder="Search for a city..."
      isClearable
      isLoading={isLoading}
      styles={styles}
      className="city-dropdown"
      classNamePrefix="city-select"
    />
  );
};

export default CityDropdown;