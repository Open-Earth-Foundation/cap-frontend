import React, { useState, useEffect } from "react";
import CityMap from "./CityMap"; // Import the CityMap component
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

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

  // Sort data by Risk Score and take the top 3 risks
  const top3Risks = ccraData
    ? [...ccraData]
        .sort((a, b) => (b["Risk Score"] || 0) - (a["Risk Score"] || 0))
        .slice(0, 3)
    : [];

  // Extract the hazards for the dropdown
  const hazards = ccraData
    ? [...new Set(ccraData.map((item) => item.Hazard))]
    : [];

  // Find data for the selected hazard
  const selectedHazardData = ccraData
    ? ccraData.find((item) => item.Hazard === selectedHazard)
    : null;

  // Prepare data for the radar chart
  const radarData = selectedHazardData
    ? [
        {
          indicator: "Climate Threat Score",
          value: selectedHazardData["Climate Threat Score"] || 0,
        },
        {
          indicator: "Exposure Score",
          value: selectedHazardData["Exposure Score"] || 0,
        },
        {
          indicator: "Sensitivity Score",
          value: selectedHazardData["Sensitivity Score"] || 0,
        },
        {
          indicator: "Adaptive Capacity Score",
          value: selectedHazardData["Adaptive Capacity Score"] || 0,
        },
        {
          indicator: "Vulnerability Score",
          value: selectedHazardData["Vulnerability Score"] || 0,
        },
        {
          indicator: "Risk Score",
          value: selectedHazardData["Risk Score"] || 0,
        },
      ]
    : [];

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="flex justify-between">
        {/* Map Section */}
        <div className="w-2/3 pr-4">
          <CityMap selectedCity={selectedCity} />
        </div>

        {/* Radar Chart Section */}
        <div className="w-1/3">
          {selectedHazardData && radarData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="indicator" />
                <PolarRadiusAxis angle={30} domain={[0, 1]} />
                <Radar
                  name="Risk Assessment"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top 3 Risks Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Top Risks for {selectedCity}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          {top3Risks.map((risk, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4">
              <div className="text-xs text-white bg-blue-500 rounded-full px-2 py-1 inline-block mb-2">
                {risk.Sector}
              </div>
              <h3 className="text-lg font-bold mb-2">{risk.Hazard}</h3>
              <p className="text-sm">
                <strong>Risk Score: </strong>
                <span className="text-red-500">
                  {risk["Risk Score"] ? risk["Risk Score"].toFixed(2) : "N/A"}
                </span>
              </p>
              <p className="text-sm">
                <strong>Climate Threat Score: </strong>
                {risk["Climate Threat Score"] !== null
                  ? risk["Climate Threat Score"].toFixed(2)
                  : "N/A"}
              </p>
              <p className="text-sm">
                <strong>Exposure Score: </strong>
                {risk["Exposure Score"] !== null
                  ? risk["Exposure Score"].toFixed(2)
                  : "N/A"}
              </p>
              <p className="text-sm">
                <strong>Sensitivity Score: </strong>
                {risk["Sensitivity Score"] !== null
                  ? risk["Sensitivity Score"].toFixed(2)
                  : "N/A"}
              </p>
              <p className="text-sm">
                <strong>Adaptive Capacity Score: </strong>
                {risk["Adaptive Capacity Score"] !== null
                  ? risk["Adaptive Capacity Score"].toFixed(2)
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CCRA Table Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">CCRA for {selectedCity}</h3>
        {ccraData && ccraData.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full bg-white rounded-lg shadow-md">
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
    </div>
  );
};

export default RiskAssessment;
