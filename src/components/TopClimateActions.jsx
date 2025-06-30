import React from "react";
import {
  getReductionPotential,
  getTimelineTranslationKey,
  isAdaptation,
  joinToTitleCase,
  toTitleCase,
} from "../utils/helpers.js";
import { useTranslation } from "react-i18next";
import { ButtonMedium } from "./Texts/Button";
import { Divider } from "@mui/material";
import { BodyLarge } from "./Texts/Body.jsx";

import { MdBookmark } from "react-icons/md";
import GenerateActionPlanButton from "./GenerateActionPlanButton.jsx";

const TopClimateActions = ({
  actions,
  type,
  setSelectedAction,
  selectedCity,
}) => {
  const { t, i18n } = useTranslation();

  // Get actions to display - either selected actions or top 3 actions of the specified type
  const displayActions = actions && actions.length > 0 ? actions : [];

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
            className={`h-1 w-1/2 rounded ${
              i < filledBars ? color : "bg-gray-200"
            }`}
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
            className={`h-1 w-1/3 rounded ${
              i < filledBars ? color : "bg-gray-200"
            }`}
          />
        ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mt-8">
        <h1 className="text-2xl font-normal text-gray-900 font-poppins">
          {displayActions.length > 0
            ? t("selectedClimateActions")
            : t(`top${type}ClimateActions`)}
        </h1>
      </div>
      <BodyLarge color="black">
        {displayActions.length > 0
          ? t("selectedActionsDescription")
          : t("topClimateActionsDescription")}
      </BodyLarge>
      {/*Top Mitigatons Cards*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayActions.map(({ action }, index) => (
          /* Mitigation Card */
          <div
            key={index}
            className={`p-6 flex flex-col h-full border rounded-lg shadow-sm bg-white font-opensans ${"shadow-sm"}`}
          >
            {/* Content area - takes up available space */}
            <div className="flex-1 space-y-4">
              {/*Index*/}
              <div className="flex justify-between items-center">
                {/* <span className="text-4xl font-bold text-gray-900 font-poppins">
                  #{index + 1}
                </span> */}
                <div className="flex items-center gap-2">
                  <MdBookmark color="#2351DC" />
                  <ButtonMedium color="#2351DC">
                    {t("expertsChoice")}
                  </ButtonMedium>
                </div>
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
                      ? toTitleCase(t(action?.AdaptationEffectiveness))
                      : getReductionPotential(action)}
                  </p>
                </div>
                <Divider flexItem />
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("sector")}</span>
                  <span
                    className="text-gray-600 font-semibold"
                    style={{ textAlign: "right" }}
                  >
                    {joinToTitleCase(action?.Sector, t) ||
                      joinToTitleCase(action?.Hazard, t)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("estimatedCost")}</span>
                  <span className="text-gray-600 font-semibold">
                    {toTitleCase(t(action?.CostInvestmentNeeded))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {t("implementationTime")}
                  </span>
                  <span className="text-gray-600 font-semibold">
                    {t(
                      getTimelineTranslationKey(
                        action?.TimelineForImplementation
                      )
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setSelectedAction(action)}
                  className="text-primary hover:text-primary-dark font-semibold underline"
                >
                  {t("seeMoreDetails")}
                </button>
              </div>
            </div>

            {/* Button area - pushed to bottom */}
            <div className="mt-4 space-y-2">
              <GenerateActionPlanButton
                action={action}
                selectedCity={selectedCity}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopClimateActions;
