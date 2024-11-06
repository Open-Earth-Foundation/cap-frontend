import React from "react";

const ClimateActions = ({ ccraData }) => {
  const getImpactLevelClass = (level) => {
    const classes = {
      Low: "bg-blue-100 text-blue-800 border border-blue-800",
      Medium: "bg-yellow-100 text-yellow-800 border border-yellow-800",
      High: "bg-red-100 text-red-800 border border-red-800"
    };
    return `${classes[level]} text-xs font-medium px-2 py-0.5 rounded-full`;
  };

  const rankedData = ccraData.map((item, index) => ({
    ...item,
    rank: `${index + 1}°`
  }));

  return (
    <div className="max-w-screen-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#232640]">
        Ranking of climate actions for your city
      </h1>

      <div className="rounded-lg overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-[#E8EAFB]">
            <tr className="text-sm font-semibold text-gray-600 uppercase">
              <th className="w-[8%] text-left py-2 px-6">Rank</th>
              <th className="w-[22%] text-left py-2 px-6">Action name</th>
              <th className="w-[15%] text-left py-2 px-6">Action type</th>
              <th className="w-[15%] text-left py-2 px-6">Impact level</th>
              <th className="w-[40%] text-left py-2 px-6">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-[#FAFAFA]">
            {rankedData.map((row, index) => (
              <tr key={index} className="text-sm">
                <td className="py-4 px-6 font-medium">
                  {row.rank}
                </td>
                <td className="py-4 px-6 font-medium">
                  {row.action_name}
                </td>
                <td className="py-4 px-6">
                  {row.action_type}
                </td>
                <td className="py-4 px-6">
                  <span className={getImpactLevelClass(row.impact_level)}>
                    {row.impact_level}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {row.action_description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClimateActions;