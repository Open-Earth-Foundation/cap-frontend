import React, {useState} from "react";
import ActionDetailsModal from "./ActionDetailsModal.jsx";
import {getReductionPotential} from "../utils/helpers.js";


const TopClimateActions = ({actions, type}) => {
    const [selectedAction, setSelectedAction] = useState()
    // Get top 3 actions of the specified type
    const topActions = actions
        .filter((action) => action.action_type === type)
        .slice(0, 3);

    const getReductionColor = (level) => {
        switch (level) {
            case "High":
                return "text-red-500 font-bold";
            case "Medium":
                return "text-amber-500 font-bold";
            case "Low":
                return "text-blue-500 font-bold";
        }
    };

    const getProgressBars = (level) => {
        const bars = [];
        const totalBars = 3;
        const filledBars = level === "High" ? 3 : level === "Medium" ? 2 : 1;
        const color =
            level === "High"
                ? "bg-red-500"
                : level === "Medium"
                    ? "bg-amber-500"
                    : "bg-blue-500";

        for (let i = 0; i < totalBars; i++) {
            bars.push(
                <div
                    key={i}
                    className={`h-1 w-1/2 rounded ${i < filledBars ? color : "bg-gray-200"}`}
                />,
            );
        }
        return bars;
    };


    return (
        <div className="space-y-6">
            <ActionDetailsModal action={selectedAction} onClose={() => setSelectedAction(null)}/>
            <h1 className="text-2xl font-normal text-gray-900 font-poppins">
                Top {type.toLowerCase()} climate actions
            </h1>
            {/*Top Mitigatons Cards*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topActions.map((action, index) => (
                    /* Mitigation Card */
                    <div
                        key={action.action_id}
                        className="p-6 space-y-4 border rounded-lg shadow-sm bg-white font-opensans"
                    >
                        {/*Index*/}
                        <div>
              <span className="text-4xl font-bold text-gray-900 font-poppins">
                {index + 1}°
              </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-gray-900 font-poppins">
                                {action.action_name}
                            </h2>
                            <p className="text-gray-600 text-md line-clamp-2 font-opensans">
                                {action.action_description}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="flex gap-2 ">
                                {getProgressBars(action.estimated_cost)}
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-600 ">Reduction potential</span>
                                {/*<span className={getReductionColor(action.estimated_cost)}>*/}
                    <p className="text-gray-600 text-md line-clamp-2 font-bold font-opensans">
                                {getReductionPotential(action)}
                            </p>
                {/*</span>*/}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-2"/>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                <span className="text-gray-600">
                  {action.action_type === "Mitigation" ? "Sector" : "Hazard"}
                </span>
                                <span className="text-gray-600 font-semibold">
                  {action.sector || action.hazard}
                </span>
                            </div>

                            <div className="flex justify-between ">
                                <span className="text-gray-600">Estimated cost</span>
                                <span className="text-gray-600 font-semibold">
                  {action.estimated_cost}
                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Implementation time</span>
                                <span className="text-gray-600 font-semibold">
                  {action.timeline_for_implementation}
                </span>
                            </div>
                        </div>

                        <button onClick={() => setSelectedAction(action)} className="button-link">
                            See more details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopClimateActions;
