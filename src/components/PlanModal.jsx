import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const PlanModal = ({ isOpen, onClose, plan, plans, isListView }) => {
    if (!isOpen) return null;
    const { t } = useTranslation();

    const markdownClasses = `
        prose prose-lg max-w-none 
        prose-headings:font-poppins 
        prose-h1:text-3xl prose-h1:font-bold prose-h1:text-gray-900 prose-h1:mb-6
        prose-h2:text-2xl prose-h2:font-bold prose-h2:text-blue-600 prose-h2:mt-8 prose-h2:mb-4 
        prose-h2:border-b-2 prose-h2:border-blue-100 prose-h2:pb-3
        prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-800 prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
        prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4
        prose-li:text-gray-600 prose-li:mb-2 prose-li:leading-normal
        prose-strong:text-gray-700 prose-strong:font-semibold
        prose-em:text-gray-600 prose-em:italic
        prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
        prose-table:w-full prose-table:border-collapse
        prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-th:text-left
        prose-td:border prose-td:border-gray-300 prose-td:p-2
        [&_br]:mb-2
        [&_style]:hidden
        [&_ul]:mt-0 [&_ul]:mb-0 [&_ul]:pl-5
        [&_ol]:mt-0 [&_ol]:mb-0 [&_ol]:pl-5
        [&_li]:mb-0.5 [&_li]:leading-normal
    `;

    if (isListView) {
        return (
            <div className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={onClose}
                    />
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                        <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">
                                Generated Action Plans
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <FiX className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                            {plans.map((planData, index) => (
                                <div
                                    key={index}
                                    className="border-b border-gray-200 pb-4 mb-4"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-lg font-medium text-gray-900">
                                            {planData.actionName}
                                        </h4>
                                        <span className="text-sm text-gray-500">
                                            {new Date(
                                                planData.timestamp,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-lg">
                                        <ReactMarkdown
                                            className={markdownClasses}
                                            rehypePlugins={[rehypeRaw]}
                                        >
                                            {planData.plan}
                                        </ReactMarkdown>
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
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900">
                            {t("generatedActionPlan")}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <FiX className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        <ReactMarkdown
                            className={markdownClasses}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {plan}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;
