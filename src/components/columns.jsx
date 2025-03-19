import {getImpactLevelClass} from "./ClimateActions.jsx";
import {getReductionPotential} from "../utils/helpers.js";

export const mitigationColumns = (t) => [
    {
        accessorKey: "actionPriority",
        header: t("rank"),
        size: 40,
    },
    {
        accessorFn: (row) => row.action?.ActionName,
        header: t("action"),
        size: 150,
        Cell: ({ cell }) => (
            <div>
                <strong>{cell.getValue()}</strong>
            </div>
        ),
    },
    {
        accessorFn: (row) => row.action?.Sector,
        header: t("sector"),
        size: 100,
    },
    {
        accessorFn: (row) => row.action?.GHGReductionPotential,
        header: t("reductionPotential"),
        size: 100,
        Cell: ({ cell }) => (
            <div>
                {getReductionPotential(cell.row.original.action)}
            </div>
        ),
    },
    {
        accessorFn: (row) => row.action?.CostInvestmentNeeded,
        header: t("estimatedCost"),
        size: 60,
        Cell: ({ cell }) => (
            <div>
                <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
            </div>
        ),
    },
    {
        accessorFn: (row) => row.action?.TimelineForImplementation,
        header: t("implementationTime"),
        size: 60,
    },
    {
        accessorFn: (row) => row.explanation,
        header: t("explanation"),
        size: 300,
        Cell: ({ cell }) => (
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
        accessorFn: (row) => row.action?.ActionName,
        header: t("action"),
        size: 150,
        Cell: ({ cell }) => (
            <div>
                <strong>{cell.getValue()}</strong>
                <br />
                <span className="text-gray-500">{cell.row.original.action?.ActionName}</span>
            </div>
        ),
    },
    {
        accessorFn: (row) => row.action?.Hazard,
        header: t("hazard"),
        Cell: ({ cell }) => (
            <div>
                {cell.getValue()?.join(", ")}
            </div>
        ),
        size: 100,
    },
    {
        accessorFn: (row) => row.action?.AdaptationEffectiveness,
        header: t("adaptationEffectiveness"),
        size: 100,
        Cell: ({ cell }) => (
            <div>
                <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
            </div>
        ),
    },
    {
        accessorFn: (row) => row.action?.CostInvestmentNeeded,
        header: t("estimatedCost"),
        size: 60,
        Cell: ({ cell }) => (
            <div>
                <span className={getImpactLevelClass(cell.getValue())}>{cell.getValue()}</span>
            </div>
        ),
    },
    {
        accessorFn: (row) => row.action?.TimelineForImplementation,
        header: t("implementationTime"),
        size: 60,
    },
    {
        accessorFn: (row) => row.explanation,
        header: t("explanation"),
        size: 300,
        Cell: ({ cell }) => (
            <div className="max-w-xs break-words">
                {cell.getValue() ? cell.getValue() : "N/A"}
            </div>
        ),
    },
];