import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FiX } from 'react-icons/fi';

const PlanModal = ({ isOpen, onClose, prompt, plan, plans, isListView }) => {
    if (!isOpen) return null;

    if (isListView) {
        return (
            <div className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                        <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Generated Action Plans</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                            {plans.map((planData, index) => (
                                <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-lg font-medium text-gray-900">{planData.actionName}</h4>
                                        <span className="text-sm text-gray-500">
                                            {new Date(planData.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Prompt:</h4>
                                            <ReactMarkdown className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {planData.prompt}
                                            </ReactMarkdown>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Response:</h4>
                                            <ReactMarkdown className="prose prose-lg max-w-none prose-headings:font-poppins prose-h2:text-2xl prose-h2:font-bold prose-h2:text-blue-600 prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b-2 prose-h2:border-blue-100 prose-h2:pb-3 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1 prose-strong:text-gray-700">
                                                {planData.plan}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                                <ReactMarkdown className="prose prose-lg max-w-none prose-headings:font-poppins prose-h2:text-2xl prose-h2:font-bold prose-h2:text-blue-600 prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b-2 prose-h2:border-blue-100 prose-h2:pb-3 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1 prose-strong:text-gray-700">
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