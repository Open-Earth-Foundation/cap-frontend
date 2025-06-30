import React from "react";
import { FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Disclosure } from "@headlessui/react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import MarkdownRenderer from "./MarkdownRenderer.jsx";

const PlanModal = ({ isOpen, onClose, plan, plans, isListView }) => {
    if (!isOpen) return null;
    const { t } = useTranslation();

    if (isListView || !plan) {
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
              <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {plans.map((planData, index) => {
                  return (
                    <Disclosure key={index}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                            <span>{planData.actionName}</span>
                            {open ? (
                              <FiChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <FiChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            <div className="bg-white rounded-lg">
                              {planData.plan && (
                                <MarkdownRenderer
                                  markdownContent={planData.plan}
                                />
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  );
                })}
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
              {plan && <MarkdownRenderer markdownContent={plan.plan || plan} />}
            </div>
          </div>
        </div>
      </div>
    );
};

export default PlanModal;