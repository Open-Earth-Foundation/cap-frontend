import React, { useState } from "react";
import CityDropdown from "./components/CityDropdown";
import Layout from "./components/Layout";
import RiskAssessment from "./components/RiskAssessment";
import "./index.css";

const App = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [ccraData, setCcraData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch climate risk assessment data using proxy to avoid CORS issues
  const fetchCcraData = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `https://adapta-brasil-api.replit.app/process/?city=${encodeURIComponent(city)}`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      const parsedData = JSON.parse(data.contents); // Parse data from the proxy response
      setCcraData(parsedData);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler function to update selected city
  const handleCityChange = (city) => {
    setSelectedCity(city);
    if (city) {
      fetchCcraData(city); // Fetch the climate risk data when a city is selected
    }
  };

  return (
    <Layout>
      {/* Set up flexbox with min height of full screen */}
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Main Content */}
        <div className="flex-grow w-full p-6">
          <header className="text-center my-8">
            <h1 className="text-3xl font-bold text-gray-800">
              City Climate Risk Assessment
            </h1>
            <p className="mt-4 text-gray-600">
              Select a city to assess its climate risk factors
            </p>
          </header>

          <main className="max-w-screen-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            {/* City Dropdown */}
            <div className="z-10 bg-white p-4 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Select a City
              </h2>
              <CityDropdown className="z-10" onCityChange={handleCityChange} />
            </div>

            {/* Risk Assessment Section */}
            {loading && <p>Loading data for {selectedCity}...</p>}
            {error && <p>Error: {error}</p>}

            {selectedCity && ccraData.length > 0 && !loading && !error && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Risk Assessment for {selectedCity}
                </h2>
                <RiskAssessment selectedCity={selectedCity} />
              </div>
            )}
          </main>
        </div>

        {/* Sticky Footer */}
        <footer className="text-center py-4 bg-gray-200">
          <p className="text-gray-500 text-sm">
            &copy; 2024 City Climate Risk Assessment | All Rights Reserved
          </p>
        </footer>
      </div>
    </Layout>
  );
};

export default App;