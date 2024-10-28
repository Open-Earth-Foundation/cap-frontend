import React, { useState } from "react";
import Hero from "./components/Hero";
import RiskAssessment from "./components/RiskAssessment";
import { exportToCSV, ExportToPDF } from "./exportUtils";
import "./index.css";

const App = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [ccraData, setCcraData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCcraData = async (city) => {
    if (!city) return;

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
      const parsedData = JSON.parse(data.contents);
      console.log("Parsed CCRA Data:", parsedData);
      setCcraData(parsedData);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSelectedCity(searchTerm);
    if (searchTerm) {
      fetchCcraData(searchTerm);
    }
  };

  const handleBack = () => {
    setSelectedCity("");
    setCcraData([]);
    setError(null);
  };

  const handleExportCSV = () => {
    exportToCSV(ccraData, `${selectedCity}_climate_risk_assessment.csv`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold">CCRA PoC</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Always show Hero component with search */}
        <Hero onSearch={handleSearch} initialCity={selectedCity} />

        {/* Show Risk Assessment if city is selected */}
        {selectedCity && (
          <RiskAssessment
            selectedCity={selectedCity}
            ccraData={ccraData}
            loading={loading}
            error={error}
            onBack={handleBack}
            onExportCSV={handleExportCSV}
            onExportPDF={() => {/* Your PDF export logic */}}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; 2024 CityCatalyst CCRA | All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default App;