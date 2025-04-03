import {useEffect, useState} from "react";
import "./ClimateActions.css";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {adaptationColumns, mitigationColumns} from "./columns";
import {MRT_TableContainer, useMaterialReactTable,} from "material-react-table";
import {MdOutlineFlood, MdOutlineLowPriority, MdOutlineSave,} from "react-icons/md";
import {FiArrowDownRight, FiDownload, FiFileText} from "react-icons/fi";
import {CSVLink} from "react-csv";
import {writeFile} from "../utils/readWrite.js";
import {ADAPTATION, isAdaptation, MITIGATION, prepareCsvData,} from "../utils/helpers.js";
import {GiSandsOfTime} from "react-icons/gi";
import {exportToPDF} from "../utils/exportUtils.js";
import {useTranslation} from "react-i18next";
import {ADAPTA_BRASIL_API} from "./constants.js";
import {generateActionPlan} from "../utils/planCreator.js";
import PlanModal from "./PlanModal.jsx";
import ActionDetailsModal from "./ActionDetailsModal.jsx";

const ClimateActions = ({
                            selectedCity,
                            mitigationData,
                            setMitigationData,
                            adaptationData,
                            setAdaptationData,
                        }) => {
    const [enableRowOrdering, setEnableRowOrdering] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedAction, setSelectedAction] = useState();
    const [selectedActions, setSelectedActions] = useState([]);
    const [enableRowSelection, setEnableRowSelection] = useState(false);
    const [stage, setStage] = useState(0)
    const [generatedPlans, setGeneratedPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    // Add row selection state for each table type
    const [mitigationRowSelection, setMitigationRowSelection] = useState({});
    const [adaptationRowSelection, setAdaptationRowSelection] = useState({});
    const {t} = useTranslation();

    const generatePlans = async (type) => {
        setIsGenerating(true);
        const selectedNumbers = getSelectedActions(type)
        const actions = isAdaptation(type) ? adaptationData : mitigationData
        const selectedActions = Object.entries(selectedNumbers)
            .filter(([_actionNumber, selected]) => !!selected)
            .map(([actionNumber, _selected]) => actions[actionNumber])
        const plans = await Promise.all(selectedActions.map((action) => {
            return generateActionPlan({action: action.action, city: selectedCity});
        }));
        setGeneratedPlans(plans);
        setIsGenerating(false);
        setEnableRowSelection(false)
    }

    const addRank = (actions) =>
        actions.map((action, index) => ({...action, id: index + 1}));
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

    // Function to handle selected rows
    const handleSelectedRowsChange = (type, rowSelection) => {
        // Get the data based on type
        const data = isAdaptation(type) ? adaptationData : mitigationData;

        // Get selected rows based on rowSelection object
        const selectedRows = Object.keys(rowSelection)
            .filter(key => rowSelection[key] === true)
            .map(key => data[parseInt(key, 10)]);

        setSelectedActions(selectedRows);
    };

    const createTable = (
        columns,
        enableRowOrdering,
        rankedData,
        setRankedData,
        type,
    ) => {
        // Determine which row selection state to use based on type
        const rowSelection = isAdaptation(type) ? adaptationRowSelection : mitigationRowSelection;
        const setRowSelection = isAdaptation(type) ? setAdaptationRowSelection : setMitigationRowSelection;

        return useMaterialReactTable({
            autoResetPageIndex: false,
            columns: [...columns],
            data: rankedData,
            enableRowOrdering,
            // Only enable row selection when enableRowSelection is true
            enableRowSelection: enableRowSelection,
            state: {
                rowSelection
            },
            onRowSelectionChange: (updatedRowSelection) => {
                setRowSelection(updatedRowSelection); // Update the row selection state
                handleSelectedRowsChange(type, updatedRowSelection); // Process selected rows
            },
            enablePagination: false,
            muiTableHeadCellProps: {
                sx: {
                    backgroundColor: "#E8EAFB",
                },
            },
            muiRowDragHandleProps: ({table}) => ({
                onDragEnd: () => {
                    const {draggingRow, hoveredRow} = table.getState();
                    if (hoveredRow && draggingRow) {
                        rankedData.splice(
                            hoveredRow.index,
                            0,
                            rankedData.splice(draggingRow.index, 1)[0],
                        );
                        setRankedData([...rankedData]);
                        saveNewRanking(type)(rankedData);
                    }
                },
            }),
        });
    };

    const setSelectedActionByIndex = type => i => {
        setSelectedAction(type === MITIGATION ? mitigationData[i] : adaptationData[i]);
    }
    const mitigationTable = createTable(
        mitigationColumns(t, setSelectedActionByIndex(MITIGATION)),
        enableRowOrdering,
        mitigationData,
        (newRanking) => {
            setMitigationData(newRanking);
            saveNewRanking(MITIGATION);
        },
        MITIGATION,
    );
    const adaptationTable = createTable(
        adaptationColumns(t, setSelectedActionByIndex(ADAPTATION)),
        enableRowOrdering,
        adaptationData,
        (newRanking) => {
            setAdaptationData(newRanking);
            saveNewRanking(ADAPTATION);
        },
        ADAPTATION,
    );

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

    const getCsvColumns = (columns) => {
         columns.splice(2, 1); // Remove the 3rd item (index 2)
        columns.pop(); // Remove the last item
        return columns;
    }

    const mitigationCsvData = prepareCsvData(
        mitigationData,
        getCsvColumns(mitigationColumns(t)),
    );
    const adaptationCsvData = prepareCsvData(
        adaptationData,
        getCsvColumns(adaptationColumns(t)),
    );

    // Reset row selection when enableRowSelection changes
    useEffect(() => {
        if (!enableRowSelection) {
            setMitigationRowSelection({});
            setAdaptationRowSelection({});
            setSelectedActions([]);
        }
    }, [enableRowSelection]);

    useEffect(() => {
        const fetchActions = async () => {
            try {
                const adaptationResponse = await fetch(
                    `${ADAPTA_BRASIL_API}/climate-actions?city=${selectedCity}&type=adaptation`,
                );
                const adaptationData = await adaptationResponse.json();
                console.log(
                    "%c COMPLETE API RESPONSE FOR ADAPTATION",
                    "background: #ff0000; color: white; font-size: 20px",
                );
                console.log(JSON.stringify(adaptationData, null, 2));
                if (adaptationData.length > 0) {
                    console.log(
                        "%c FIRST ADAPTATION ACTION COMPLETE STRUCTURE",
                        "background: #00ff00; color: black; font-size: 20px",
                    );
                    console.log(JSON.stringify(adaptationData[0], null, 2));
                    console.log(
                        "%c ADAPTATION ACTION KEYS (ALL FIELDS)",
                        "background: #0000ff; color: white; font-size: 20px",
                    );
                    console.log(Object.keys(adaptationData[0]));

                    console.log(
                        "%c ADAPTATION ACTION FIELDS WITH DATA TYPES",
                        "background: #9900ff; color: white; font-size: 20px",
                    );
                    const fieldTypes = {};
                    Object.entries(adaptationData[0]).forEach(([key, value]) => {
                        fieldTypes[key] = typeof value;
                        if (Array.isArray(value)) fieldTypes[key] = "array";
                        if (value === null) fieldTypes[key] = "null";
                    });
                    console.log(fieldTypes);
                }
                setAdaptationData(adaptationData);

                const mitigationResponse = await fetch(
                    `${ADAPTA_BRASIL_API}/climate-actions?city=${selectedCity}&type=mitigation`,
                );
                const mitigationData = await mitigationResponse.json();
                console.log(
                    "%c COMPLETE API RESPONSE FOR MITIGATION",
                    "background: #ff0000; color: white; font-size: 20px",
                );
                console.log(JSON.stringify(mitigationData, null, 2));
                if (mitigationData.length > 0) {
                    console.log(
                        "%c FIRST MITIGATION ACTION COMPLETE STRUCTURE",
                        "background: #00ff00; color: black; font-size: 20px",
                    );
                    console.log(JSON.stringify(mitigationData[0], null, 2));
                    console.log(
                        "%c MITIGATION ACTION KEYS (ALL FIELDS)",
                        "background: #0000ff; color: white; font-size: 20px",
                    );
                    console.log(Object.keys(mitigationData[0]));

                    console.log(
                        "%c MITIGATION ACTION FIELDS WITH DATA TYPES",
                        "background: #9900ff; color: white; font-size: 20px",
                    );
                    const fieldTypes = {};
                    Object.entries(mitigationData[0]).forEach(([key, value]) => {
                        fieldTypes[key] = typeof value;
                        if (Array.isArray(value)) fieldTypes[key] = "array";
                        if (value === null) fieldTypes[key] = "null";
                    });
                    console.log(fieldTypes);
                }
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

    // Check if there are any selected actions
    const hasSelectedActions = (type) => {
        console.log("getSelectedActions(type)", JSON.stringify(getSelectedActions(type), null, 2)) // TODO NINA
        return Object.keys(getSelectedActions(type)).length > 0;
    };

    return (
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
                        <FiArrowDownRight/>
                        <span className="tab-text">{t("mitigation")}</span>
                    </Tab>
                    <Tab onClick={() => {
                        setEnableRowOrdering(false);
                        setEnableRowSelection(false);
                    }}>
                        <div>
                            <MdOutlineFlood/>
                        </div>
                        <span className="tab-text">{t("adaptation")}</span>
                    </Tab>
                </TabList>
                {[MITIGATION, ADAPTATION].map((type) => (
                    <TabPanel key={type}>
                        {selectedAction && (
                            <ActionDetailsModal
                                type={type}
                                cityAction={selectedAction}
                                onClose={() => setSelectedAction(null)}
                            />
                        )}

                        <div className="rounded-lg overflow-hidden">
                            {/*<TopClimateActions*/}
                            {/*    actions={isAdaptation(type) ? adaptationData : mitigationData}*/}
                            {/*    type={type}*/}
                            {/*    setSelectedAction={setSelectedAction}*/}
                            {/*    selectedCity={selectedCity}*/}
                            {/*    setGeneratedPlan={setGeneratedPlans}*/}
                            {/*    generatedPlans={generatedPlans}*/}
                            {/*    setGeneratedPlans={setGeneratedPlans}*/}
                            {/*/>*/}

                            <div className="mt-12 mb-8">
                                <h2 className="text-2xl font-normal text-gray-900 font-poppins">
                                    {enableRowSelection ? t("selectListOfClimateActions") : t("rankingListOfClimateActions")}
                                </h2>
                                <p className="text-base font-normal leading-relaxed tracking-wide font-opensans mt-2">
                                    {enableRowSelection ? t("selectActionsDescription") : t("applyYourLocalExpertise")}
                                </p>
                            </div>

                            {/* Modify button section */}
                            <div id="modify" className="modify-container">
                                <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
                                    {stage === 0 ? t("wantToModify") : t("wantToDownload")}
                                </p>
                                {!enableRowOrdering && stage === 0 && (
                                    <button
                                        className="flex items-center justify-center gap-4 mx-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] button font-semibold modify-rankings h-fit"
                                        onClick={() => {
                                            setEnableRowSelection(false)
                                            setEnableRowOrdering(true)
                                        }}
                                    >
                                        {t("clickToModify")}
                                    </button>
                                )}
                            </div>

                            {/* Action buttons section */}
                            <div className="flex justify-end gap-4 mb-8">
                                {enableRowOrdering && (
                                    <>
                                        <button
                                            className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] button font-semibold modify-rankings"
                                            onClick={() => setEnableRowOrdering(false)}
                                        >
                                            <div>
                                                <MdOutlineLowPriority/>
                                            </div>
                                            {t("cancelSorting")}
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] button font-semibold save-rankings"
                                            onClick={(data) => onSaveRankings(type, data)}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <GiSandsOfTime className="text-lg"/>
                                            ) : (
                                                <MdOutlineSave className="text-lg"/>
                                            )}
                                            {t("saveRankings")}
                                        </button>
                                    </>
                                )}

                                {stage === 1 && (<>
                                    <CSVLink
                                        data={
                                            isAdaptation(type) ? adaptationCsvData : mitigationCsvData
                                        }
                                        filename={`${selectedCity}_${type}_actions.csv`}
                                        className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold download-csv download-table button"
                                    >
                                        <FiDownload/>
                                        {t("downloadCsv")}
                                    </CSVLink>
                                    <button
                                        onClick={() =>
                                            exportToPDF(
                                                selectedCity,
                                                mitigationData,
                                                adaptationData,
                                                generatedPlans,
                                            )
                                        }
                                        className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] button font-semibold download-csv download-table"
                                    >
                                        <FiFileText/>
                                        {t("exportPdf")}
                                    </button>
                                </>)}
                            </div>

                            {/* Table */}
                            <MRT_TableContainer
                                table={isAdaptation(type) ? adaptationTable : mitigationTable}
                            />

                            {/* Select Actions button - only show when not in selection or ordering mode */}
                            {!enableRowSelection && !enableRowOrdering && (
                                <button
                                    id="selectActions"
                                    className={`flex items-center justify-center gap-4 px-4 py-2 rounded border border-solid font-semibold modify-rankings h-fit my-4 mx-auto   
                                    ${generatedPlans.length === 0 ? 'button' : 'text-[#4B4C63] border-[#E8EAFB]'}`}
                                    onClick={() => {
                                        setStage(1)
                                        setEnableRowSelection(true)
                                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the screen
                                    }}
                                >
                                    {t("selectActions")}
                                </button>
                            )}

                            {/* Generate Plans button - only show in selection mode and not ordering mode */}
                            {enableRowSelection && !enableRowOrdering && (
                                <button
                                    id="generatePlans"
                                    className={`flex items-center justify-center gap-4 px-4 py-2 rounded border border-solid button font-semibold modify-rankings h-fit my-4 mx-auto ${
                                        isGenerating || !hasSelectedActions(type) ? 'text-gray-400 border-gray-400 bg-gray-100 cursor-not-allowed' : 'text-[#4B4C63] border-[#E8EAFB] hover:bg-gray-50'
                                    }`}
                                    onClick={() => generatePlans(type)}
                                    disabled={isGenerating || !hasSelectedActions(type)}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="animate-pulse">⟳</span>
                                            {t("generating")}...
                                        </>
                                    ) : (
                                        t("generatePlans")
                                    )}
                                </button>
                            )}

                            {/* See Generated Plans button */}
                            {generatedPlans && generatedPlans.length > 0 && (
                                <button
                                    id="SeeGeneratedPlans"
                                    className="flex items-center justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] button font-semibold modify-rankings h-fit my-4 mx-auto"
                                    onClick={() => setIsPlanModalOpen(true)}
                                >
                                    {t("seeGeneratedPlans")}
                                </button>
                            )}


                            {/* Plan Modal */}
                            <PlanModal
                                isOpen={isPlanModalOpen}
                                onClose={() => setIsPlanModalOpen(false)}
                                plans={generatedPlans}
                                isListView={false}
                            />
                        </div>
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};

export default ClimateActions;