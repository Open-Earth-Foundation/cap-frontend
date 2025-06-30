import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Chip,
} from "@mui/material";
import { MdFilterList } from "react-icons/md";
import { ButtonMedium } from "./Texts/Button.jsx";

const SectorFilterButton = ({
  availableFilters,
  selectedFilters,
  onChange,
  t,
  filterLabelKey = "by-sector",
  filterField = "Sector",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterMenuToggle = (option) => {
    let newSelected;
    if (selectedFilters.includes(option)) {
      newSelected = selectedFilters.filter((s) => s !== option);
    } else {
      newSelected = [...selectedFilters, option];
    }
    onChange(newSelected);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <IconButton
        id="filter-button"
        aria-controls={open ? "filter-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleFilterButtonClick}
        sx={{
          border: "1px solid #E8EAFB",
          borderRadius: 2,
          px: 2,
          py: 1,
          background: "#fff",
          boxShadow: 1,
        }}
      >
        <MdFilterList size={24} color="#2351DC" style={{ marginRight: 8 }} />
        <ButtonMedium style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>
          {t("filter")}
        </ButtonMedium>
        <Chip
          label={selectedFilters.length}
          color="primary"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </IconButton>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterMenuClose}
        MenuListProps={{ "aria-labelledby": "filter-button" }}
        PaperProps={{ sx: { minWidth: 220, p: 1 } }}
      >
        <Box
          sx={{ px: 2, py: 1, fontWeight: 600, color: "#4B4C63", fontSize: 14 }}
        >
          {t(filterLabelKey)}
        </Box>
        {availableFilters.map((option) => {
          const checked = selectedFilters.includes(option);
          return (
            <MenuItem
              key={option}
              selected={checked}
              onClick={() => handleFilterMenuToggle(option)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": `sector-checkbox-${option}`,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={`sector-checkbox-${option}`}
                primary={
                  filterField === "Hazard" ? t(`${option}`) : t(`${option}`)
                }
              />
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default SectorFilterButton;
