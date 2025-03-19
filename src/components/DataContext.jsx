import React, { createContext, useState, useEffect } from "react";
import { ADAPTA_BRASIL_API } from "../utils/constants";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${ADAPTA_BRASIL_API}/cities`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCities(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCities();
  }, []);

  return (
    <DataContext.Provider value={{ cities }}>{children}</DataContext.Provider>
  );
};

