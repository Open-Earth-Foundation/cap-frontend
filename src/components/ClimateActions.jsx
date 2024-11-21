import { useState, React } from "react";
import './ClimateActions.css';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import climateActions from "../data/climateActions.js";
import { mitigationColumns, adaptationColumns } from "./columns";
import {
  useMaterialReactTable,
  MRT_TableContainer,
} from "material-react-table";
import TopClimateActions from "./TopClimateActions.jsx";
import { MdOutlineFlood } from "react-icons/md";
import { FiArrowDownRight } from "react-icons/fi";
import { MdOutlineLowPriority } from "react-icons/md";



const getImpactLevelClass = (level) => {
  const classes = {
    Low: "bg-blue-100 text-blue-800 border border-blue-800",
    Medium: "bg-yellow-100 text-yellow-800 border border-yellow-800",
    High: "bg-red-100 text-red-800 border border-red-800",
  };
  return `${classes[level]} text-xs font-medium px-2 py-0.5 rounded-full`;
};

const createTable = (type, columns, enableRowOrdering) => {
  const filterActions = climateActions.filter(
    (action) => action.action_type === type,
  );

  const dataWithRank = filterActions.map((action, index) => ({
    ...action,
    id: index + 1,
  }));

  const [data, setData] = useState(() => dataWithRank);

  return useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    data,
    enableRowOrdering,
    enableSorting: false,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          data.splice(
            hoveredRow.index,
            0,
            data.splice(draggingRow.index, 1)[0],
          );
          setData([...data]);
        }
      },
    }),
  });
};

const ClimateActions = () => {
  const [enableRowOrderingMitigation, setEnableRowOrderingMitigation] =
    useState(false);
  const [enableRowOrderingAdaptation, setEnableRowOrderingAdaptation] =
    useState(false);

  const table1 = createTable(
    "Mitigation",
    mitigationColumns,
    enableRowOrderingMitigation,
  );
  const table2 = createTable(
    "Adaptation",
    adaptationColumns,
    enableRowOrderingAdaptation,
  );

  return (
    <div className="max-w-screen-xl mx-auto p-12">
      <h1 className="text-2xl font-bold mb-4 text-[#232640] font-poppins">
        Climate actions prioritization for your city
      </h1>
      <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
        {" "}
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
            <TopClimateActions actions={climateActions} type="Mitigation" />
            {/* Botón para alternar la funcionalidad de mover filas */}
            <div className="flex justify-between mt-12 mb-8">
              <h2 className="text-2xl font-normal text-gray-900 font-poppins">
                Ranking list of climate actions
              </h2>
              <button
                className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] font-semibold modify-rankings"
                onClick={() => setEnableRowOrderingMitigation((prev) => !prev)}
              >
                <div>
                  <MdOutlineLowPriority />
                </div>
                MODIFY RANKINGS
              </button>
            </div>
            <MRT_TableContainer table={table1} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="rounded-lg overflow-hidden">
            <TopClimateActions actions={climateActions} type="Adaptation" />
            {/* Botón para alternar la funcionalidad de mover filas */}
            <div className="flex justify-between mt-12 ">
              <h2 className="text-lg font-bold text-[#232640]">
                Ranking list of climate actions
              </h2>
              <button
                className="px-4 py-2 rounded border border-solid border-[#E8EAFB] font-semibold color-[#4B4C63]"
                onClick={() => setEnableRowOrderingAdaptation((prev) => !prev)}
              >
                MODIFY RANKINGS
              </button>
            </div>
            <MRT_TableContainer table={table2} />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ClimateActions;
