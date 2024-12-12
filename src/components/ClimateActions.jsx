import {React, useState} from "react";
import "./ClimateActions.css";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {adaptationColumns, mitigationColumns} from "./columns";
import {MRT_TableContainer, useMaterialReactTable,} from "material-react-table";
import TopClimateActions from "./TopClimateActions.jsx";
import {MdInfoOutline, MdOutlineFlood, MdOutlineLowPriority, MdOutlineSave,} from "react-icons/md";
import {FiArrowDownRight, FiDownload} from "react-icons/fi";
import {CSVLink} from "react-csv";
import {writeFile} from "../utils/readWrite.js";
import {ADAPTATION, isAdaptation, MITIGATION, prepareCsvData,} from "../utils/helpers.js";
import {GiSandsOfTime} from "react-icons/gi";
import ActionDetailsModal from "./ActionDetailsModal.jsx";

const getImpactLevelClass = (level) => {
    const classes = {
        Low: "bg-blue-100 text-blue-800 border border-blue-800",
        Medium: "bg-yellow-100 text-yellow-800 border border-yellow-800",
        High: "bg-red-100 text-red-800 border border-red-800",
    };
    return `${classes[level]} text-xs font-medium px-2 py-0.5 rounded-full`;
};

const ClimateActions = ({
                            selectedCity, mitigationData,
                            setMitigationData,
                            adaptationData,
                            setAdaptationData
                        }) => {
    const [enableRowOrdering, setEnableRowOrdering] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedAction, setSelectedAction] = useState()

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


    const infoColumn = {
        id: "infoButton",
        header: "",
        size: 50,
        Cell: ({cell}) => (
            <button onClick={() => setSelectedAction(cell.row.original.action)}>
                <MdInfoOutline/>
            </button>
        ),
    }

    const createTable = (
        columns,
        enableRowOrdering,
        rankedData,
        setRankedData,
        type,
    ) => {
        return useMaterialReactTable({
            autoResetPageIndex: false,
            columns: [...columns, infoColumn],
            data: rankedData,
            enableRowOrdering,
            initialState: {},
            muiTableHeadCellProps: {
                sx: {
                    backgroundColor: '#E8EAFB', // Desired background color
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

    const mitigationTable = createTable(
        mitigationColumns,
        enableRowOrdering,
        mitigationData,
        (newRanking) => {
            setMitigationData(newRanking);
            saveNewRanking("Mitigation");
        },
        MITIGATION,
    );
    const adaptationTable = createTable(
        adaptationColumns,
        enableRowOrdering,
        adaptationData,
        (newRanking) => {
            setAdaptationData(newRanking);
            saveNewRanking("Adaptation");
        },
        ADAPTATION,
    );

    const onSaveRankings = async () => {
        setIsSaving(true);
        if (isAdaptation(type)) {
            await writeFile(selectedCity, adaptationData, ADAPTATION);
            setAdaptationData(adaptationData);
        } else {
            await writeFile(selectedCity, mitigationData, MITIGATION);
            setMitigationData(mitigationData)
        }
        // Force a refresh of the data after saving
        setEnableRowOrdering(false);
        setIsSaving(false);
    };
    const mitigationCsvData = prepareCsvData(
        mitigationData,
        mitigationColumns,
    );
    const adaptationCsvData = prepareCsvData(
        adaptationData,
        adaptationColumns,
    );

    return (
        <div className="max-w-screen-xl mx-auto p-12">

            <h1 className="text-2xl font-bold mb-4 text-[#232640] font-poppins">
                Climate actions prioritization for your city
            </h1>
            <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
                Discover the ranking of your city's climate actions according to
                their effectiveness, costs and benefits, helping you to
                prioritize those with the greatest potential for impact.
            </p>
            <Tabs>
                <TabList className="flex justify-left mb-12 my-8 tab-actions">
                    <Tab onClick={() => setEnableRowOrdering(false)}>
                        <FiArrowDownRight/>
                        <span className="tab-text">Mitigation</span>
                    </Tab>
                    <Tab onClick={() => setEnableRowOrdering(false)}>
                        <div>
                            <MdOutlineFlood/>
                        </div>
                        <span className="tab-text">Adaptation</span>
                    </Tab>
                </TabList>
                {[MITIGATION, ADAPTATION].map((type) => (
                    <TabPanel key={type}>
                        <ActionDetailsModal type={type} cityAction={selectedAction}
                                            onClose={() => setSelectedAction(null)}/>

                        <div className="rounded-lg overflow-hidden">
                            <TopClimateActions actions={data} type={type} setSelectedAction={setSelectedAction}
                                               selectedCity={selectedCity}/>
                            <div className="mt-12 mb-8">
                                <h2 className="text-2xl font-normal text-gray-900 font-poppins">
                                    Ranking list of climate actions
                                </h2>
                                <p className="text-base font-normal leading-relaxed tracking-wide font-opensans mt-2">
                                    Apply your local expertise to customize action priorities. Reorder based on your
                                    city's specific needs, feasibility, and potential impacts. Save your changes and
                                    download the complete table to share with stakeholders.
                                </p>
                            </div>
                            <div className="flex justify-end gap-4 mb-8">
                                {!enableRowOrdering && (
                                    <button
                                        className="flex items-center justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold modify-rankings h-fit"
                                        onClick={() =>
                                            setEnableRowOrdering(true)
                                        }
                                    >
                                        <div>
                                            <MdOutlineLowPriority/>
                                        </div>
                                        MODIFY RANKINGS
                                    </button>
                                )}
                                {enableRowOrdering && (
                                    <>
                                        <button
                                            className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold modify-rankings"
                                            onClick={() =>
                                                setEnableRowOrdering(false)
                                            }
                                        >
                                            <div>
                                                <MdOutlineLowPriority/>
                                            </div>
                                            CANCEL SORTING
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold save-rankings"
                                            onClick={onSaveRankings}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <GiSandsOfTime className="text-lg"/>
                                            ) : (
                                                <MdOutlineSave lassName="text-lg"/>
                                            )}
                                            SAVE RANKINGS
                                        </button>
                                    </>
                                )}
                                <CSVLink
                                    data={
                                        isAdaptation(type)
                                            ? adaptationCsvData
                                            : mitigationCsvData
                                    }
                                    filename={`${selectedCity}_${type}_actions.csv`}
                                    className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold download-csv download-table"
                                >
                                    <FiDownload/>
                                    DOWNLOAD CSV
                                </CSVLink>
                            </div>
                            <MRT_TableContainer
                                table={
                                    isAdaptation(type)
                                        ? adaptationTable
                                        : mitigationTable
                                }
                            />
                        </div>
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};

export default ClimateActions;
