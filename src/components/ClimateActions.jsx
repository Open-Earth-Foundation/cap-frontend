import { useEffect, useState } from "react";
import "./ClimateActions.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { adaptationColumns, mitigationColumns } from "./columns";
import { MRT_TableContainer, useMaterialReactTable, } from "material-react-table";
import { MdOutlineFlood, MdOutlineLowPriority, MdOutlineSave, } from "react-icons/md";
import { FiArrowDownRight } from "react-icons/fi";
import { writeFile } from "../utils/readWrite.js";
import { ADAPTATION, isAdaptation, MITIGATION, } from "../utils/helpers.js";
import { useTranslation } from "react-i18next";
import { ADAPTA_BRASIL_API } from "./constants.js";
import { generateActionPlan } from "../utils/planCreator.js";
import PlanModal from "./PlanModal.jsx";
import { ActionDrawer } from "./ActionDrawer.jsx";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { MRT_Localization_PT } from 'material-react-table/locales/pt';
import TopClimateActions from "./TopClimateActions.jsx";
import CityData from "./CityData.jsx";
import { Button, IconButton } from "@mui/material";
import { DownloadButton } from "./DownloadButton.jsx";
import { ButtonMedium } from "./Texts/Button.jsx";
import { ActionsTable } from "./ActionsTable.jsx";
import { MdOutlineBookmark } from "react-icons/md";

