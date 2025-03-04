import {getReductionPotential} from "../utils/helpers.js";

const getImpactLevelClass = (level) => {
    const classes = {
        Low: "bg-blue-100 text-blue-800 border border-blue-800",
        Medium: "bg-yellow-100 text-yellow-800 border border-yellow-800",
        High: "bg-red-100 text-red-800 border border-red-800",
    };
    return `${classes[level]} text-xs font-medium px-2 py-0.5 rounded-full`;
};


export const mitigationColumns = (t) => [
    {
        accessorKey: "actionPriority",
        header: t("rank"),
        size: 40,
    },
    {
        accessorKey: "action.ActionName",
        header: t("action"),
        size: 150,
        Cell: ({cell}) => (
            <div>
                <strong>{cell.getValue()}</strong>
            </div>
        ),
    },
    {
        accessorKey: "action.Sector",
        header: t("sector"),
        size: 100,
    },
    {
        accessorKey: "action.GHGReductionPotential",
        header: t("reductionPotential"),
        size: 100,
        Cell: ({cell}) => (
            <div>
                {getReductionPotential(cell.row.original.action)}
            </div>
        ),
    },
    {
        accessorKey: "action.CostInvestmentNeeded",
        header: () => (
            <div className="whitespace-normal">
                {t("estimatedCost")}
            </div>
        ),
        size: 80,
        Cell: ({cell}) => (
            <div>
                <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
            </div>
        ),
    },
    {
        accessorKey: "action.TimelineForImplementation",
        header: () => (
            <div className="whitespace-normal">
                {t("implementationTime")}
            </div>
        ),
        size: 80,
    },
    {
        accessorKey: "explanation",
        header: t("explanation"),
        size: 300,
        Cell: ({cell}) => (
            <div className="max-w-xs break-words">
                {cell.getValue() ? cell.getValue() : "N/A"}
            </div>
        ),
    },
];

export const adaptationColumns = (t) => [
    {
        accessorKey: "actionPriority",
        header: t("rank"),
        size: 40,
    },
    {
        accessorKey: "action.ActionName",
        header: t("action"),
        size: 150,
        Cell: ({cell}) => (
            <div>
                <strong>{cell.getValue()}</strong>
                <br/>
                <span className="text-gray-500">{cell.row.original.action.ActionName}</span>
            </div>
        ),
    },
    {
        accessorKey: "action.Hazard",
        header: t("hazard"),
        Cell: ({cell}) => (
            <div>
                {cell.getValue()?.join(", ")}
            </div>
        ),
        size: 100,
    },
    {
        accessorKey: "action.AdaptationEffectiveness",
        header: t("adaptationEffectiveness"),
        size: 100,
        Cell: ({cell}) => (
            <div>
                <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
            </div>
        ),
    },
    {
        accessorKey: "action.CostInvestmentNeeded",
        header: () => (
            <div className="whitespace-normal">
                {t("estimatedCost")}
            </div>
        ),
        size: 80,
        Cell: ({cell}) => (
            <div>
                <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
            </div>
        ),
    },
    {
        accessorKey: "action.TimelineForImplementation",
        header: () => (
            <div className="whitespace-normal">
                {t("implementationTime")}
            </div>
        ),
        size: 80,
    },
    {
        accessorKey: "explanation",
        header: t("explanation"),
        size: 300,
        Cell: ({cell}) => (
            <div className="max-w-xs break-words">
                {cell.getValue() ? cell.getValue() : "N/A"}
            </div>
        ),
    },
];