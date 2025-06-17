import { isAdaptation } from "../utils/helpers";
import { adaptationColumns, mitigationColumns } from "./columns";
import { prepareCsvData } from "../utils/exportUtils";
import { FiDownload } from "react-icons/fi";
import { CSVLink } from "react-csv";
import { ButtonMedium } from "./Texts/Button";
export function CsvLink({ type, selectedCity, t, adaptationData, mitigationData }) {


    const getCsvColumns = (type) => {
        const columns = isAdaptation(type) ? adaptationColumns(t) : mitigationColumns(t);

        // Create a copy of columns and remove unnecessary ones
        const filteredColumns = [...columns];
        filteredColumns.splice(2, 1); // Remove the third item
        filteredColumns.pop(); // Remove the last item

        return filteredColumns;
    };

    const getCsvData = (type) => {
        const columns = getCsvColumns(type);
        const data = isAdaptation(type) ? adaptationData : mitigationData;

        const { headers, data: csvData } = prepareCsvData(data, columns, t);
        return { headers, data: csvData };
    };

    const { headers, data } = getCsvData(type);
    const filename = `${selectedCity}_${t(type)}_${t('actions')}.csv`;
    return (
        <CSVLink
            headers={headers}
            data={data}
            filename={filename}
            className="flex justify-center gap-4 px-4 py-2"
        >
            <FiDownload className="mr-2" />
            <ButtonMedium>{t('downloadCsv')}</ButtonMedium>
        </CSVLink>
    );
}