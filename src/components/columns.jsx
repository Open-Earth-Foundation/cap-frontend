import {getReductionPotential} from "../utils/helpers.js";

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
    accessorKey: "action_name",
    header: "Action",
    size: 200,
    Cell: ({ cell }) => (
      <div>
        <strong>{cell.getValue()}</strong>
        <br />
        <span className="text-gray-500">{cell.row.original.action_description}</span>
      </div>
    ),
  },
  {
    accessorKey: "sector",
    header: "Sector",
    size: 150,
  },
  {
    accessorKey: "ghg_reduction_potential",
    header: "Reduction Potential",
    size: 150,
    Cell: ({ cell }) => (
    <div>
      {getReductionPotential(cell.row.original)}
    </div>
  ),
  },
  {
    accessorKey: "estimated_cost",
    header: "Estimate cost",
    size: 150,
    Cell: ({ cell }) => (
      <div>
        <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "timeline_for_implementation",
    header: "Implementation time",
    size: 150,
  },
];

export const adaptationColumns = [
  {
    accessorKey: "id",
    header: "Rank",
    size: 10,
  },
  {
    accessorKey: "action_name",
    header: "Action",
    size: 200,
    Cell: ({ cell }) => (
      <div>
        <strong>{cell.getValue()}</strong>
        <br />
        <span className="text-gray-500">{cell.row.original.action_description}</span>
      </div>
    ),
  },
  {
    accessorKey: "hazard",
    header: "Hazard",
    size: 150,
  },
  {
    accessorKey: "risk_potential",
    header: "Risk Level",
    size: 150,
    Cell: ({ cell }) => (
      <div>
        <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "estimated_cost",
    header: "Estimate cost",
    size: 150,
    Cell: ({ cell }) => (
      <div>
        <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
      </div>
    ),
  },
  {
    accessorKey: "timeline_for_implementation",
    header: "Implementation time",
    size: 150,
  },
];
