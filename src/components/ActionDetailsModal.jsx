import React from 'react';
import {getReductionPotential, isAdaptation, toTitleCase} from "../utils/helpers.js";
import {FiX} from 'react-icons/fi';

const ActionDetailsModal = ({cityAction, onClose}) => {
    if (!cityAction) return null;
    const action = cityAction;
    // Helper function to render progress bars based on reduction potential
    const renderReductionBars = () => {
        if (isAdaptation(action.ActionType)) {
            const level = action.AdaptationEffectiveness;
            const filledBars = level === "High" ? 3 : level === "Medium" ? 2 : 1;
            const color = level === "High" 
                ? "bg-blue-500" 
                : level === "Medium" 
                    ? "bg-blue-400" 
                    : "bg-blue-300";

            return (
                <div className="flex gap-2 mb-8">
                    {Array(3).fill().map((_, i) => (
                        <div
                            key={i}
                            className={`w-[184px] h-[5px] rounded-2xl ${
                                i < filledBars ? color : "bg-gray-200"
                            }`}
                        />
                    ))}
                </div>
            );
        } else {
            // Mitigation logic
            const potential = getReductionPotential(action);
            const potentialValue = parseInt(potential.split('-')[0]);

            const getBarColor = (value) => {
                if (value >= 80) return "bg-blue-500";    
                if (value >= 60) return "bg-blue-400";    
                if (value >= 40) return "bg-blue-300";  
                if (value >= 20) return "bg-blue-200"; 
                return "bg-blue-100";                    
            };

            const filledBars = potentialValue >= 80 ? 5 
                : potentialValue >= 60 ? 4 
                : potentialValue >= 40 ? 3 
                : potentialValue >= 20 ? 2 
                : 1;

            const color = getBarColor(potentialValue);

            return (
                <div className="flex gap-2 mb-8">
                    {Array(5).fill().map((_, i) => (
                        <div
                            key={i}
                            className={`w-[184px] h-[5px] rounded-2xl ${
                                i < filledBars ? color : "bg-gray-200"
                            }`}
                        />
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                />

                {/* Modal */}
                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full font-poppins">
                    {/* Header */}
                    <div className="flex justify-between items-center px-12 pt-8 pb-6">
                        <h3 className="text-xl font-bold text-[#00001F] font-poppins">
                            Climate action details
                        </h3>
                        <button onClick={onClose} className="p-1">
                            <FiX className="h-6 w-6"/>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-b-2 border-[#E8EAFB]"/>

                    {/* Content */}
                    <div className="px-12 py-8">
                        {/* Title and Description */}
                        <h2 className="text-lg font-bold text-[#232640] mb-4 font-poppins">
                            {action.ActionName}
                        </h2>
                        <p className="text-md text-[#4B4C63] mb-8 font-opensans">
                            {action.Description}
                        </p>

                        {/* Divider */}
                        <div className="border-b border-[#E4E4E4] mb-6"/>

                        {/* Reduction Potential Bars */}
                        {renderReductionBars()}

                        {/* Stats Grid */}
                        <div className="space-y-4 mb-6 font-poppins">
                            <div className="flex justify-between items-center">
                                <span
                                    className="text-md text-[#4B4C63]">{isAdaptation(action.ActionType) ? "Adaptation Potential" : "Reduction Potential"}</span>
                                <span className="text-md font-semibold text-[#4B4C63]">
                  {isAdaptation(action.ActionType) ? toTitleCase(action.AdaptationEffectiveness) : `${getReductionPotential(action)}%`}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-md text-[#4B4C63]">Sector</span>
                                <span className="text-base font-semibold text-[#4B4C63]">
                  {action?.Sector?.join ? 
                    action.Sector.map(s => toTitleCase(s)).join(', ') 
                    : action?.Hazard?.join ?
                      action.Hazard.map(h => toTitleCase(h)).join(', ')
                      : toTitleCase(String(action.Sector || action.Hazard || ''))}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-md text-[#4B4C63]">Estimated cost</span>
                                <span className="text-base font-semibold text-[#4B4C63]">
                  {toTitleCase(action.CostInvestmentNeeded)}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-md text-[#4B4C63]">Implementation time</span>
                                <span className="text-base font-semibold text-[#4B4C63]">
                  {action.TimelineForImplementation}
                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-b border-[#E4E4E4] mb-6"/>

                            {/* Additional sections if available in your data */}
                        {action.Impacts && (
                            <>
                                <div className="border-b border-[#E4E4E4] mb-8"/>
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-[#232640] mb-3">Impacts</h3>
                                    <ul className="list-disc list-inside text-sm text-[#4B4C63]">
                                        {action.Impacts.map((impact, index) => (
                                            <li key={index}>{impact}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        {action.CoBenefits.map && (
                            <>
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-[#232640] mb-3">Co-benefits</h3>
                                    <ul className="list-disc list-inside text-sm text-[#4B4C63]">
                                        {(action.CoBenefits).map((coBenefit, index) => (
                                            <li key={index}>{coBenefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        {action.EquityAndInclusionConsiderations && (
                            <div>
                                <h3 className="text-lg font-medium text-[#232640] mb-3">
                                    Equity and inclusion considerations
                                </h3>
                                <p className="text-sm text-[#4B4C63]">{action.EquityAndInclusionConsiderations}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionDetailsModal;