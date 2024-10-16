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
  const [selectedHazard, setSelectedHazard] = useState("");
  const [customRiskLevels, setCustomRiskLevels] = useState({});

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

  const defineRiskLevel = (score) => {
    if (score >= 0.75) return "Very High";
    if (score >= 0.5) return "High";
    if (score >= 0.25) return "Medium";
    return "Low";
  };

  const handleCustomRiskChange = (index, newRiskLevel) => {
    setCustomRiskLevels((prev) => ({
      ...prev,
      [index]: newRiskLevel,
    }));
  };

  const getRiskLevelStyle = (score, customRisk) => {
    const riskLevel = customRisk || defineRiskLevel(score);
    switch (riskLevel) {
      case "Very High":
        return { color: "text-red-600", bar: "bg-red-500", label: "Very High" };
      case "High":
        return { color: "text-orange-500", bar: "bg-orange-500", label: "High" };
      case "Medium":
        return { color: "text-yellow-500", bar: "bg-yellow-500", label: "Medium" };
      case "Low":
      default:
        return { color: "text-blue-500", bar: "bg-blue-500", label: "Low" };
    }
  };

  const getFilledSegments = (customRisk, score) => {
    const riskLevel = customRisk || defineRiskLevel(score);
    switch (riskLevel) {
      case "Very High":
        return 4;
      case "High":
        return 3;
      case "Medium":
        return 2;
      case "Low":
      default:
        return 1;
    }
  };

  if (loading) return <p>Loading data for {selectedCity}...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  const hazards = ccraData ? [...new Set(ccraData.map((item) => item.Hazard))] : [];
  const selectedHazardData = ccraData ? ccraData.find((item) => item.Hazard === selectedHazard) : null;

  const radarData = selectedHazardData
    ? [
        { indicator: "Hazard Score", value: selectedHazardData["Climate Threat Score"] || 0 },
        { indicator: "Exposure Score", value: selectedHazardData["Exposure Score"] || 0 },
        { indicator: "Sensitivity Score", value: selectedHazardData["Sensitivity Score"] || 0 },
        { indicator: "Adaptive Capacity Score", value: selectedHazardData["Adaptive Capacity Score"] || 0 },
        { indicator: "Vulnerability Score", value: selectedHazardData["Vulnerability Score"] || 0 },
        { indicator: "Risk Score", value: selectedHazardData["Risk Score"] || 0 },
      ]
    : [];

  return (
    <div className="max-w-screen-xl mx-auto p-4 risk-assessment">
      {hazards.length > 0 && (
        <div className="mb-4">
          <label className="text-xl font-semibold text-gray-700 mr-2">
            Select Hazard:
          </label>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <CityMap selectedCity={selectedCity} />
        </div>
        <div className="lg:col-span-1">
          {selectedHazardData && radarData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
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

      {/* Top 3 Risks Cards */}
      {ccraData && ccraData.length > 0 && (
        <div className="my-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Top Risks for {selectedCity}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ccraData
              .sort((a, b) => b["Risk Score"] - a["Risk Score"])
              .slice(0, 3)
              .map((risk, index) => {
                const customRisk = customRiskLevels[index];
                const riskStyle = getRiskLevelStyle(risk["Risk Score"], customRisk);
                const filledSegments = getFilledSegments(customRisk, risk["Risk Score"]);

                return (
                  <div
                    key={index}
                    className="w-full h-full p-4 bg-white rounded-lg shadow-md flex flex-col justify-start items-start gap-4"
                  >
                    <div className="w-full flex flex-col justify-start items-start">
                      <div className="text-sm font-semibold text-gray-600">{risk.Sector}</div>
                    </div>
                    <div className="w-full flex flex-col justify-end items-start">
                      <div className="text-lg font-semibold">{risk.Hazard}</div>
                      <div className="text-sm text-gray-600">Hazard</div>
                    </div>
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-600">Risk Score</div>
                        <div className={`text-3xl font-bold ${riskStyle.color}`}>{risk["Risk Score"]?.toFixed(2)}</div>
                      </div>
                      {/* Risk Bar with dynamic segments */}
                      <div className="flex w-full gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full ${i < filledSegments ? riskStyle.bar : "bg-gray-200"}`}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-600">
                          {customRisk ? (
                            <>
                              Risk Level{" "}
                              <span className={`${riskStyle.color}`}> (customized)</span>
                            </>
                          ) : (
                            "Risk Level"
                          )}
                        </div>
                        <div className={`text-lg font-bold ${riskStyle.color}`}>{riskStyle.label}</div>
                      </div>
                    </div>
                    <div className="w-full h-0 border-t border-gray-200"></div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-600">Sensitivity</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {risk["Sensitivity Score"]?.toFixed(2) || "N/A"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-600">Hazard Score</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {risk["Climate Threat Score"]?.toFixed(2) || "N/A"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-600">Exposure</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {risk["Exposure Score"]?.toFixed(2) || "N/A"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-600">Adaptive Capacity</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {risk["Adaptive Capacity Score"]?.toFixed(2) || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Risk Assessment Table */}
      {ccraData && ccraData.length > 0 ? (
        <div className="overflow-x-auto mt-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4">CCRA for {selectedCity}</h3>
          <table className="table-auto w-full bg-white rounded-lg shadow-md mt-4 overflow-x-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Key Impact</th> {/* Changed from "Sector" */}
                <th className="px-4 py-2">Hazard</th>
                <th className="px-4 py-2">Hazard Score</th> {/* Changed from "Climate Threat Score" */}
                <th className="px-4 py-2">Exposure Score</th>
                <th className="px-4 py-2">Sensitivity Score</th>
                <th className="px-4 py-2">Adaptive Capacity Score</th>
                <th className="px-4 py-2">Vulnerability Score</th>
                <th className="px-4 py-2">Risk Score</th>
                <th className="px-4 py-2">Risk Level</th>
                <th className="px-4 py-2">Custom Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {ccraData.map((row, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="border px-4 py-2">{row.City}</td>
                  <td className="border px-4 py-2">{row.Year}</td>
                  <td className="border px-4 py-2">{row.Sector}</td> {/* Changed column name only */}
                  <td className="border px-4 py-2">{row.Hazard}</td>
                  <td className="border px-4 py-2">{row["Climate Threat Score"]?.toFixed(2)}</td> {/* Changed column name only */}
                  <td className="border px-4 py-2">{row["Exposure Score"]?.toFixed(2)}</td>
                  <td className="border px-4 py-2">{row["Sensitivity Score"]?.toFixed(2)}</td>
                  <td className="border px-4 py-2">{row["Adaptive Capacity Score"]?.toFixed(2)}</td>
                  <td className="border px-4 py-2">{row["Vulnerability Score"]?.toFixed(2)}</td>
                  <td className="border px-4 py-2">{row["Risk Score"]?.toFixed(2)}</td>
                  <td className="border px-4 py-2">{defineRiskLevel(row["Risk Score"])}</td>
                  <td className="border px-4 py-2">
                    <select
                      value={customRiskLevels[index] || defineRiskLevel(row["Risk Score"])}
                      onChange={(e) => handleCustomRiskChange(index, e.target.value)}
                      className="p-1 border rounded-md"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
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