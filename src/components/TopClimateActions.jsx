import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { getReductionPotential, getTimelineTranslationKey, isAdaptation, joinToTitleCase, toTitleCase } from "../utils/helpers.js";
import PlanModal from "./PlanModal";
import { useTranslation } from "react-i18next";
import { ButtonMedium } from "./Texts/Button";
import { Button } from "@mui/material";

const TopClimateActions = ({
    actions,
    type,
    setSelectedAction,
    selectedCity,
    setGeneratedPlan,
    generatedPlans,
    setGeneratedPlans,
    generatePlans,
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [localGeneratedPlan, setLocalGeneratedPlan] = useState("");
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

    const [isPlansListModalOpen, setIsPlansListModalOpen] = useState(false);

    const { t, i18n } = useTranslation();

    // Get top 3 actions of the specified type
    const topActions = actions
        .sort((a, b) => a.actionPriority - b.actionPriority)
        .slice(0, 3);

    const getProgressBars = (action) => {
        if (isAdaptation(type)) {
            const level = action?.AdaptationEffectiveness;
            const filledBars = level === "high" ? 3 : level === "medium" ? 2 : 1;
            const color =
                level === "high"
                    ? "bg-blue-500"
                    : level === "medium"
                        ? "bg-blue-400"
                        : "bg-blue-300";

            return Array(3)
                .fill()
                .map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 w-1/2 rounded ${i < filledBars ? color : "bg-gray-200"}`}
                    />
                ));
        } else {
            // Mitigation logic
            const potential = getReductionPotential(action);
            const potentialValue = potential ? parseInt(potential.split("-")[0]) : 0; // Get the lower bound
            const getBarColor = (value) => {
                if (value >= 80) return "bg-blue-500"; // Very high
                if (value >= 60) return "bg-blue-400"; // High
                if (value >= 40) return "bg-blue-300"; // Medium
                if (value >= 20) return "bg-blue-200"; // Low
                return "bg-blue-100"; // Very low
            };

            const filledBars =
                potentialValue >= 80
                    ? 5
                    : potentialValue >= 60
                        ? 4
                        : potentialValue >= 40
                            ? 3
                            : potentialValue >= 20
                                ? 2
                                : 1;

            const color = getBarColor(potentialValue);

            return Array(5)
                .fill()
                .map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 w-1/3 rounded ${i < filledBars ? color : "bg-gray-200"
                            }`}
                    />
                ));
        }
    };
    const onGenerateActionPlansClick = async () => {
        setIsGenerating(true);
        await generatePlans(type);
        setIsGenerating(false);
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mt-8">
                <h1 className="text-2xl font-normal text-gray-900 font-poppins">
                    {t(`top${type}ClimateActions`)}
                </h1>
                <Button
                    onClick={onGenerateActionPlansClick}
                    variant="outlined"
                    sx={{
                        borderColor: '#2351DC',
                        '&:hover': {
                            borderColor: '#2351DC',
                        },
                        textTransform: 'uppercase',
                        borderRadius: '4px',
                        padding: '16px',
                    }}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <div className="flex items-center">
                            <FiLoader className="animate-spin mr-2" />
                            <ButtonMedium color="#2351DC">{t("generating")}</ButtonMedium>
                        </div>
                    ) : (
                        <ButtonMedium color="#2351DC">
                            {t("generatePlan")}
                        </ButtonMedium>
                    )}
                </Button>
            </div>

            {/*Top Mitigatons Cards*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topActions.map(({ action }, index) => (
                    /* Mitigation Card */
                    <div
                        key={index}
                        className={`p-6 space-y-4 border rounded-lg shadow-sm bg-white font-opensans ${index === 0
                            ? "border-t-4 border-t-primary first-card ring-1 ring-blue-100"
                            : "shadow-sm"
                            }`}
                    >
                        {/*Index*/}
                        <div className="flex justify-between items-center">
                            <span className="text-4xl font-bold text-gray-900 font-poppins">
                                #{index + 1}
                            </span>
                            <ButtonMedium color="#2351DC">{t("expertsChoice")}</ButtonMedium>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-gray-900 font-poppins">
                                {action?.ActionName}
                            </h2>
                            <p className="text-gray-600 text-md line-clamp-2 font-opensans">
                                {action?.Description}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                            <div className="flex gap-2 ">{getProgressBars(action)}</div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-600">
                                    {isAdaptation(type)
                                        ? t("adaptationPotential")
                                        : t("reductionPotential")}
                                </span>
                                <p className="text-gray-600 text-sm font-semibold line-clamp-2 font-opensans">
                                    {isAdaptation(type)
                                        ? toTitleCase(action?.AdaptationEffectiveness)
                                        : getReductionPotential(action)}
                                </p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">{t("sector")}</span>
                                <span className="text-gray-600 font-semibold">
                                    {joinToTitleCase(action?.Sector, t) || joinToTitleCase(action?.Hazard, t)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">{t("estimatedCost")}</span>
                                <span className="text-gray-600 font-semibold">
                                    {toTitleCase(t(action?.CostInvestmentNeeded))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">{t("implementationTime")}</span>
                                <span className="text-gray-600 font-semibold">
                                    {t(getTimelineTranslationKey(action?.TimelineForImplementation))}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4">
                            <button
                                onClick={() => setSelectedAction(action)}
                                className="text-primary hover:text-primary-dark font-semibold"
                            >
                                {t("seeMoreDetails")}
                            </button>

                        </div>

                        {/* Modals */}
                        <PlanModal
                            isOpen={isPlanModalOpen}
                            onClose={() => setIsPlanModalOpen(false)}
                            plan={localGeneratedPlan}
                            plans={generatedPlans}
                            isListView={false}
                        />
                    </div>
                ))}
            </div>
            {
                generatedPlans.length > 0 && (
                    <button
                        onClick={() => setIsPlansListModalOpen(true)}
                        className="mt-6 flex items-center gap-2 px-4 py-2 bg-white text-primary border border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                    >
                        {t("seeGeneratedPlans")} ({generatedPlans.length})
                    </button>
                )
            }
            <PlanModal
                isOpen={isPlansListModalOpen}
                onClose={() => setIsPlansListModalOpen(false)}
                plans={generatedPlans}
                isListView={true}
            />
        </div >
    );
};

export default TopClimateActions;
