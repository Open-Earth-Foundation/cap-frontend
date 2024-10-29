import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import CityMap from "./CityMap";
import QualitativeAssessment from "./QualitativeAssessment";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const chartColors = ["#FF6384", "#36A2EB", "#FFCE56"];

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
  const [selectedHazards, setSelectedHazards] = useState([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [resilienceScore, setResilienceScore] = useState(null);

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

  const defineRiskLevel = (score) => {
    if (score >= 0.75) return "Very High";
    if (score >= 0.5) return "High";
    if (score >= 0.25) return "Medium";
    return "Low";
  };

  const getRiskColor = (score) => {
    if (score >= 0.75) return "#8B0000"; // Very High - Dark Red
    if (score >= 0.5) return "#E80A0A"; // High - Red
    if (score >= 0.25) return "#E06835"; // Medium - Orange
    return "#3B82F6"; // Low - Blue
  };

  const calculateAdjustedVulnerability = (resilienceScore) => {
    if (resilienceScore === null) return null;
    // Direct inverse relationship: new vulnerability = 1 - resilience
    return 1 - resilienceScore;
  };

  const calculateAdjustedRiskScore = (riskScore, resilienceScore) => {
    if (resilienceScore === null) return null;

    // New vulnerability score is simply 1 - resilience
    const newVulnerability = 1 - resilienceScore;

    // Risk = Hazard × Exposure × New Vulnerability
    return (
      riskScore * (1 - resilienceScore * 0.5 + (1 - resilienceScore) * 0.5)
    );
  };

  const getScoreComparison = (original, adjusted) => {
    if (!original || !adjusted) return "-";
    const difference = (((adjusted - original) / original) * 100).toFixed(1);
    return difference > 0 ? `+${difference}%` : `${difference}%`;
  };
  const handleResilienceScoreUpdate = (score) => {
    // Convert score from 0-20 range to 0-1 range
    const normalizedScore = score / 20;
    setResilienceScore(normalizedScore);
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
  return (
    <div className="max-w-screen-xl mx-auto p-16 space-y-9">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#7A7B9A] hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-sm font-medium tracking-wider">
              Back to search
            </span>
          </button>
        </div>
      </div>
      <div className="space-y-9">

        {/* Map Section */}
        <div className="items-center grid grid-cols-3 gap-4">
          <div className="flex flex-col w-full gap-2">
            <h2 className="text-[16px] font-normal text-gray-400 font-poppins">
              Selected city
            </h2>
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8 text-[#7A7B9A]" />
              <h2 className="text-[32px] font-semibold font-poppins">
                {selectedCity}
              </h2>
            </div>
          </div>
          <div className="flex flex-col col-span-2 h-[400px] w-full bg-white rounded-lg shadow-md space-y-9">
            <CityMap selectedCity={selectedCity} />
          </div>
        </div>
        {/* CCRA Section */}

        {/* CCRA Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-9 my-16 w-full">
          <div className="space-y-4">
            <h3 className="text-2xl font-normal font-poppins">Climate Change Risk Assessment | Table</h3>
            <p className="text-base font-normal font-opensans text-gray-600">
              This is a first display of the risk information compiled for your
              city, from multiple sources.
              {resilienceScore !== null &&
                " Values have been adjusted based on your Qualitative Assessment results."}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full min-w-full">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Key Impact</th>
                  <th className="px-4 py-2 text-left">Hazard</th>
                  <th className="px-4 py-2 text-left">Hazard Score</th>
                  <th className="px-4 py-2 text-left">Exposure Score</th>
                  <th className="px-4 py-2 text-left">Sensitivity Score</th>
                  <th className="px-4 py-2 text-left">Adaptive Capacity</th>
                  {resilienceScore !== null ? (
                    <>
                      <th className="px-4 py-2 text-left">
                        Original Vulnerability
                      </th>
                      <th className="px-4 py-2 text-left bg-blue-50">
                        Adjusted Vulnerability
                      </th>
                      <th className="px-4 py-2 text-left">
                        Original Risk Score
                      </th>
                      <th className="px-4 py-2 text-left bg-blue-50">
                        Adjusted Risk Score
                      </th>
                      <th className="px-4 py-2 text-left">Impact</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2 text-left">
                        Vulnerability Score
                      </th>
                      <th className="px-4 py-2 text-left">Risk Score</th>
                      <th className="px-4 py-2 text-left">Risk Level</th>
                    </>
                  )}
                  <th className="px-4 py-2 text-left">Custom Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {ccraData.map((row, index) => {
                  // Calculate new vulnerability using resilience score
                  const newVulnerability =
                    resilienceScore !== null
                      ? calculateAdjustedVulnerability(resilienceScore)
                      : row["Vulnerability Score"];

                  // Calculate new risk score using the new vulnerability
                  const adjustedRiskScore =
                    resilienceScore !== null
                      ? calculateAdjustedRiskScore(
                          row["Risk Score"],
                          resilienceScore,
                        )
                      : row["Risk Score"];

                  const riskLevel = defineRiskLevel(
                    resilienceScore !== null
                      ? adjustedRiskScore
                      : row["Risk Score"],
                  );
                  const customRisk = customRiskLevels[index];
                  const riskColor = getRiskColor(
                    resilienceScore !== null
                      ? adjustedRiskScore
                      : row["Risk Score"],
                  );
                  const impactPercentage = getScoreComparison(
                    row["Risk Score"],
                    adjustedRiskScore,
                  );

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{row.Year}</td>
                      <td className="px-4 py-2">{row.Sector}</td>
                      <td className="px-4 py-2">{row.Hazard}</td>
                      <td className="px-4 py-2">
                        {row["Climate Threat Score"]?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {row["Exposure Score"]?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {row["Sensitivity Score"]?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {row["Adaptive Capacity Score"]?.toFixed(2)}
                      </td>

                      {resilienceScore !== null ? (
                        <>
                          <td className="px-4 py-2">
                            {row["Vulnerability Score"]?.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 font-medium bg-blue-50">
                            {newVulnerability?.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            {row["Risk Score"]?.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 font-medium bg-blue-50">
                            {adjustedRiskScore?.toFixed(2)}
                          </td>
                          <td
                            className={`px-4 py-2 ${
                              impactPercentage.startsWith("-")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {impactPercentage}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2">
                            {row["Vulnerability Score"]?.toFixed(2)}
                          </td>
                          <td
                            className="px-4 py-2"
                            style={{ color: riskColor }}
                          >
                            {row["Risk Score"]?.toFixed(2)}
                          </td>
                          <td
                            className="px-4 py-2"
                            style={{ color: riskColor }}
                          >
                            {riskLevel}
                          </td>
                        </>
                      )}

                      <td className="px-4 py-2">
                        <select
                          value={customRisk || riskLevel}
                          onChange={(e) =>
                            setCustomRiskLevels({
                              ...customRiskLevels,
                              [index]: e.target.value,
                            })
                          }
                          className="w-full p-1 border rounded-md hover:border-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
        </div>
        {/* Qualitative Assessment Section */}
        <AnimatePresence>
          {!showQuestionnaire ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#2351DC] rounded-lg shadow-md p-12 flex justify-between items-center"
            >
              <div className="space-y-4 max-w-2xl">
                <h3 className="text-[32px] leading-12 font-normal font-poppins text-white">
                  <b>Get better insights.</b>
                  <br />
                  Answer a few questions.
                </h3>
                <p className="text-base font-normal font-opensans text-white">
                  Take the Qualitative Assessment Questionnaire to weigh-in other
                  non-numerical factors in our calculations and get more
                  tailored scorings after just 5 questions.
                </p>
              </div>
              <button
                onClick={() => setShowQuestionnaire(true)}
                className="flex justify-center hover:bg-gray-100 w-64 px-4 py-6 bg-white text-[#2351DC] rounded-lg font-semibold uppercase tracking-wider"
              >
                answer the quiz
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <QualitativeAssessment
                onClose={() => setShowQuestionnaire(false)}
                onScoreUpdate={handleResilienceScoreUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Risks and Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Risks */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 space-y-9">
            <div className="space-y-4">
              <h3 className="text-2xl font-normal font-poppins">
                Top risks for your city
              </h3>
              <p className="text-base font-normal font-opensans text-gray-600">
                Risks that you should prioritize or pay attention to when
                planning actions.
                {resilienceScore !== null &&
                  " Values have been adjusted based on your Qualitative Assessment results."}
              </p>
            </div>

            {/* Risk Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ccraData
                .sort((a, b) => {
                  const scoreA = resilienceScore
                    ? calculateAdjustedRiskScore(
                        a["Climate Threat Score"],
                        a["Exposure Score"],
                        resilienceScore,
                      )
                    : a["Risk Score"];
                  const scoreB = resilienceScore
                    ? calculateAdjustedRiskScore(
                        b["Climate Threat Score"],
                        b["Exposure Score"],
                        resilienceScore,
                      )
                    : b["Risk Score"];
                  return scoreB - scoreA;
                })
                .slice(0, 3)
                .map((risk, index) => {
                  const adjustedRiskScore = resilienceScore
                    ? calculateAdjustedRiskScore(
                        risk["Climate Threat Score"],
                        risk["Exposure Score"],
                        resilienceScore,
                      )
                    : risk["Risk Score"];

                  const riskColor = getRiskColor(adjustedRiskScore);
                  const riskLevel = defineRiskLevel(adjustedRiskScore);

                  const getFilledSegments = (score) => {
                    if (score >= 0.75) return 4;
                    if (score >= 0.5) return 3;
                    if (score >= 0.25) return 2;
                    return 1;
                  };

                  return (
                    <div
                      key={index}
                      className="p-6 border border-[#D7D8FA] rounded-lg flex flex-col gap-2"
                    >
                      <div className="uppercase text-[#575757] text-xs font-semibold tracking-[1.5px] py-2">
                        {risk.Sector}
                      </div>

                      <div className="flex flex-col">
                        <h4 className="text-2xl font-semibold">
                          {risk.Hazard}
                        </h4>
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
                            {adjustedRiskScore?.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="h-[5px] flex-1 rounded-full"
                              style={{
                                background:
                                  i < getFilledSegments(adjustedRiskScore)
                                    ? riskColor
                                    : "#E2E2E2",
                              }}
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
                            {riskLevel}
                          </span>
                        </div>

                        {resilienceScore !== null && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#575757] text-xs font-medium tracking-wide">
                              Original Score
                            </span>
                            <span className="text-[#575757] text-base">
                              {risk["Risk Score"]?.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-[#E4E4E4] my-2" />

                      {/* Metrics */}
                      {[
                        {
                          label: "Sensitivity",
                          value: risk["Sensitivity Score"],
                        },
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
                          value:
                            resilienceScore !== null
                              ? calculateAdjustedVulnerability(resilienceScore)
                              : risk["Vulnerability Score"],
                        },
                      ].map(({ label, value }, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
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
          {/* Hazard Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-normal font-poppins">
                Hazard Comparison
              </h3>
              <p className="text-base font-normal font-opensans text-gray-600">
                For better visualization.
              </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-4">
              {ccraData
                .sort((a, b) => b["Risk Score"] - a["Risk Score"])
                .slice(0, 3)
                .map((hazard, index) => {
                  const adjustedRiskScore = resilienceScore
                    ? calculateAdjustedRiskScore(
                        hazard["Climate Threat Score"],
                        hazard["Exposure Score"],
                        resilienceScore,
                      )
                    : hazard["Risk Score"];

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`hazard-${index}`}
                        checked={selectedHazards.includes(hazard.Hazard)}
                        onChange={() => {
                          setSelectedHazards((prev) =>
                            prev.includes(hazard.Hazard)
                              ? prev.filter((h) => h !== hazard.Hazard)
                              : [...prev, hazard.Hazard],
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor={`hazard-${index}`}
                        className="text-lg font-medium"
                        style={{
                          color: chartColors[index % chartColors.length],
                        }}
                      >
                        {hazard.Hazard}
                      </label>
                    </div>
                  );
                })}
            </div>

            <div className="h-[360px]">
              <ResponsiveContainer>
                <RadarChart
                  cx="45%"
                  cy="45%"
                  outerRadius="72%"
                  data={[
                    {
                      name: "Hazard",
                      ...selectedHazards.reduce((acc, hazardName) => {
                        const hazard = ccraData.find(
                          (h) => h.Hazard === hazardName,
                        );
                        acc[hazardName] = hazard?.["Climate Threat Score"] || 0;
                        return acc;
                      }, {}),
                    },
                    {
                      name: "Exposure",
                      ...selectedHazards.reduce((acc, hazardName) => {
                        const hazard = ccraData.find(
                          (h) => h.Hazard === hazardName,
                        );
                        acc[hazardName] = hazard?.["Exposure Score"] || 0;
                        return acc;
                      }, {}),
                    },
                    {
                      name: "Vulnerability",
                      ...selectedHazards.reduce((acc, hazardName) => {
                        const hazard = ccraData.find(
                          (h) => h.Hazard === hazardName,
                        );
                        acc[hazardName] = resilienceScore
                          ? calculateAdjustedVulnerability(resilienceScore)
                          : hazard?.["Vulnerability Score"] || 0;
                        return acc;
                      }, {}),
                    },
                    {
                      name: "Risk",
                      ...selectedHazards.reduce((acc, hazardName) => {
                        const hazard = ccraData.find(
                          (h) => h.Hazard === hazardName,
                        );
                        acc[hazardName] = resilienceScore
                          ? calculateAdjustedRiskScore(
                              hazard["Climate Threat Score"],
                              hazard["Exposure Score"],
                              resilienceScore,
                            )
                          : hazard?.["Risk Score"] || 0;
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
                  />
                  {selectedHazards.map((hazardName, index) => (
                    <Radar
                      key={hazardName}
                      name={hazardName}
                      dataKey={hazardName}
                      stroke={chartColors[index % chartColors.length]}
                      fill={chartColors[index % chartColors.length]}
                      fillOpacity={0.3}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4">
              <h3 className="text-[32px] font-normal font-poppins">
                Access your data in one click
              </h3>
              <p className="text-base font-normal font-opensans text-gray-600">
                Export this visualization in the format that best suits your
                needs
              </p>
            </div>
            <div className="flex flex-col gap-4 min-w-[200px]">
              <button
                onClick={onExportCSV}
                className="w-full px-4 py-4 bg-[#2351DC] text-white rounded-lg font-semibold uppercase tracking-wider whitespace-nowrap"
              >
                Export as CSV
              </button>
              <button
                onClick={onExportPDF}
                className="w-full px-4 py-4 bg-[#2351DC] text-white rounded-lg font-semibold uppercase tracking-wider whitespace-nowrap"
              >
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
