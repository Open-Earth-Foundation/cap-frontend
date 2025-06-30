import React, { useState } from "react";
import { Button } from "@mui/material";
import { ButtonMedium } from "./Texts/Button";
import { BodySmall } from "./Texts/Body.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import { TbSparkles } from "react-icons/tb";
import { generateActionPlan } from "../utils/planCreator.js";
import { useTranslation } from "react-i18next";
import PlanModal from "./PlanModal.jsx";

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
        action: action.action,
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
