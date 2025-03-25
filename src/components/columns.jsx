import {getReductionPotential, joinToTitleCase, toTitleCase} from "../utils/helpers.js";
import { Tooltip } from 'react-tooltip'
import { MdInfoOutline } from "react-icons/md";

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
        Cell: ({cell}) => (
            <div>
                {joinToTitleCase(cell.getValue())}
            </div>
        ),
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
        header: t("estimatedCost"),
        size: 80,
        Cell: ({cell}) => (
            <div>
                <span className={getImpactLevelClass(cell.getValue())}>{toTitleCase(cell.getValue())}</span>
            </div>
        ),
    },
    {
        accessorKey: "action.TimelineForImplementation",
        header: t("implementationTime"),
        size: 80,
    },
    {
        accessorKey: "explanation",
        header: t("explanation"),
        size: 40,
        Cell: ({cell}) => {
            // Create a unique ID for tooltip anchor and content
            const tooltipId = `explanation-tooltip-${cell.row.index}`;

            return (
                <div className="flex justify-center items-center">
                    <div
                        id={tooltipId}
                        className="flex items-center cursor-pointer"
                        data-tooltip-id={`tooltip-content-${cell.row.index}`}
                        data-tooltip-content={cell.getValue() || "N/A"}
                    >
                        <MdInfoOutline className="text-lg" />
                    </div>

                    <Tooltip
                        id={`tooltip-content-${cell.row.index}`}
                        place="left"
                        className="z-[1000] max-w-xs"
                        positionStrategy="fixed"
                        style={{
                            maxWidth: "300px",
                            wordBreak: "break-word"
                        }}
                    />
                </div>
            );
        },  }
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
            </div>
        ),
    },
    {
        accessorKey: "action.Hazard",
        header: t("hazard"),
        Cell: ({cell}) => (
            <div>
                {joinToTitleCase(cell.getValue())}
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
                <span className={getImpactLevelClass(cell.getValue())}>{toTitleCase(cell.getValue())}</span>
            </div>
        ),
    },
    {
        accessorKey: "action.CostInvestmentNeeded",
        header: t("estimatedCost"),
        size: 80,
        Cell: ({cell}) => (
            <div>
                <span className={getImpactLevelClass(cell.getValue())}>{toTitleCase(cell.getValue())}</span>
            </div>
        ),
    },
    {
        accessorKey: "action.TimelineForImplementation",
        header: t("implementationTime"),
        size: 80,
    },
 {
        accessorKey: "explanation",
        header: t("explanation"),
        size: 40,
        Cell: ({cell}) => {
            // Create a unique ID for tooltip anchor and content
            const tooltipId = `explanation-tooltip-${cell.row.index}`;

            return (
                <div className="flex justify-center items-center">
                    <div
                        id={tooltipId}
                        className="flex items-center cursor-pointer"
                        data-tooltip-id={`tooltip-content-${cell.row.index}`}
                        data-tooltip-content={cell.getValue() || "N/A"}
                    >
                        <MdInfoOutline className="text-lg" />
                    </div>

                    <Tooltip
                        id={`tooltip-content-${cell.row.index}`}
                        place="left"
                        className="z-[1000] max-w-xs"
                        positionStrategy="fixed"
                        style={{
                            maxWidth: "300px",
                            wordBreak: "break-word"
                        }}
                    />
                </div>
            );
        },}
];