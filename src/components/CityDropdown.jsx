import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const CityDropdown = ({ onCityChange }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure you are using the correct endpoint to get a list of all cities
    const apiUrl = `https://adapta-brasil-api.replit.app/cities`; // Adjust endpoint if needed
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    const fetchCities = async () => {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);

        // Ensure data is in the expected format
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