import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Box, Typography, Chip, Stack, IconButton } from "@mui/material";
import { RiExpandDiagonalFill } from "react-icons/ri";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { ActionDrawer } from "./ActionDrawer"; // TODO NINA

export const ACTION_TYPES = {
    Mitigation: "mitigation",
    Adaptation: "adaptation"
}

export const BarVisualization = ({ value, total }) => {
    return (
        <Stack direction="row" spacing={1}>
            {Array.from({ length: total }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        width: '16px',
                        height: '4px',
                        bgcolor: index < value ? 'primary.main' : 'grey.200',
                        borderRadius: '4px'
                    }}
                />
            ))}
        </Stack>
    );
};

export function ActionsTable({ type, actions, t }) {
    const lng = i18next.language;
    const [selectedAction, setSelectedAction] = useState(null);
    const [isTranslationsReady, setIsTranslationsReady] = useState(false);

    useEffect(() => {
        // Check if translations are ready
        const checkTranslations = async () => {
            try {
                await i18next.loadNamespaces('translation');
                setIsTranslationsReady(true);
            } catch (error) {
                console.error('Error loading translations:', error);
            }
        };
        checkTranslations();
    }, []);

    // Use the translation function with explicit namespace and fallback
    const translate = (key) => {
        const translation = t(key, { ns: 'translation' });
        return translation || key; // Fallback to key if translation is not available
    };

    const isAdaptation = type === ACTION_TYPES.Adaptation;

    const columns = [
        {
            accessorKey: "actionPriority",
            header: translate("ranking"),
            cell: ({ row }) => (
                <Chip
                    label={row.original.actionPriority}
                    color="primary"
                    size="small"
                />
            ),
        },
        {
            accessorKey: "action.ActionName",
            header: translate("action-name"),
            cell: ({ row }) => (
                <Stack spacing={1} alignItems="flex-start">
                    <Typography fontWeight="bold">{row.original.action.ActionName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {row.original.action.Description}
                    </Typography>
                </Stack>
            ),
        },
        ...(isAdaptation
            ? [
                {
                    id: "hazards-covered",
                    header: translate("hazards-covered"),
                    cell: ({ row }) => {
                        const action = row.original;
                        return (
                            <Chip
                                label={`${action.action.Hazard.length} ${translate("hazards")}`}
                                color="warning"
                                size="small"
                            />
                        );
                    },
                },
                {
                    id: "adaptation-effectiveness",
                    header: translate("effectiveness"),
                    cell: ({ row }) => {
                        const action = row.original;
                        const effectivenessMap = {
                            low: 1,
                            medium: 2,
                            high: 3,
                        };
                        const blueBars = effectivenessMap[action.action.AdaptationEffectiveness] || 0;
                        return <BarVisualization value={blueBars} total={3} />;
                    },
                },
            ]
            : [
                {
                    id: "sector",
                    header: translate("sector-label"),
                    cell: ({ row }) => {
                        const action = row.original;
                        return (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {action.action.Sector.map((sector) => (
                                    <Chip
                                        key={sector}
                                        label={translate(`sectors.${sector}`)}
                                        color="primary"
                                        size="small"
                                    />
                                ))}
                            </Stack>
                        );
                    },
                },
                {
                    id: "reduction-potential",
                    header: translate("ghg-reduction"),
                    cell: ({ row }) => {
                        const action = row.original;
                        const totalReduction = Object.values(action.action.GHGReductionPotential)
                            .filter(value => value !== null)
                            .map(value => parseFloat(value))
                            .reduce((sum, value) => sum + value, 0);
                        const blueBars = Math.min(Math.ceil(totalReduction / 20), 5);
                        return <BarVisualization value={blueBars} total={5} />;
                    },
                },
            ]),
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <IconButton
                    size="small"
                    onClick={() => {
                        setSelectedAction(row.original.action)
                        console.log("Open drawer for action:", row.original);
                    }}
                >
                    <RiExpandDiagonalFill />
                </IconButton>
            ),
        },
    ];

    const table = useReactTable({
        data: Array.isArray(actions) ? actions : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (!actions || actions.length === 0) {
        return <Box p={2}>{translate("no-actions-found")}</Box>;
    }

    return (
        <Box sx={{ overflowX: 'auto' }}>
            {selectedAction && (
                <ActionDrawer
                    action={selectedAction}
                    isOpen={!!selectedAction}
                    onClose={() => setSelectedAction(null)}
                    t={t}
                />
            )}
            <Box component="table" sx={{ width: "100%" }}>
                <Box component="thead">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Box component="tr" key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Box
                                    component="th"
                                    key={header.id}
                                    sx={{
                                        padding: "8px",
                                        textAlign: "left",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
                <Box component="tbody">
                    {table.getRowModel().rows.map((row) => (
                        <Box component="tr" key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Box
                                    component="td"
                                    key={cell.id}
                                    sx={{
                                        padding: "8px",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
