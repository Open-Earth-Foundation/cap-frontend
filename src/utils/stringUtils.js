/**
 * Converts a string to camelCase format
 * @param {string} str - The string to convert
 * @returns {string} The camelCase version of the input string
 */
export const toCamelCase = (str) => {
    if (!str) return '';
    // First, convert the entire string to lowercase
    const lowerStr = str.toLowerCase();

    const output = lowerStr
        // Replace any non-alphanumeric characters with spaces
        .replace(/[^a-z0-9]/g, ' ')
        // Split into words
        .split(' ')
        // Filter out empty strings
        .filter(word => word.length > 0)
        // Convert first word to lowercase, others to capitalized
        .map((word, index) => {
            if (index === 0) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        // Join words together
        .join('');
    return output;
};
