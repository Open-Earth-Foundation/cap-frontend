import React from "react";
import { MdInfoOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

const ClimateActionTable = ({ actions, onActionClick }) => {
  const { t } = useTranslation();

  // Log the first action object to inspect its structure
  React.useEffect(() => {
    if (actions && actions.length > 0) {
      console.log("Action object structure:", actions[0]);
      // List all keys in the action object
      console.log("Available keys in action object:", Object.keys(actions[0]));
    }
  }, [actions]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200" id="climate-action-table">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-[8%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("rank")}
            </th>
            <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("action")}
            </th>
            <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("sector")}
            </th>
            <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("explanation")}
            </th>
            <th className="w-[17%] px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("details")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {actions.map((action, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {action.ActionName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {action.Sector}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-normal break-words">
                {/* Try multiple possible field names for explanation */}
                {action.explanation || action.Explanation || action.Description || action.description || t("explanationNotAvailable")}
                {/* Debug log for this specific field */}
                {console.log(`Checking explanation for action ${index}:`, {
                  lowercase: action.explanation,
                  uppercase: action.Explanation, 
                  description: action.description,
                  Description: action.Description
                })}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button
                  onClick={() => onActionClick(action)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClimateActionTable;