
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiInfo } from 'react-icons/fi';

const ClimateActionTable = ({ actions, onActionClick }) => {
  const { t } = useTranslation();
  
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
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onActionClick(action)}
                  className="text-indigo-600 hover:text-indigo-900 relative group"
                >
                  <FiInfo className="w-5 h-5" />
                  
                  {/* Tooltip para explicación si existe */}
                  {action.Explanation && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {t("explanation")} {t("available")}
                    </span>
                  )}
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
