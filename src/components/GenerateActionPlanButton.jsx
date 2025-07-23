import React, { useState } from "react";
import { Button } from "@mui/material";
import { ButtonMedium } from "./Texts/Button";
import { BodySmall } from "./Texts/Body.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import { TbSparkles } from "react-icons/tb";
import { generateActionPlan } from "../utils/planCreator.js";
import { useTranslation } from "react-i18next";
import PlanModal from "./PlanModal.jsx";
import { jsPDF } from "jspdf";
import { marked } from "marked";

export async function exportMarkdownToPDF(markdown, filename = "plan.pdf") {
  // Convert markdown to HTML
  const html = marked.parse(markdown);

  // Create a temporary container for the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  tempDiv.style.width = "595px"; // A4 width in px at 72dpi
  tempDiv.style.padding = "32px";
  tempDiv.style.fontFamily = "Arial, sans-serif";
  tempDiv.style.background = "white";

  // Add markdown styles
  const style = document.createElement("style");
  style.innerHTML = `
    h1 { font-size: 1.5em; font-weight: bold; margin: 0.67em 0; }
    h2 { font-size: 1.2em; font-weight: bold; margin: 0.75em 0; }
    h3 { font-size: 1em; font-weight: bold; margin: 0.83em 0; }
    p { font-size: 0.95em; margin: 0.7em 0; }
    ul, ol { margin: 0.7em 0 0.7em 2em; }
    li { margin: 0.3em 0; }
    blockquote { border-left: 4px solid #ccc; margin: 0.7em 0; padding: 0.5em 1em; color: #555; background: #f9f9f9; }
    code, pre { background: #eee; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 6px 13px; }
    th { background: #f5f5f5; }
    a { color: #2351DC; text-decoration: underline; }
  `;
  tempDiv.prepend(style);

  document.body.appendChild(tempDiv);

  // Use jsPDF's html method for better text rendering and pagination
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  await pdf.html(tempDiv, {
    callback: function (doc) {
      doc.save(filename);
      document.body.removeChild(tempDiv);
    },
    margin: [32, 32, 32, 32], // top, left, bottom, right
    autoPaging: "text",
    x: 0,
    y: 0,
    width: 531, // 595 - 2*32
    windowWidth: 595,
  });
}

// Button for initial state - no plan generated yet
const GenerateButton = ({ onClick, disabled }) => {
  const { t } = useTranslation();

  return (
    <Button onClick={onClick} variant="outlined" disabled={disabled} fullWidth>
      <div className="flex items-center gap-2 py-3 px-1">
        <TbSparkles size={24} />
        <ButtonMedium color="#2351DC">{t("generatePlan")}</ButtonMedium>
      </div>
    </Button>
  );
};

// Button for generating state - plan is being generated
const GeneratingButton = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <Button variant="outlined" disabled={true} fullWidth>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 py-3 px-1">
            <CircularProgress variant="indeterminate" size={24} />
            <ButtonMedium color="#2351DC">{t("generating")}</ButtonMedium>
          </div>
        </div>
      </Button>
      <BodySmall className="text-center">
        {t("thisMightTakeAFewMinutes")}
      </BodySmall>
    </div>
  );
};

// Button for ready state - plan is generated and ready to view
const ViewPlanButton = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={onClick}
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: "#2351DC",
        "&:hover": {
          backgroundColor: "#2351DC",
        },
      }}
    >
      <ButtonMedium>{t("viewPlan")}</ButtonMedium>
    </Button>
  );
};

const GenerateActionPlanButton = ({
  action,
  selectedCity,
  onPlanGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateActionPlan({
        action: action?.action || action,
        city: selectedCity,
      });
      setGeneratedPlan(plan);
      if (onPlanGenerated) {
        onPlanGenerated(plan);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewPlan = () => {
    setIsPlanModalOpen(true);
  };

  return (
    <div className="space-y-2">
      {/* Render appropriate button based on state */}
      {!generatedPlan && !isGenerating && (
        <GenerateButton onClick={handleGeneratePlan} disabled={false} />
      )}

      {isGenerating && <GeneratingButton />}

      {generatedPlan && !isGenerating && (
        <ViewPlanButton onClick={handleViewPlan} />
      )}

      {/* Plan Modal */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plan={generatedPlan}
        plans={generatedPlan ? [generatedPlan] : []}
        isListView={false}
      />
    </div>
  );
};

export default GenerateActionPlanButton;
