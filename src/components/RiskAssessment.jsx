import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import CityMap from "./CityMap";
import QualitativeAssessment from './QualitativeAssessment';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RiskAssessment = ({
  selectedCity,
  onBack,
  ccraData,
  loading,
  error,
  onExportCSV,
  onExportPDF,
}) => {
  const [selectedHazard, setSelectedHazard] = useState("");
  const [customRiskLevels, setCustomRiskLevels] = useState({});

  const defineRiskLevel = (score) => {
    if (score >= 0.75) return "Very High";
    if (score >= 0.5) return "High";
    if (score >= 0.25) return "Medium";
    return "Low";
  };

  const [selectedHazards, setSelectedHazards] = useState([]);

  // Add this function to handle hazard selection
  const toggleHazard = (hazard) => {
    setSelectedHazards((prev) =>
      prev.includes(hazard)
        ? prev.filter((h) => h !== hazard)
        : [...prev, hazard],
    );
  };

  // Initialize selected hazards with top 3 when data loads
  useEffect(() => {
    if (ccraData && ccraData.length > 0) {
      const topHazards = ccraData
        .sort((a, b) => b["Risk Score"] - a["Risk Score"])
        .slice(0, 3)
        .map((h) => h.Hazard);
      setSelectedHazards(topHazards);
    }
  }, [ccraData]);

  const getRiskColor = (score) => {
    if (score >= 0.75) return "#E80A0A"; // Very High - Red
    if (score >= 0.5) return "#E06835"; // High - Orange
    if (score >= 0.25) return "#F59E0B"; // Medium - Yellow
    return "#3B82F6"; // Low - Blue
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

  const handleCustomRiskChange = (index, newRiskLevel) => {
    setCustomRiskLevels((prev) => ({
      ...prev,
      [index]: newRiskLevel,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-gray-600">
          Loading data for {selectedCity}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  if (!ccraData || ccraData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-gray-600">
          No data available for {selectedCity}.
        </p>
      </div>
    );
  }

  const hazards = [...new Set(ccraData.map((item) => item.Hazard))];
  const selectedHazardData = ccraData.find(
    (item) => item.Hazard === (selectedHazard || hazards[0]),
  );

  const radarData = selectedHazardData
    ? [
        {
          indicator: "Hazard Score",
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
      {/* Back button and City Title */}
      <div className="flex flex-col gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to search</span>
        </button>

        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">{selectedCity}</h1>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <CityMap selectedCity={selectedCity} />
      </div>

      {/* CCRA Table Section */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-[57px] font-normal leading-tight font-poppins mb-12 mt-12">
          Climate Change Risk Assessment
        </h2>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Key Impact</th>
              <th className="px-4 py-2 text-left">Hazard</th>
              <th className="px-4 py-2 text-left">Hazard Score</th>
              <th className="px-4 py-2 text-left">Exposure Score</th>
              <th className="px-4 py-2 text-left">Sensitivity Score</th>
              <th className="px-4 py-2 text-left">Adaptive Capacity Score</th>
              <th className="px-4 py-2 text-left">Vulnerability Score</th>
              <th className="px-4 py-2 text-left">Risk Score</th>
              <th className="px-4 py-2 text-left">Risk Level</th>
              <th className="px-4 py-2 text-left">Custom Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {ccraData.map((row, index) => {
              const riskLevel = defineRiskLevel(row["Risk Score"]);
              const customRisk = customRiskLevels[index];
              const riskColor = getRiskColor(row["Risk Score"]);

              return (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row.City}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row.Year}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row.Sector}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row.Hazard}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row["Climate Threat Score"]?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row["Exposure Score"]?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row["Sensitivity Score"]?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row["Adaptive Capacity Score"]?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {row["Vulnerability Score"]?.toFixed(2)}
                  </td>
                  <td
                    className="px-4 py-2 border-b border-gray-200 font-semibold"
                    style={{ color: riskColor }}
                  >
                    {row["Risk Score"]?.toFixed(2)}
                  </td>
                  <td
                    className="px-4 py-2 border-b border-gray-200 font-semibold"
                    style={{ color: riskColor }}
                  >
                    {customRisk || riskLevel}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <select
                      value={customRisk || riskLevel}
                      onChange={(e) =>
                        handleCustomRiskChange(index, e.target.value)
                      }
                      className="w-full p-1 border rounded-md bg-white hover:border-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Top Risks Section */}
      <div className="mb-12">
        <div className="flex flex-col gap-6 mb-8">
          <h2 className="text-[57px] font-normal leading-tight font-poppins">
            Top risks in your city
          </h2>
          <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
            The risks that you should pay special attention to
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {ccraData
            .sort((a, b) => b["Risk Score"] - a["Risk Score"])
            .slice(0, 3)
            .map((risk, index) => {
              const riskScore = risk["Risk Score"];
              const riskColor = getRiskColor(riskScore);
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4"
                >
                  <div className="uppercase text-[#575757] text-xs font-semibold tracking-[1.5px] py-2">
                    {risk.Sector}
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-2xl font-semibold">{risk.Hazard}</h3>
                    <span className="text-[#575757] text-xs font-medium tracking-wide">
                      Hazard
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[#575757] text-sm font-medium">
                        Risk Score
                      </span>
                      <span
                        style={{ color: riskColor }}
                        className="text-4xl font-semibold font-inter"
                      >
                        {riskScore?.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            background:
                              i < getFilledSegments(null, riskScore)
                                ? riskColor
                                : "#E2E2E2",
                          }}
                          className="h-[5px] flex-1 rounded-full"
                        />
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#575757] text-xs font-medium tracking-wide">
                        Risk Level
                      </span>
                      <span
                        style={{ color: riskColor }}
                        className="text-base font-semibold"
                      >
                        {defineRiskLevel(riskScore)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#E4E4E4] my-2" />

                  {/* Metrics */}
                  {[
                    { label: "Sensitivity", value: risk["Sensitivity Score"] },
                    {
                      label: "Climate Threat",
                      value: risk["Climate Threat Score"],
                    },
                    { label: "Exposure", value: risk["Exposure Score"] },
                    {
                      label: "Adaptive Capacity",
                      value: risk["Adaptive Capacity Score"],
                    },
                    {
                      label: "Vulnerability",
                      value: risk["Vulnerability Score"],
                    },
                  ].map(({ label, value }, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[#575757] text-xs font-medium tracking-wide">
                        {label}
                      </span>
                      <span className="text-[#575757] text-base font-semibold">
                        {value?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      </div>

      {/* Updated Radar Chart Section */}
      <div className="mb-12">
        <div className="mx-auto">
          <div className="flex flex-col gap-6 mb-8">
            <h2 className="text-[57px] font-normal leading-tight font-poppins">
              Hazard Visualization
            </h2>
            <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
              Compare the top risks and their indicators
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            {ccraData
              .sort((a, b) => b["Risk Score"] - a["Risk Score"])
              .slice(0, 3)
              .map((hazard, index) => {
                const riskColor = getRiskColor(hazard["Risk Score"]);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`hazard-${index}`}
                      checked={selectedHazards.includes(hazard.Hazard)}
                      onChange={() => toggleHazard(hazard.Hazard)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`hazard-${index}`}
                      className="text-lg font-medium"
                      style={{ color: riskColor }}
                    >
                      {hazard.Hazard}
                    </label>
                  </div>
                );
              })}
          </div>

          <div className="h-[500px]">
            <ResponsiveContainer>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={[
                  {
                    name: "Hazard Score",
                    ...selectedHazards.reduce((acc, hazardName) => {
                      const hazard = ccraData.find(
                        (h) => h.Hazard === hazardName,
                      );
                      acc[hazardName] = hazard?.["Climate Threat Score"] || 0;
                      return acc;
                    }, {}),
                  },
                  {
                    name: "Exposure Score",
                    ...selectedHazards.reduce((acc, hazardName) => {
                      const hazard = ccraData.find(
                        (h) => h.Hazard === hazardName,
                      );
                      acc[hazardName] = hazard?.["Exposure Score"] || 0;
                      return acc;
                    }, {}),
                  },
                  {
                    name: "Sensitivity Score",
                    ...selectedHazards.reduce((acc, hazardName) => {
                      const hazard = ccraData.find(
                        (h) => h.Hazard === hazardName,
                      );
                      acc[hazardName] = hazard?.["Sensitivity Score"] || 0;
                      return acc;
                    }, {}),
                  },
                  {
                    name: "Adaptive Capacity Score",
                    ...selectedHazards.reduce((acc, hazardName) => {
                      const hazard = ccraData.find(
                        (h) => h.Hazard === hazardName,
                      );
                      acc[hazardName] =
                        hazard?.["Adaptive Capacity Score"] || 0;
                      return acc;
                    }, {}),
                  },
                  {
                    name: "Vulnerability Score",
                    ...selectedHazards.reduce((acc, hazardName) => {
                      const hazard = ccraData.find(
                        (h) => h.Hazard === hazardName,
                      );
                      acc[hazardName] = hazard?.["Vulnerability Score"] || 0;
                      return acc;
                    }, {}),
                  },
                  {
                    name: "Risk Score",
                    ...selectedHazards.reduce((acc, hazardName) => {
                      const hazard = ccraData.find(
                        (h) => h.Hazard === hazardName,
                      );
                      acc[hazardName] = hazard?.["Risk Score"] || 0;
                      return acc;
                    }, {}),
                  },
                ]}
              >
                <PolarGrid gridType="circle" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "#575757", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 1]}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                {selectedHazards.map((hazardName) => {
                  const hazard = ccraData.find((h) => h.Hazard === hazardName);
                  const riskColor = getRiskColor(hazard?.["Risk Score"] || 0);

                  return (
                    <Radar
                      key={hazardName}
                      name={hazardName}
                      dataKey={hazardName}
                      stroke={riskColor}
                      fill={riskColor}
                      fillOpacity={0.3}
                    />
                  );
                })}
                <Legend
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color }}>{value}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Score Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedHazards.map((hazardName) => {
                const hazard = ccraData.find((h) => h.Hazard === hazardName);
                if (!hazard) return null;

                const riskColor = getRiskColor(hazard["Risk Score"]);
                return (
                  <div
                    key={hazardName}
                    className="p-4 rounded-lg border border-gray-200"
                    style={{
                      borderLeftColor: riskColor,
                      borderLeftWidth: "4px",
                    }}
                  >
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: riskColor }}
                    >
                      {hazardName}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Risk Score:</span>
                        <span className="font-semibold">
                          {hazard["Risk Score"]?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vulnerability:</span>
                        <span className="font-semibold">
                          {hazard["Vulnerability Score"]?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hazard Score:</span>
                        <span className="font-semibold">
                          {hazard["Climate Threat Score"]?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Qualitative Assessment */}
      <div className="mb-12">
        <QualitativeAssessment />
      </div>
      
      {/* Export Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={onExportCSV}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Export to CSV
        </button>
        <button
          onClick={onExportPDF}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default RiskAssessment;
