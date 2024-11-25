import { React, useState, useEffect } from "react";
import './ClimateActions.css';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { adaptationColumns, mitigationColumns } from "./columns";
import { MRT_TableContainer, useMaterialReactTable } from "material-react-table";
import TopClimateActions from "./TopClimateActions.jsx";
import { MdOutlineFlood, MdOutlineLowPriority } from "react-icons/md";
import { FiArrowDownRight } from "react-icons/fi";
import { CSVLink } from "react-csv";
import { FiDownload } from "react-icons/fi";


const getImpactLevelClass = (level) => {
    const classes = {
        Low: "bg-blue-100 text-blue-800 border border-blue-800",
        Medium: "bg-yellow-100 text-yellow-800 border border-yellow-800",
        High: "bg-red-100 text-red-800 border border-red-800",
    };
    return `${classes[level]} text-xs font-medium px-2 py-0.5 rounded-full`;
};

const ClimateActions = ({
    selectedCity,
    data,
    loading,
    error,
    onBack
}) => {
    const [enableRowOrderingMitigation, setEnableRowOrderingMitigation] = useState(false);
    const [enableRowOrderingAdaptation, setEnableRowOrderingAdaptation] = useState(false);
    const [rankedDataMitigation, setRankedDataMitigation] = useState([]);
    const [rankedDataAdaptation, setRankedDataAdaptation] = useState([]);


    useEffect(() => {
        const filterActions = (type) => data.filter((action) => action.action_type === type);
        const addRank = (actions) => actions.map((action, index) => ({ ...action, id: index + 1 }));

        setRankedDataMitigation(addRank(filterActions("Mitigation")));
        setRankedDataAdaptation(addRank(filterActions("Adaptation")));
    }, [data]);

    const createTable = (columns, enableRowOrdering, rankedData, setRankedData) => {
        return useMaterialReactTable({
            autoResetPageIndex: false,
            columns,
            data: rankedData,
            enableRowOrdering,
            enableSorting: false,
            muiRowDragHandleProps: ({ table }) => ({
                onDragEnd: () => {
                    const { draggingRow, hoveredRow } = table.getState();
                    if (hoveredRow && draggingRow) {
                        rankedData.splice(
                            hoveredRow.index,
                            0,
                            rankedData.splice(draggingRow.index, 1)[0],
                        );
                        setRankedData([...rankedData]);
                    }
                },
            }),
        });
    };

    const table1 = createTable(
        mitigationColumns,
        enableRowOrderingMitigation,
        rankedDataMitigation,
        setRankedDataMitigation,
    );
    const table2 = createTable(
        adaptationColumns,
        enableRowOrderingAdaptation,
        rankedDataAdaptation,
        setRankedDataAdaptation,
    );

     // Prepare CSV data for export
      const prepareCsvData = (tableData, columns) => {
        return tableData.map(row => 
          columns.reduce((acc, column) => {
            const key = column.accessorKey;
            acc[column.header] = row[key];
            return acc;
          }, {})
        );
      };

      const mitigationCsvData = prepareCsvData(rankedDataMitigation, mitigationColumns);
      const adaptationCsvData = prepareCsvData(rankedDataAdaptation, adaptationColumns);

    return (
        <div className="max-w-screen-xl mx-auto p-12">
            <h1 className="text-2xl font-bold mb-4 text-[#232640] font-poppins">
                Climate actions prioritization for your city
            </h1>
            <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
                Discover the ranking of your city's climate actions according to their
                effectiveness, costs and benefits, helping you to prioritize those with
                the greatest potential for impact.
            </p>
            <Tabs>
                <TabList className="flex justify-left mb-12 my-8 tab-actions">
                    <Tab>
                        <FiArrowDownRight />
                        <span className="tab-text">Mitigation</span>
                    </Tab>
                    <Tab>
                        <div>
                            <MdOutlineFlood />
                        </div>
                        <span className="tab-text">Adaptation</span>
                    </Tab>
                </TabList>
<TabPanel>
      <div className="rounded-lg overflow-hidden">
        <TopClimateActions actions={data} type="Mitigation" />
        <div className="flex justify-between mt-12 mb-8">
          <h2 className="text-2xl font-normal text-gray-900 font-poppins">
            Ranking list of climate actions
          </h2>
          <div className="flex gap-4">
            <button
              className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold modify-rankings"
              onClick={() => setEnableRowOrderingMitigation((prev) => !prev)}
            >
              <div>
                <MdOutlineLowPriority />
              </div>
              MODIFY RANKINGS
            </button>
            <CSVLink
              data={mitigationCsvData}
              filename={`${selectedCity}_mitigation_actions.csv`}
              className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold download-csv download-table"
            >
                <FiDownload />
              DOWNLOAD CSV
            </CSVLink>
          </div>
        </div>
        <MRT_TableContainer table={table1} />
      </div>
    </TabPanel>
    <TabPanel>
      <div className="rounded-lg overflow-hidden">
        <TopClimateActions actions={data} type="Adaptation" />
        <div className="flex justify-between mt-12 mb-8">
          <h2 className="text-2xl font-normal text-gray-900 font-poppins">
            Ranking list of climate actions
          </h2>
          <div className="flex gap-4">
            <button
              className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold modify-rankings"
              onClick={() => setEnableRowOrderingAdaptation((prev) => !prev)}
            >
              <div>
                <MdOutlineLowPriority />
              </div>
              MODIFY RANKINGS
            </button>
            <CSVLink
              data={adaptationCsvData}
              filename={`${selectedCity}_adaptation_actions.csv`}
              className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold download-csv download-table"
            >
            <FiDownload />
              DOWNLOAD CSV
            </CSVLink>
          </div>
        </div>
        <MRT_TableContainer table={table2} />
      </div>
    </TabPanel>
  </Tabs>
</div>
);
};

export default ClimateActions;