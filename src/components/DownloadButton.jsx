import { Button } from "@mui/material";
import { FiFileText } from "react-icons/fi";
import { CsvLink } from "./csvLink.jsx";
import { exportToPDF } from "../utils/exportUtils.js";
import { isAdaptation } from "../utils/helpers";
import { adaptationColumns, mitigationColumns } from "./columns.jsx";

export function DownloadButton({ type, selectedCity, t, adaptationData, mitigationData, generatedPlans }) {
    return <>
        <CsvLink type={type} selectedCity={selectedCity} t={t} adaptationData={adaptationData} mitigationData={mitigationData} />
        <Button
            onClick={() => exportToPDF(
                selectedCity,
                mitigationData,
                adaptationData,
                generatedPlans,
                t
            )}
            className="flex justify-center gap-4 px-4 py-2 text-[#4B4C63] rounded border border-solid border-[#E8EAFB] button font-semibold download-csv download-table"
        >
            <FiFileText />
            {t("exportPdf")}
        </Button>
    </>;
}