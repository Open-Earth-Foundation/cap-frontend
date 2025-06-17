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

export const joinToTitleCase = (array, t) => {
    if (!array) return "";
    if (!Array.isArray(array)) return array;
    return array.map(item => {
        // Replace hyphens with underscores for translation
        const translationKey = item.replace(/-/g, '_');
        return t(translationKey);
    }).join(", ");
};

export const toSentenceCase = (text) => {
    if (!text) return '';
    // Replace underscores with spaces first
    const withSpaces = text.replace(/_/g, ' ');
    // Convert to sentence case (first letter uppercase, rest lowercase)
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
};

export const isAdaptation = type => {
    return type?.toLowerCase && type.toLowerCase() === ADAPTATION.toLowerCase() || type.includes(ADAPTATION)
};

export const getNestedValue = (obj, path) => {
    if (!path) return null;
    const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
        return Object.entries(value)
            .filter(([key, val]) => val !== null)
            .map(([key, val]) => `${key}: ${val}`)
            .join('; ');
    }
    return value;
};

export const getTimelineTranslationKey = (value) => {
    const mapping = {
        "<5 years": "timeline_less_than_5_years",
        "5-10 years": "timeline_5_10_years",
        ">10 years": "timeline_more_than_10_years",
    };
    return mapping[value] || value;
};
