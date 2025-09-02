import { useEffect, useState, useMemo } from "react";
import i18next from "i18next";
import {
  Box,
  Chip,
  Stack,
  IconButton,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { MdBookmark, MdDragIndicator } from "react-icons/md";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ActionDrawer } from "./ActionDrawer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BiExpandAlt } from "react-icons/bi";
import { MdInfoOutline } from "react-icons/md";
import { Tooltip } from 'react-tooltip';
import { BodyMedium } from "./Texts/Body.jsx";
import SectorFilterButton from "./SectorFilterButton.jsx";

export const ACTION_TYPES = {
  Mitigation: "mitigation",
  Adaptation: "adaptation",
};

export const BarVisualization = ({ value, total }) => {
  return (
    <Stack direction="row" spacing={1} width="250px">
      {Array.from({ length: total }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: "32px",
            height: "4px",
            bgcolor: index < value ? "primary.main" : "grey.200",
            borderRadius: "4px",
          }}
        />
      ))}
    </Stack>
  );
};

const SortableRow = ({ row, children, enableRowOrdering }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.original.actionId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: enableRowOrdering ? "grab" : "default",
    position: "relative",
    zIndex: isDragging ? 1 : 0,
    backgroundColor: isDragging ? "rgba(0, 0, 0, 0.04)" : "transparent",
  };

  return (
    <Box
      component="tr"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(enableRowOrdering ? listeners : {})}
    >
      {children}
    </Box>
  );
};

