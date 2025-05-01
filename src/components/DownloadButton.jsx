import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import { FiFileText, FiDownload } from "react-icons/fi";
import { CsvLink } from "./csvLink.jsx";
import { exportToPDF } from "../utils/exportUtils.js";
import { useState } from "react";
import { ButtonMedium } from "./Texts/Button.jsx";

export function DownloadButton({ type, selectedCity, t, adaptationData, mitigationData, generatedPlans }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    color: '#4B4C63',
                    border: '1px solid #E8EAFB',
                    borderRadius: '4px',
                    padding: '8px'
                }}
            >
                <div className="flex items-center gap-2">
                    <FiDownload />
                    <ButtonMedium>{t("download")}</ButtonMedium>
                </div>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <CsvLink
                        style={{
                            fontSize: '140px',
                        }}
                        type={type}
                        selectedCity={selectedCity}
                        t={t}
                        adaptationData={adaptationData}
                        mitigationData={mitigationData}
                    />
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        exportToPDF(
                            selectedCity,
                            mitigationData,
                            adaptationData,
                            generatedPlans,
                            t
                        );
                        handleClose();
                    }}
                >
                    <a className="flex justify-center gap-4 px-4 py-2">
                        <FiFileText className="mr-2" />
                        <ButtonMedium>{t("exportPdf")}</ButtonMedium>
                    </a>
                </MenuItem>
            </Menu>
        </>
    );
}