import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const CityDropdown = ({ onCityChange }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = 'https://adapta-brasil-api.replit.app/cities';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    fetch(proxyUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const parsedData = JSON.parse(data.contents);
        const cityOptions = parsedData.map(city => ({
          value: city.cityName,
          label: `${city.cityName} - ${city.region}`,
        }));
        setCities(cityOptions);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption.value);
    onCityChange(selectedOption.value);
  };

  if (isLoading) return <p>Loading cities...</p>;
  if (error) return <p>Error loading cities: {error}</p>;

  return (
    <div>
      <Select
        value={cities.find(city => city.value === selectedCity)}
        onChange={handleCityChange}
        options={cities}
        placeholder="Search for a city..."
        isClearable
      />
    </div>
  );
};

export default CityDropdown;