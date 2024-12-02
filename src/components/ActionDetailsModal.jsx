import React from 'react';
import {getReductionPotential, isAdaptation} from "../utils/helpers.js";
import {FiX} from 'react-icons/fi';

const ActionDetailsModal = ({cityAction, onClose}) => {
    if (!cityAction) return null;
    const action = cityAction;
    // Helper function to render progress bars based on reduction potential
    const renderReductionBars = () => {
        const potential = getReductionPotential(action).toLowerCase();
        const bars = potential === 'high' ? 3 : potential === 'medium' ? 2 : 1;

        return (
            <div className="flex justify-between mb-8">
                {[...Array(3)].map((_, index) => (
                    <div
                        key={index}
                        className={`w-[184px] h-[5px] rounded-2xl ${
                            index < bars ? 'bg-[#F23D33]' : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>
        );
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
                        <div className="space-y-4 mb-6 font-poppins font-bold">
                            <div className="flex justify-between items-center">
                                <span
                                    className="text-md text-[#4B4C63]">{isAdaptation(action.ActionType) ? "Adaptation Potential" : "Reduction Potential"}</span>
                                <span className="text-md text-[#F23D33]">
                  {isAdaptation(action.ActionType) ? action.adaptation_potential : getReductionPotential(action)}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-md text-[#4B4C63]">Sector</span>
                                <span className="text-base text-[#4B4C63]">
                  {action.Sector || action.Hazard}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-md text-[#4B4C63]">Estimated cost</span>
                                <span className="text-base text-[#4B4C63]">
                  {action.CostInvestmentNeeded}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-md text-[#4B4C63]">Implementation time</span>
                                <span className="text-base text-[#4B4C63]">
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

                        {action.CoBenefits && (
                            <>
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-[#232640] mb-3">Co-benefits</h3>
                                    <ul className="list-disc list-inside text-sm text-[#4B4C63]">
                                        {action.CoBenefits.map((coBenefit, index) => (
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