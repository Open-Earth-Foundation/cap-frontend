import React, { useState, useEffect } from "react";
import CityMap from "./CityMap"; // Import the CityMap component
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const RiskAssessment = ({ selectedCity }) => {
  const [loading, setLoading] = useState(true);
  const [ccraData, setCcraData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedHazard, setSelectedHazard] = useState(""); // For hazard selection

  useEffect(() => {
    if (!selectedCity) return;

    setLoading(true);
    setError(null);

    const apiUrl = `https://adapta-brasil-api.replit.app/process/?city=${encodeURIComponent(selectedCity)}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    const fetchCityData = async () => {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);
        setCcraData(parsedData);
        setLoading(false);
        setSelectedHazard(parsedData[0].Hazard); // Set initial hazard to the first one
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCityData();
  }, [selectedCity]);

  if (loading) return <p>Loading data for {selectedCity}...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  // Extract the hazards for the dropdown
  const hazards = ccraData ? [...new Set(ccraData.map((item) => item.Hazard))] : [];

  // Find data for the selected hazard
  const selectedHazardData = ccraData
    ? ccraData.find((item) => item.Hazard === selectedHazard)
    : null;

  // Prepare data for the radar chart
  const radarData = selectedHazardData
    ? [
        { indicator: "Climate Threat Score", value: selectedHazardData["Climate Threat Score"] || 0 },
        { indicator: "Exposure Score", value: selectedHazardData["Exposure Score"] || 0 },
        { indicator: "Sensitivity Score", value: selectedHazardData["Sensitivity Score"] || 0 },
        { indicator: "Adaptive Capacity Score", value: selectedHazardData["Adaptive Capacity Score"] || 0 },
        { indicator: "Vulnerability Score", value: selectedHazardData["Vulnerability Score"] || 0 },
        { indicator: "Risk Score", value: selectedHazardData["Risk Score"] || 0 }
      ]
    : [];

  return (
    <div className="max-w-screen-xl mx-auto p-4 risk-assessment">
      {/* Render CityMap for the selected city */}
      <CityMap selectedCity={selectedCity} />

      {/* Hazard selection dropdown */}
      {hazards.length > 0 && (
        <div className="z-10 mt-4">
          <label className="text-xl font-semibold text-gray-700 mr-2">Select Hazard:</label>
          <select
            value={selectedHazard}
            onChange={(e) => setSelectedHazard(e.target.value)}
            className="p-2 border rounded-md"
          >
            {hazards.map((hazard, index) => (
              <option key={index} value={hazard}>
                {hazard}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Render RadarChart for the selected hazard */}
      {selectedHazardData && radarData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Radar Chart for {selectedHazard}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="indicator" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              <Radar name="Risk Assessment" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Risk Assessment Table */}
      {ccraData && ccraData.length > 0 ? (
        <div className="overflow-x-auto mt-8">
          <table className="table-auto w-full bg-white rounded-lg shadow-md mt-4 overflow-x-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Sector</th>
                <th className="px-4 py-2">Hazard</th>
                <th className="px-4 py-2">Climate Threat Score</th>
                <th className="px-4 py-2">Exposure Score</th>
                <th className="px-4 py-2">Sensitivity Score</th>
                <th className="px-4 py-2">Adaptive Capacity Score</th>
                <th className="px-4 py-2">Vulnerability Score</th>
                <th className="px-4 py-2">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {ccraData.map((row, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="border px-4 py-2">{row.City}</td>
                  <td className="border px-4 py-2">{row.Year}</td>
                  <td className="border px-4 py-2">{row.Sector}</td>
                  <td className="border px-4 py-2">{row.Hazard}</td>
                  <td className="border px-4 py-2">
                    {row["Climate Threat Score"] !== null
                      ? row["Climate Threat Score"].toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {row["Exposure Score"] !== null
                      ? row["Exposure Score"].toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {row["Sensitivity Score"] !== null
                      ? row["Sensitivity Score"].toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {row["Adaptive Capacity Score"] !== null
                      ? row["Adaptive Capacity Score"].toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {row["Vulnerability Score"] !== null
                      ? row["Vulnerability Score"].toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {row["Risk Score"] !== null
                      ? row["Risk Score"].toFixed(2)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available for {selectedCity}.</p>
      )}
    </div>
  );
};

export default RiskAssessment;