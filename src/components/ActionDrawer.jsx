import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Stack,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { FiX } from 'react-icons/fi';
import { getReductionPotential, getTimelineTranslationKey, isAdaptation, joinToTitleCase, toTitleCase } from '../utils/helpers.js';
import MarkdownRenderer from './MarkdownRenderer';

export const ActionDrawer = ({ action, isOpen, onClose, t }) => {
    if (!action) return null;

    const renderReductionBars = () => {
        if (isAdaptation(action.ActionType)) {
            const level = action.AdaptationEffectiveness;
            const filledBars = level === "high" ? 3 : level === "medium" ? 2 : 1;
            const color = level === "high" ? "primary.main" : level === "medium" ? "primary.light" : "primary.lighter";

            return (
                <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                    {Array(3).fill().map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: '184px',
                                height: '5px',
                                borderRadius: '16px',
                                bgcolor: i < filledBars ? color : 'grey.200'
                            }}
                        />
                    ))}
                </Stack>
            );
        } else {
            const potential = getReductionPotential(action);
            const potentialValue = parseInt(potential.split("-")[0]);

            const getBarColor = (value) => {
                if (value >= 80) return "primary.main";
                if (value >= 60) return "primary.light";
                if (value >= 40) return "primary.lighter";
                if (value >= 20) return "primary.lightest";
                return "grey.200";
            };

            return (
                <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                    {Array(5).fill().map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: '184px',
                                height: '5px',
                                borderRadius: '16px',
                                bgcolor: getBarColor(potentialValue)
                            }}
                        />
                    ))}
                </Stack>
            );
        }
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '600px',
                    p: 3
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00001F' }}>
                    {t("climateActionDetails")}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <FiX />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {action.Explanation && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: '#00001F' }}>
                        {t("explanation")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {action.Explanation}
                    </Typography>
                </Box>
            )}

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#232640' }}>
                    {action.ActionName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {action.Description}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {renderReductionBars()}

                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography color="text.secondary">
                            {isAdaptation(action.ActionType) ? t("adaptationPotential") : t("reductionPotential")}
                        </Typography>
                        <Typography fontWeight="medium" color="text.secondary">
                            {isAdaptation(action.ActionType)
                                ? toTitleCase(action.AdaptationEffectiveness)
                                : `${getReductionPotential(action)}%`}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Typography color="text.secondary" >
                            {isAdaptation(action.ActionType) ? t("hazard") : t("sector")}
                        </Typography>
                        <Typography fontWeight="medium" color="text.secondary" textAlign="right">
                            {joinToTitleCase(action?.Sector, t) || joinToTitleCase(action.Hazard, t)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Typography color="text.secondary">
                            {t("estimatedCost")}
                        </Typography>
                        <Typography fontWeight="medium" color="text.secondary">
                            {toTitleCase(t(action.CostInvestmentNeeded))}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Typography color="text.secondary">
                            {t("implementationTime")}
                        </Typography>
                        <Typography fontWeight="medium" color="text.secondary">
                            {t(getTimelineTranslationKey(action.TimelineForImplementation))}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {action.Impacts && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#232640' }}>
                            {t("impacts")}
                        </Typography>
                        <List>
                            {action.Impacts.map((impact, index) => (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                    <ListItemText primary={impact} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {action.CoBenefits?.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#232640' }}>
                            {t("coBenefits")}
                        </Typography>
                        <List>
                            {action.CoBenefits.map((coBenefit, index) => (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                    <ListItemText primary={coBenefit} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {action.EquityAndInclusionConsiderations && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, color: '#232640' }}>
                            {t("equityAndInclusionConsiderations")}
                        </Typography>
                        <MarkdownRenderer markdownContent={action.EquityAndInclusionConsiderations} />
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};