export const ADAPTATION = 'adaptation';
export const MITIGATION = 'mitigation';

export function getReductionPotential(action) {
    // if (!action.Sector) return ''
    // let field;
    // switch (action.Sector) {
    //     case 'Stationary Energy':
    //         field = 'energy';
    //         break;
    //
    //     case "Transport":
    //         field = 'transportation';
    //         break;
    //
    //     case "Waste":
    //         field = 'waste'
    //         break;
    // }
    // const fullField = `GHGReductionPotential.${field}`
    //console.log("action", JSON.stringify(action, null, 2)) // TODO NINA
    return Object.values(action.GHGReductionPotential).find((value) => {
        return value !== 'none'
    })
}

export const toTitleCase = str => str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
);
export const isAdaptation = type => type.toLowerCase() === ADAPTATION.toLowerCase();

// Function to get nested property value
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Prepare CSV data for export
export const prepareCsvData = (tableData, columns) => {
    return tableData.map(row =>
        columns.reduce((acc, column) => {
            const key = column.accessorKey;
            acc[column.header] = getNestedValue(row, key);
            return acc;
        }, {})
    );
};