export function ActionsTable({
  type,
  actions,
  t,
  showRanking = false,
  enableRowOrdering = false,
  onRowOrderChange,
  enableRowSelection = false,
  selectedActions = [],
  onActionSelectionChange,
  showSectorFilter = false,
  loading = false,
}) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [items, setItems] = useState(actions || []);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    setItems(actions || []);
  }, [actions]);

  // Determine filter field and options based on type
  const isAdaptation = type === ACTION_TYPES.Adaptation;
  const filterField = isAdaptation ? "Hazard" : "Sector";

  // Get all available filter options from the data
  const availableFilters = useMemo(() => {
    if (!showSectorFilter) return [];
    return [
      ...new Set(
        items.flatMap((item) => {
          const action = item.action || item;
          return Array.isArray(action[filterField]) ? action[filterField] : [];
        })
      ),
    ];
  }, [items, showSectorFilter, filterField]);

  // Filter items based on selected filter options
  const filteredItems = useMemo(() => {
    if (!showSectorFilter || selectedFilters.length === 0) {
      return items;
    }
    return items.filter((item) => {
      const action = item.action || item;
      return (
        action[filterField] &&
        Array.isArray(action[filterField]) &&
        action[filterField].some((val) => selectedFilters.includes(val))
      );
    });
  }, [items, selectedFilters, showSectorFilter, filterField]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.actionId === active.id);
        const newIndex = items.findIndex((item) => item.actionId === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update actionPriority for each item
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          actionPriority: index + 1,
        }));

        if (onRowOrderChange) {
          onRowOrderChange(updatedItems);
        }
        return updatedItems;
      });
    }
  };

  const handleActionSelection = (actionId, checked) => {
    if (onActionSelectionChange) {
      // Check if we're trying to select and already have 3 selections
      if (checked && selectedActions.length >= 3) {
        return; // Don't allow more than 3 selections
      }
      onActionSelectionChange(actionId, checked);
    }
  };

  // Selection column
  const selectionColumn = {
    id: "selection",
    header: enableRowSelection ? (
      <div className="flex flex-col items-center">
        <Checkbox
          checked={selectedActions.length === items.length && items.length > 0}
          indeterminate={
            selectedActions.length > 0 && selectedActions.length < items.length
          }
          onChange={(event) => {
            if (event.target.checked) {
              // Select all (up to 3)
              const maxToSelect = Math.min(3, items.length);
              const currentSelected = selectedActions.length;
              const toSelect = Math.min(
                maxToSelect - currentSelected,
                items.length
              );

              let selectedCount = 0;
              items.forEach((item) => {
                if (
                  selectedCount < toSelect &&
                  !selectedActions.includes(item.actionId)
                ) {
                  handleActionSelection(item.actionId, true);
                  selectedCount++;
                }
              });
            } else {
              // Deselect all
              selectedActions.forEach((actionId) => {
                handleActionSelection(actionId, false);
              });
            }
          }}
        />
        <span className="text-xs text-gray-500 mt-1">
          {selectedActions.length}/3
        </span>
      </div>
    ) : null,
    size: 50,
    cell: ({ row }) =>
      enableRowSelection ? (
        <Checkbox
          checked={selectedActions.includes(row.original.actionId)}
          onChange={(event) =>
            handleActionSelection(row.original.actionId, event.target.checked)
          }
          disabled={
            !selectedActions.includes(row.original.actionId) &&
            selectedActions.length >= 3
          }
        />
      ) : null,
  };

  const rankColumn = {
    accessorKey: "actionPriority",
    header: t("ranking"),
    size: 50,
    cell: ({ row }) => (
      <Stack direction="row" spacing={1} alignItems="center">
        {enableRowOrdering && (
          <MdDragIndicator
            style={{
              cursor: "grab",
              color: "#666",
              fontSize: "20px",
            }}
          />
        )}
        <BodyMedium>#{row.original.actionPriority}</BodyMedium>
      </Stack>
    ),
  };

  const columns = [
    ...(enableRowSelection ? [selectionColumn] : []),
    ...(showRanking ? [rankColumn] : []),
    {
      accessorKey: "actionName",
      header: t("action-name"),
      size: 300,
      cell: ({ row }) => {
        return (
          <Stack spacing={1} alignItems="flex-start">
            <div className="flex items-center gap-2 ">
              {selectedActions.includes(row.original.actionId) && (
                <MdBookmark size={30} color="#2351DC" />
              )}
              <BodyMedium fontWeight="bold">
                {row.original.action.ActionName}
              </BodyMedium>
            </div>
          </Stack>
        );
      },
    },
    ...(isAdaptation
      ? [
          {
            id: "hazards-covered",
            header: t("hazards-covered"),
            size: 150,
            cell: ({ row }) => {
              const action = row.original.action || row.original;
              return (
                <Chip
                  label={`${action.Hazard.length} ${t("hazards")}`}
                  color="warning"
                  size="small"
                />
              );
            },
          },
          {
            id: "adaptation-effectiveness",
            header: t("effectiveness"),
            size: 150,
            cell: ({ row }) => {
              const action = row.original.action || row.original;
              const effectivenessMap = {
                low: 1,
                medium: 2,
                high: 3,
              };
              const blueBars =
                effectivenessMap[action.AdaptationEffectiveness] || 0;
              return <BarVisualization value={blueBars} total={3} />;
            },
          },
        ]
      : [
          {
            id: "sector",
            header: t("sector-label"),
            size: 100,
            cell: ({ row }) => {
              const action = row.original.action || row.original;
              return (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {action.Sector.map((sector) => (
                    <BodyMedium key={sector}>
                      {t(`sectors.${sector}`)}
                    </BodyMedium>
                  ))}
                </Stack>
              );
            },
          },
          {
            id: "reduction-potential",
            header: t("ghg-reduction"),
            cell: ({ row }) => {
              const action = row.original.action || row.original;
              const totalReduction = Object.values(action.GHGReductionPotential)
                .filter((value) => value !== null)
                .map((value) => parseFloat(value))
                .reduce((sum, value) => sum + value, 0);
              const blueBars = Math.min(Math.ceil(totalReduction / 20), 5);
              return <BarVisualization value={blueBars} total={5} />;
            },
          },
        ]),
    {
      id: "explanation",
      header: t("explanation"),
      size: 60,
      cell: ({ row }) => {
        const original = row.original;
        const explanation =
          original?.explanation;
        const tooltipId = `explanation-tooltip-global`;
        return (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box
              className="flex items-center cursor-pointer"
              data-tooltip-id={tooltipId}
              data-tooltip-content={explanation || "N/A"}
            >
              <MdInfoOutline size={18} color="#4B4C63" />
            </Box>
          </Box>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 80,
      cell: ({ row }) => (
        <IconButton
          size="small"
          onClick={() => {
            setSelectedAction(row.original.action);
          }}
        >
          <BiExpandAlt />
        </IconButton>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <Box p={2} display="flex" alignItems="center" gap={2}>
        <CircularProgress size={24} />
        <span>{t("loading-actions")}</span>
      </Box>
    );
  }
  if (!actions || actions.length === 0) {
    return <Box p={2}>{t("no-actions-found")}</Box>;
  }

  const tableContent = (
    <Box
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #E8EAFB",
      }}
    >
      <Box
        component="table"
        sx={{
          width: "100%",
          tableLayout: "fixed",
        }}
      >
        <Box component="thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <Box
              component="tr"
              key={headerGroup.id}
              sx={{
                backgroundColor: "#E8EAFB",
              }}
            >
              {headerGroup.headers.map((header) => (
                <Box
                  component="th"
                  key={header.id}
                  sx={{
                    padding: "24px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
                    backgroundColor: "#E8EAFB",
                    width:
                      header.column.columnDef.size ||
                      header.column.columnDef.width ||
                      "auto",
                    minWidth:
                      header.column.columnDef.size ||
                      header.column.columnDef.width ||
                      "auto",
                    maxWidth:
                      header.column.columnDef.size ||
                      header.column.columnDef.width ||
                      "auto",
                    ...(header.column.id === "sector" && {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box component="tbody">
          {table.getRowModel().rows.map((row) => (
            <SortableRow
              key={row.original.actionId}
              row={row}
              enableRowOrdering={enableRowOrdering}
            >
              {row.getVisibleCells().map((cell) => (
                <Box
                  component="td"
                  key={cell.id}
                  sx={{
                    padding: "24px",
                    borderBottom: "1px solid #e2e8f0",
                    width:
                      cell.column.columnDef.size ||
                      cell.column.columnDef.width ||
                      "auto",
                    minWidth:
                      cell.column.columnDef.size ||
                      cell.column.columnDef.width ||
                      "auto",
                    maxWidth:
                      cell.column.columnDef.size ||
                      cell.column.columnDef.width ||
                      "auto",
                    ...(cell.column.id === "sector" && {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>
              ))}
            </SortableRow>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ overflowX: "auto" }}>
      {selectedAction && (
        <ActionDrawer
          action={selectedAction}
          isOpen={!!selectedAction}
          onClose={() => setSelectedAction(null)}
          t={t}
        />
      )}

      {/* Global tooltip for explanations to avoid stacking context issues */}
      <Tooltip
        id="explanation-tooltip-global"
        place="left"
        positionStrategy="fixed"
        style={{ maxWidth: '300px', wordBreak: 'break-word', zIndex: 999999 }}
      />

      {/* Sector Filter */}
      {showSectorFilter && availableFilters.length > 0 && items.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <SectorFilterButton
            availableFilters={availableFilters}
            selectedFilters={selectedFilters}
            onChange={setSelectedFilters}
            t={t}
            filterLabelKey={isAdaptation ? "by-hazard" : "by-sector"}
            filterField={filterField}
          />
        </Box>
      )}

      {enableRowOrdering ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredItems.map((item) => item.actionId)}
            strategy={verticalListSortingStrategy}
          >
            {tableContent}
          </SortableContext>
        </DndContext>
      ) : (
        tableContent
      )}
    </Box>
  );
}
