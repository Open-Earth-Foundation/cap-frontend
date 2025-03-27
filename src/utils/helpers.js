
export const ADAPTATION = 'adaptation';
export const MITIGATION = 'mitigation';

export function getReductionPotential(action) {
    if (!action?.GHGReductionPotential) return ''
    return Object.values(action.GHGReductionPotential).find((value) => {
        return !!value
    })
}
export const toTitleCase = str => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/_/g, ' ') // Remove underscores
        .replace(/-/g, ' ') // Remove underscores
        .replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
};

export const joinToTitleCase = (array) => {
    if (!array) return null
    return array.map(toTitleCase)?.join(', ');
}

export const toSentenceCase = (text) => {
    if (!text) return '';
    // Replace underscores with spaces first
    const withSpaces = text.replace(/_/g, ' ');
    // Convert to sentence case (first letter uppercase, rest lowercase)
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
  };

export const isAdaptation = type => type?.toLowerCase && type.toLowerCase() === ADAPTATION.toLowerCase();

const getNestedValue = (obj, path) => {
    if (!path) return null
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const prepareCsvData = (tableData, columns) => {
    return tableData.map(row =>
        columns.reduce((acc, column) => {
            const key = column.accessorKey;
            acc[column.header] = getNestedValue(row, key);
            return acc;
        }, {})
    );
};