const ClimateActions = ({
    selectedCity,
    selectedLocode,
    mitigationData,
    setMitigationData,
    adaptationData,
    setAdaptationData,
}) => {
    const [enableRowOrdering, setEnableRowOrdering] = useState(false);
    const [isGenerating, setIsGenerating] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedAction, setSelectedAction] = useState();
    const [selectedActions, setSelectedActions] = useState([]);
    const [enableRowSelection, setEnableRowSelection] = useState(false);
    const [generatedPlans, setGeneratedPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    // Add row selection state for each table type
    const [mitigationRowSelection, setMitigationRowSelection] = useState({});
    const [adaptationRowSelection, setAdaptationRowSelection] = useState({});
    const { t, i18n } = useTranslation();

    const generatePlans = async (type) => {
        setIsGenerating(true);
        // const selectedNumbers = getSelectedActions(type)
        const selectedNumbers = getTopActions(type)
        const actions = isAdaptation(type) ? adaptationData : mitigationData
        const selectedActions = Object.entries(selectedNumbers)
            .filter(([_actionNumber, selected]) => !!selected)
            .map(([actionNumber, _selected]) => actions[actionNumber])
        const plans = await Promise.all(selectedActions.map((action) => {
            return generateActionPlan({ action: action.action, city: selectedCity });
        }));
        setGeneratedPlans(plans);
        // setIsGenerating(false);
        // setEnableRowSelection(false)
    }

    const addRank = (actions) =>
        actions.map((action, index) => ({ ...action, id: index + 1 }));
    const saveNewRanking = (type) => (newRanking) => {
        const updatedRanking = newRanking.map((action, index) => ({
            ...action,
            actionPriority: index + 1,
        }));

        if (isAdaptation(type)) {
            setAdaptationData(addRank(updatedRanking));
        } else {
            setMitigationData(addRank(updatedRanking));
        }
    };

    const getLocalization = (language) => {
        switch (language) {
            case 'es':
                return MRT_Localization_ES;
            case 'pt':
                return MRT_Localization_PT;
            default:
                return undefined;
        }
    }

    const setSelectedActionByIndex = type => i => {
        setSelectedAction(type === MITIGATION ? mitigationData[i] : adaptationData[i]);
    }

    const onSaveRankings = async (type) => {
        setIsSaving(true);
        if (isAdaptation(type)) {
            await writeFile(selectedCity, adaptationData, ADAPTATION);
            setAdaptationData(adaptationData);
        } else {
            await writeFile(selectedCity, mitigationData, MITIGATION);
            setMitigationData(mitigationData);
        }
        // Force a refresh of the data after saving
        setEnableRowOrdering(false);
        setIsSaving(false);
    };




    useEffect(() => {
        const fetchActions = async () => {
            try {
                setIsLoading(true);
                const adaptationResponse = await fetch(
                    `${ADAPTA_BRASIL_API}/climate-actions?city=${selectedCity}&type=adaptation`,
                );
                const adaptationData = await adaptationResponse.json();

                setAdaptationData(adaptationData);

                const mitigationResponse = await fetch(
                    `${ADAPTA_BRASIL_API}/climate-actions?city=${selectedCity}&type=mitigation`,
                );
                const mitigationData = await mitigationResponse.json();

                setMitigationData(mitigationData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching climate actions:", error);
                setIsLoading(false);
            }
        };

        fetchActions();
    }, [selectedCity]);

    if (isLoading || (mitigationData.length === 0 && adaptationData.length === 0))
        return <>Loading</>;

    function getSelectedActions(type) {
        return isAdaptation(type) ? adaptationRowSelection : mitigationRowSelection;
    }

    function getTopActions() {
        return {
            "0": true,
            "1": true,
            "2": true
        }
    }

    // Check if there are any selected actions
    const hasSelectedActions = (type) => {
        return Object.keys(getSelectedActions(type)).length > 0;
    };

    return (<>
        <CityData selectedLocode={selectedLocode} />
        <div className="max-w-screen-xl mx-auto p-12">
            <h1 className="text-2xl font-bold mb-4 text-[#232640] font-poppins">
                {t("topActionsTitle")}
            </h1>
            <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
                {t("topActionsDescription")}
            </p>

            <Tabs>
                <TabList className="flex justify-left mb-0 my-8 tab-actions">
                    <Tab onClick={() => {
                        setEnableRowOrdering(false);
                        setEnableRowSelection(false);
                    }}>
                        <FiArrowDownRight />
                        <span className="tab-text">{t("mitigation")}</span>
                    </Tab>
                    <Tab onClick={() => {
                        setEnableRowOrdering(false);
                        setEnableRowSelection(false);
                    }}>
                        <div>
                            <MdOutlineFlood />
                        </div>
                        <span className="tab-text">{t("adaptation")}</span>
                    </Tab>
                </TabList>
                {[MITIGATION, ADAPTATION].map((type) => (
                    <TabPanel key={type}>
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
                                actions={isAdaptation(type) ? adaptationData : mitigationData}
                                type={type}
                                setSelectedAction={setSelectedAction}
                                selectedCity={selectedCity}
                                setGeneratedPlan={setGeneratedPlans}
                                generatedPlans={generatedPlans}
                                setGeneratedPlans={setGeneratedPlans}
                                generatePlans={generatePlans}
                            />

                            <div className="mt-12 mb-8">
                                <h2 className="text-2xl font-normal text-gray-900 font-poppins">
                                    {enableRowSelection ? t("selectListOfClimateActions") : t("rankingListOfClimateActions")}
                                </h2>
                                <p className="text-base font-normal leading-relaxed tracking-wide font-opensans mt-2">
                                    {enableRowSelection ? t("selectActionsDescription") : t("applyYourLocalExpertise")}
                                </p>
                            </div>
                            <div className="flex justify-end">
                                {/* Modify button section */}
                                <div className="flex justify-end">

                                    <IconButton
                                        sx={{
                                            border: '1px solid #E8EAFB',
                                            borderRadius: '4px',
                                            padding: '8px 8px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginRight: '16px',
                                            height: '40px',
                                            backgroundColor: enableRowOrdering ? "#E8EAFB" : "white",
                                        }}
                                        variant={enableRowOrdering ? "outlined" : "contained"}
                                        disabled={enableRowOrdering}
                                        onClick={() => {
                                            setEnableRowSelection(false)
                                            setEnableRowOrdering(true)
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <MdOutlineLowPriority size={30} color={enableRowOrdering ? '#2351DC' : '#4B4C63'} />
                                            <ButtonMedium color={enableRowOrdering ? '#2351DC' : '#4B4C63'}>{t("clickToModify")}</ButtonMedium>
                                        </div>
                                    </IconButton>
                                </div>

                                {/* Download and save buttons section */}
                                <div className="flex justify-end gap-4 mb-8">
                                    {enableRowOrdering && (
                                        <>
                                            <Button
                                                onClick={(data) => onSaveRankings(type, data)}
                                                disabled={isSaving}
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#2351DC",
                                                    '&:hover': {
                                                        backgroundColor: "#2351DC",
                                                    },
                                                    borderRadius: "100px",
                                                }}
                                            >
                                                {t("saveRankings")}
                                            </Button>
                                        </>
                                    )}

                                    {enableRowOrdering && (<>
                                        <Button
                                            onClick={() => setEnableRowOrdering(false)}
                                            variant="text"
                                            sx={{
                                                color: "#2351DC",
                                                '&:hover': {
                                                    color: "#2351DC",
                                                },
                                            }}
                                        >
                                            {t("cancel").toUpperCase()}
                                        </Button></>)}

                                    {!enableRowOrdering && <DownloadButton type={type} selectedCity={selectedCity} t={t} adaptationData={adaptationData} mitigationData={mitigationData} generatedPlans={generatedPlans} />}
                                </div>
                            </div>
                            <ActionsTable
                                type={type}
                                actions={isAdaptation(type) ? adaptationData : mitigationData}
                                t={t}
                                enableRowOrdering={enableRowOrdering}
                                onRowOrderChange={(updatedItems) => {
                                    if (isAdaptation(type)) {
                                        setAdaptationData(updatedItems);
                                    } else {
                                        setMitigationData(updatedItems);
                                    }
                                }}
                            />



                            {/* Plan Modal */}
                            <PlanModal
                                isOpen={isPlanModalOpen}
                                onClose={() => setIsPlanModalOpen(false)}
                                plans={generatedPlans}
                                isListView={false}
                            />
                        </div>
                    </TabPanel >
                ))}
            </Tabs >
        </div >
    </>
    );
};

export default ClimateActions;


