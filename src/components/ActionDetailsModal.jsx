import React from 'react';
import {getReductionPotential} from "../utils/helpers.js";

const ActionDetailsModal = ({action, onClose}) => {
    return (<>
            {!!action &&
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div
                        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                             onClick={onClose}/>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
                              aria-hidden="true">&#8203;</span>
                        <div
                            className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">{action.action_name}</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">{action.action_description}</p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Sector/Hazard:</p>
                                            <p className="text-sm text-gray-500">{action.sector || action.hazard}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Estimated Cost:</p>
                                            <p className="text-sm text-gray-500">{action.estimated_cost}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Implementation Time:</p>
                                            <p className="text-sm text-gray-500">{action.timeline_for_implementation}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Reduction Potential:</p>
                                            <p className="text-sm text-gray-500">{getReductionPotential(action)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }</>
    )

};

export default ActionDetailsModal;