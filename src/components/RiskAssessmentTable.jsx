import React from 'react';

const RiskAssessmentTable = ({ ccraData }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full bg-white rounded-lg shadow-md mt-4">
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
  );
};

export default RiskAssessmentTable;