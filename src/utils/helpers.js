export    const ADAPTATION = 'adaptation';
export    const MITIGATION = 'mitigation';

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

    return Object.values(action.GHGReductionPotential).find((value) => {
        return value !== 'none'
    })
}

export const toTitleCase = str => str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
);
export const isAdaptation = type => type.toLowerCase() === ADAPTATION.toLowerCase();
//Prepare CSV data for export
export const prepareCsvData = (tableData, columns) => {
    return tableData.map(row =>
        columns.reduce((acc, column) => {
            const key = column.accessorKey;
            acc[column.header] = row[key];
            return acc;
        }, {})
    );
};