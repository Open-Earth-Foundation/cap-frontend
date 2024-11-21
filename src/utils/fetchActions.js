/* Function to convert city name to snake_case and replace non-English characters */
export const toSnakeCase = (str) => {
    return str
        .normalize('NFD') // Normalize the string
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .toLowerCase()
        .replace(/[^a-z\s]/g, '') // Remove non-English characters
        .replace(/\s+/g, '_'); // Replace spaces with underscores
};

export const fetchActions = async (city) => {
    const baseUrl = import.meta.env.VITE_CSV_URL;
    const finalUrl = `${baseUrl + toSnakeCase(city)}.json`;
    try {
        const response = await fetch(finalUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch actions:", error);
        throw error;
    }
};