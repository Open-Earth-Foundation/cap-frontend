import {getReductionPotential} from "../utils/helpers.js";
import { MdInfoOutline } from "react-icons/md";

const getImpactLevelClass = (level) => {
  const classes = {
    Low: "bg-blue-100 text-blue-800 border border-blue-800",
    Medium: "bg-yellow-100 text-yellow-800 border border-yellow-800",
    High: "bg-red-100 text-red-800 border border-red-800",
  };
  return `${classes[level]} text-xs font-medium px-2 py-0.5 rounded-full`;
};


export const mitigationColumns = [
  {
    accessorKey: "id",
    header: "Rank",
    size: 50,
  },
  {
    accessorKey: "action.ActionName",
    header: "Action",
    size: 200,
    Cell: ({ cell }) => (
      <div>
        <strong>{cell.getValue()}</strong>
        <br />
        <span className="text-gray-500">{cell.row.original.action.ActionName}</span>
      </div>
    ),
  },
  {
    accessorKey: "action.Sector",
    header: "Sector",
    size: 150,
  },
  {
    accessorKey: "action.GHGReductionPotential",
    header: "Reduction Potential",
    size: 150,
    Cell: ({ cell }) => (
    <div>
      {getReductionPotential(cell.row.original.action)}
    </div>
  ),
  },
  {
    accessorKey: "action.CostInvestmentNeeded",
    header: "Estimate cost",
    size: 150,
    Cell: ({ cell }) => (
      <div>
        <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "action.TimelineForImplementation",
    header: "Implementation time",
    size: 150,
  },
];

export const adaptationColumns = [
  {
    accessorKey:  "actionPriority",
    header: "Rank",
    size: 50,
  },
  {
    accessorKey: "action.ActionName",
    header: "Action",
    size: 200,
    Cell: ({ cell }) => (
      <div>
        <strong>{cell.getValue()}</strong>
        <br />
        <span className="text-gray-500">{cell.row.original.action.ActionName}</span>
      </div>
    ),
  },
  {
    accessorKey: "action.Hazard",
    header: "Hazard",
       Cell: ({ cell }) => (
      <div>
      {cell.getValue().join(", ")}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "action.AdaptationEffectiveness",
    header: "Adaptation Effectiveness",
    size: 150,
    Cell: ({ cell }) => (
      <div>
        <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "action.CostInvestmentNeeded",
    header: "Estimate cost",
    size: 150,
    Cell: ({ cell }) => (
      <div>
        <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "action.TimelineForImplementation",
    header: "Implementation time",
    size: 150,
  },
];
