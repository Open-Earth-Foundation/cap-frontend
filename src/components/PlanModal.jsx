import React, { useRef, useState } from "react";
import { FiX, FiFileText } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Disclosure } from "@headlessui/react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import MarkdownRenderer from "./MarkdownRenderer.jsx";
import html2pdf from "html2pdf.js";
import { exportMarkdownToPDF } from "../utils/exportUtils";

const PlanModal = ({ isOpen, onClose, plan, plans, isListView }) => {
  if (!isOpen) return null;
  const { t } = useTranslation();
  const printRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  // Helper to get the export content and filename
  const getExportContent = () => {
    if (isListView && plans && plans.length > 0) {
      return {
        content: (
          <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {plans[0]?.actionName || "Action Plan"}
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Generated on: {new Date().toLocaleDateString()}
            </p>
            {plans.map((p, i) => (
              <div key={i} style={{ marginBottom: "30px" }}>
                <h2
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "15px",
                    color: "#333",
                  }}
                >
                  {i + 1}. {p.actionName}
                </h2>
                <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  <MarkdownRenderer markdownContent={p.plan} />
                </div>
              </div>
            ))}
          </div>
        ),
        filename: plans[0]?.actionName || "Action_Plan",
      };
    } else if (plan) {
      const actionName = plan.actionName || "Action_Plan";
      return {
        content: (
          <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {actionName}
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Generated on: {new Date().toLocaleDateString()}
            </p>
            <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
              <MarkdownRenderer markdownContent={plan.plan || plan} />
            </div>
          </div>
        ),
        filename: actionName,
      };
    }
    return {
      content: <div>No content available</div>,
      filename: "Action_Plan",
    };
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const { filename } = getExportContent();
      const safeFilename = filename
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_");
      // Get the markdown content
      let markdown = "";
      if (isListView && plans && plans.length > 0) {
        // Concatenate all plans' markdown
        markdown = plans.map((p, i) => `# ${i + 1}. ${p.actionName || "Action Plan"}\n\n${p.plan || ""}`).join("\n\n---\n\n");
      } else if (plan) {
        markdown = plan.plan || plan;
      }
      await exportMarkdownToPDF(markdown, `${safeFilename}_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Check if there's content to export
  const hasContent = isListView
    ? plans && plans.length > 0 && plans.some((p) => p.plan || p.actionName)
    : plan && (plan.plan || plan.actionName || typeof plan === "string");

  // Prepare export content for the hidden div
  const { content: exportContent } = getExportContent();

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
              <div className="flex items-center gap-2">
                {hasContent && (
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    title={t("exportPdf")}
                  >
                    <FiFileText className="h-4 w-4" />
                    {isExporting ? "Generating..." : t("exportPdf")}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
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
        {/* Export area - always rendered */}
        <div
          ref={printRef}
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: "800px",
            backgroundColor: "white",
            visibility: "hidden",
            zIndex: -1,
          }}
        >
          {exportContent}
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
            <div className="flex items-center gap-2">
              {hasContent && (
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  title={t("exportPdf")}
                >
                  <FiFileText className="h-4 w-4" />
                  {isExporting ? "Generating..." : t("exportPdf")}
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {plan && <MarkdownRenderer markdownContent={plan.plan || plan} />}
          </div>
        </div>
      </div>
      {/* Export area - always rendered */}
      <div
        ref={printRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "800px",
          backgroundColor: "white",
          visibility: "hidden",
          zIndex: -1,
        }}
      >
        {exportContent}
      </div>
    </div>
  );
};

export default PlanModal;
