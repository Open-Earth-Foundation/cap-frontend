import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FiX } from 'react-icons/fi';

const PlanModal = ({ isOpen, onClose, prompt, plan }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900">Generated Action Plan</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <FiX className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Prompt:</h4>
                                <ReactMarkdown className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {prompt}
                                </ReactMarkdown>
                            </div>

                            <div className="bg-white p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Response:</h4>
                                <ReactMarkdown className="prose max-w-none">
                                    {plan}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;