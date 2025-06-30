import React, { useEffect, useState } from "react";
import {
  writeFile,
  writeSelectedActionsFile,
  readFile,
  readSelectedActionsFile,
} from "../utils/readWrite.js";
import { isAdaptation } from "../utils/helpers.js";
import { useTranslation } from "react-i18next";
import { ActionDrawer } from "./ActionDrawer.jsx";
import TopClimateActions from "./TopClimateActions.jsx";
import { Button, IconButton } from "@mui/material";
import { DownloadButton } from "./DownloadButton.jsx";
import { ButtonMedium } from "./Texts/Button.jsx";
import { ActionsTable } from "./ActionsTable.jsx";
import { MdCheckBox, MdInfoOutline } from "react-icons/md";
import { BodyLarge, BodyMedium } from "./Texts/Body.jsx";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const ClimateActionsType = ({ type, selectedCity }) => {
  const [shortList, setShortList] = useState([]);
  const [longList, setLongList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [enableRowSelection, setEnableRowSelection] = useState(false);
  const [selectedActionIds, setSelectedActionIds] = useState([]);
  const [showLongList, setShowLongList] = useState(false);

  const { t, i18n } = useTranslation();

  // Adapter function to transform API data to match ActionsTable format
  const adaptLongListData = (apiData, type) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((item, index) => ({
      actionId: item.ActionID,
      actionName: item.ActionName || "Unknown Action",
      actionPriority: index + 1,
      explanation: item.Description || "",
      action: {
        ActionID: item.ActionID,
        ActionName: item.ActionName || "Unknown Action",
        ActionType: item.ActionType || [],
        Hazard: item.Hazard || [],
        Sector: item.Sector || [],
        Subsector: item.Subsector || [],
        PrimaryPurpose: item.PrimaryPurpose || [],
        Description: item.Description || "",
        CoBenefits: item.CoBenefits || {},
        EquityAndInclusionConsiderations:
          item.EquityAndInclusionConsiderations || null,
        GHGReductionPotential: item.GHGReductionPotential || {},
        AdaptationEffectiveness: item.AdaptationEffectiveness || null,
        CostInvestmentNeeded: item.CostInvestmentNeeded || null,
        TimelineForImplementation: item.TimelineForImplementation || null,
        Dependencies: Array.isArray(item.Dependencies) ? item.Dependencies : [],
        KeyPerformanceIndicators: Array.isArray(item.KeyPerformanceIndicators)
          ? item.KeyPerformanceIndicators
          : [],
        PowersAndMandates: item.PowersAndMandates || null,
        AdaptationEffectivenessPerHazard:
          item.AdaptationEffectivenessPerHazard || {},
        biome: item.biome || null,
      },
    }));
  };

  // Function to handle action selection
  const handleActionSelection = (actionId, checked) => {
    setSelectedActionIds((prev) => {
      if (checked) {
        // Only allow 3 selections maximum and prevent duplicates
        if (prev.length >= 3 || prev.includes(actionId)) {
          return prev;
        }
        return [...prev, actionId];
      } else {
        return prev.filter((id) => id !== actionId);
      }
    });
  };

  // Function to get selected actions data
  const getSelectedActionsData = () => {
    // Ensure selectedActionIds is an array and contains valid action IDs
    if (!Array.isArray(selectedActionIds) || selectedActionIds.length === 0) {
      return [];
    }

    const longListData = adaptLongListData(longList, type);
    const allActions = [...shortList, ...longListData];

    const selectedActions = allActions.filter((action) =>
      selectedActionIds.includes(action.actionId)
    );

    // Remove duplicates by keeping only the first occurrence of each actionId
    const uniqueActions = selectedActions.filter(
      (action, index, self) =>
        index === self.findIndex((a) => a.actionId === action.actionId)
    );

    return uniqueActions;
  };

  // Function to get top 3 actions from main table (not long list)
  const getTop3FromShortListTable = () => {
    return shortList.slice(0, 3);
  };

  // Function to restore selected state from saved data
  const restoreSelectedState = async () => {
    // Load selected action IDs from the selected actions file
    const selectedIds = await readSelectedActionsFile(selectedCity, type);
    // Ensure selectedIds is an array and no duplicates when restoring
    const validSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];
    setSelectedActionIds([...new Set(validSelectedIds)]);
  };

  // Reset selections when selection mode is disabled
  useEffect(() => {
    if (!enableRowSelection) {
      // Don't clear selectedActionIds when disabling selection mode
      // This allows bookmark icons to remain visible after saving
    }
  }, [enableRowSelection]);

  // Fetch climate actions from the API
  useEffect(() => {
    const fetchClimateActions = async () => {
      try {
        const response = await fetch(
          `https://ccglobal.openearth.dev/api/v0/climate_actions?language=${i18n.language}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Filter actions for this specific type
        const typeActions = data.filter((action) =>
          action.ActionType?.includes(type)
        );

        setLongList(typeActions);

        console.log(`${type} actions fetched successfully:`, {
          total: typeActions.length,
        });
      } catch (error) {
        console.error(`Error fetching ${type} actions:`, error);
      }
    };

    fetchClimateActions();
  }, [type, i18n.language]); // Empty dependency array means this runs once on component mount

  // Load data and restore selections when component mounts or city changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCity) return;
      setLoading(true);
      setError(null);
      try {
        const data = (await readFile(selectedCity, type)).sort(
          (a, b) => a.actionPriority - b.actionPriority
        );
        setShortList(data);

        // Restore selections
        await restoreSelectedState();
      } catch (err) {
        console.error(`Failed to fetch data: ${err.message}`, err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity, type, i18n.language]);

  const saveNewRanking = () => {
    const updatedRanking = shortList.map((action, index) => ({
      ...action,
      actionPriority: index + 1,
    }));

    // Update state immediately
    setShortList(updatedRanking);

    // Pass the updated data directly to the save function
    onSaveRankings(updatedRanking);
  };

  const onSaveRankings = async (updatedData = null) => {
    setIsSaving(true);

    // Use the passed updatedData if available, otherwise use current state
    let dataToSave = updatedData || shortList;

    try {
      // Save all selected action IDs to the selected actions file
      await writeSelectedActionsFile(selectedCity, selectedActionIds, type);
      console.log(
        `Saved ${selectedActionIds.length} selected action IDs to separate file`
      );

      // Save the main data (without selected flags)
      await writeFile(selectedCity, dataToSave, type);

      // Reload selected actions to ensure they persist after saving
      await restoreSelectedState();

      setEnableRowSelection(false);
      setIsSaving(false);
    } catch (error) {
      console.error("🔍 Error in onSaveRankings:", error);
      setIsSaving(false);
    }
  };

  const longListData = adaptLongListData(longList, type);

  return (
    <>
      {selectedAction && (
        <ActionDrawer
          action={selectedAction}
          isOpen={!!selectedAction}
          onClose={() => setSelectedAction(null)}
          t={t}
        />
      )}

      <div className="rounded-lg overflow-hidden">
        <TopClimateActions
          actions={
            selectedActionIds.length > 0
              ? getSelectedActionsData()
              : getTop3FromShortListTable()
          }
          type={type}
          setSelectedAction={setSelectedAction}
          selectedCity={selectedCity}
        />

        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-normal text-gray-900 font-poppins">
            {enableRowSelection
              ? t("selectListOfClimateActions")
              : t("rankingListOfClimateActions")}
          </h2>
          <p className="text-base font-normal leading-relaxed tracking-wide font-opensans mt-2">
            {enableRowSelection
              ? t("selectActionsDescription")
              : t("applyYourLocalExpertise")}
          </p>
          {enableRowSelection && (
            <p className="text-sm text-gray-600 mt-2">
              {selectedActionIds.length === 0
                ? t("selectUpTo3Actions")
                : selectedActionIds.length === 3
                ? t("maximumActionsSelected")
                : t("selectMoreActions", {
                    count: 3 - selectedActionIds.length,
                  })}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <div className="flex justify-end">
            <IconButton
              sx={{
                border: "1px solid #E8EAFB",
                borderRadius: "4px",
                padding: "4px 16px",
                fontSize: "14px",
                fontWeight: "600",
                marginRight: "16px",
                height: "40px",
                backgroundColor: enableRowSelection ? "#E8EAFB" : "white",
              }}
              variant={enableRowSelection ? "outlined" : "contained"}
              disabled={enableRowSelection}
              onClick={async () => {
                await restoreSelectedState();
                setEnableRowSelection(true);
              }}
            >
              <div className="flex items-center gap-2">
                <MdCheckBox
                  size={30}
                  color={enableRowSelection ? "#2351DC" : "#4B4C63"}
                />
                <ButtonMedium
                  color={enableRowSelection ? "#2351DC" : "#4B4C63"}
                >
                  {enableRowSelection
                    ? `${t("pickTopActions")} (${selectedActionIds.length}/3)`
                    : t("pickTopActions")}
                </ButtonMedium>
              </div>
            </IconButton>
          </div>

          {/* Download and save buttons section */}
          <div className="flex justify-end gap-4 mb-8">
            {enableRowSelection && (
              <>
                <Button
                  onClick={() => saveNewRanking()}
                  disabled={isSaving}
                  variant="contained"
                  sx={{
                    backgroundColor: "#2351DC",
                    "&:hover": {
                      backgroundColor: "#2351DC",
                    },
                    borderRadius: "100px",
                    padding: "4px 16px",
                  }}
                >
                  {t("saveRankings")}
                </Button>
              </>
            )}

            {enableRowSelection && (
              <>
                <Button
                  onClick={() => {
                    setEnableRowSelection(false);
                  }}
                  variant="text"
                  sx={{
                    color: "#2351DC",
                    "&:hover": {
                      color: "#2351DC",
                    },
                    padding: "4px 16px",
                  }}
                >
                  {t("climateActionsUI.cancel").toUpperCase()}
                </Button>
              </>
            )}

            {!enableRowSelection && (
              <DownloadButton
                type={type}
                selectedCity={selectedCity}
                t={t}
                adaptationData={isAdaptation(type) ? shortList : []}
                mitigationData={!isAdaptation(type) ? shortList : []}
              />
            )}
          </div>
        </div>

        <ActionsTable
          type={type}
          actions={shortList}
          t={t}
          showRanking={true}
          enableRowSelection={enableRowSelection}
          selectedActions={selectedActionIds}
          onActionSelectionChange={handleActionSelection}
        />

        {/* Toggle button for long list */}
        <div className="flex justify-center my-6">
          <button
            onClick={() => setShowLongList(!showLongList)}
            className="flex items-center gap-2 py-2 rounded-lg bg-[#E8EAFB] w-full justify-center"
          >
            <BodyMedium color="#2351DC">
              {showLongList
                ? t("hideUnrankedActions")
                : t("viewUnrankedActions")}
            </BodyMedium>
            {showLongList ? (
              <FiChevronUp size={20} color="#2351DC" />
            ) : (
              <FiChevronDown size={20} color="#2351DC" />
            )}
          </button>
        </div>

        {/* Long list table - conditionally rendered */}
        {showLongList && (
          <>
            <div className="flex items-center gap-2 my-[80px] border border-gray-[#D7D8FA] rounded-lg p-4">
              <MdInfoOutline color="#2351DC" size={"16px"} />
              <BodyLarge>{t("unrankedDisclaimer")}</BodyLarge>
            </div>
            <ActionsTable
              type={type}
              actions={longListData}
              t={t}
              enableRowSelection={enableRowSelection}
              selectedActions={selectedActionIds}
              onActionSelectionChange={handleActionSelection}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ClimateActionsType;
