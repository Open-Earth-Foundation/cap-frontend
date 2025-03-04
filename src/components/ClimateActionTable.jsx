import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdInfoOutline } from "react-icons/md";

const ClimateActionTable = ({ actions, onActionClick }) => {
  const { t } = useTranslation();
  const [tooltipAction, setTooltipAction] = useState(null);

  const handleInfoClick = (e, action) => {
    e.stopPropagation();
    setTooltipAction(tooltipAction === action ? null : action);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("rank")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("action")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("sector")}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              <td className="px-6 py-4 text-right text-sm font-medium relative">
                <div className="flex items-center justify-end space-x-3">
                  <div className="relative">
                    <button
                      onClick={(e) => handleInfoClick(e, action)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
                    >
                      <MdInfoOutline size={20} />
                    </button>

                    {tooltipAction === action && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4 text-left">
                        <h3 className="text-sm font-semibold mb-2">{t("explanation")}</h3>
                        <p className="text-xs text-gray-700">
                          {action.Explanation ? action.Explanation : t("explanationNotAvailable")}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onActionClick(action)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {t("seeMoreDetails")}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClimateActionTable;