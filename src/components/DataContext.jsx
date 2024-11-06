import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://adapta-brasil-api.replit.app/cities');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the fetched cities to inspect structure
        setCities(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCities();
  }, []);

  return (
    <DataContext.Provider value={{ cities }}>
      {children}
    </DataContext.Provider>
  );
};