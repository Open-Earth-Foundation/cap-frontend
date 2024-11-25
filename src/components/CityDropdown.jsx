import React, {useState} from "react";
import Select from "react-select";
import {CITIES} from "./constants.js";

const CityDropdown = ({onCityChange, styles}) => {
    const [cities, setCities] = useState(CITIES);

    const [selectedCity, setSelectedCity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //   const fetchCities = async () => {
    //     //console.log(climateActions)
    //     try {
    //       const uniqueCities = new Set();
    //       const cityOptions = climateActions
    //         .filter((city) => {
    //           if (!uniqueCities.has(city.city_name)) {
    //             uniqueCities.add(city.city_name);
    //             return true;
    //           }
    //           return false;
    //         })
    //         .map((city) => ({
    //           value: city.city_name,
    //           label: `${city.city_name} - ${city.region}`,
    //         }));
    //
    //       setCities(cityOptions);
    //     } catch (error) {
    //       console.error("Error fetching cities:", error);
    //       setError(error.message);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    //
    //   fetchCities();
    // }, []);

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        if (selectedOption) {
            onCityChange(selectedOption.value);
        }
    };

    if (error)
        return (
            <div className="text-red-500 text-sm">Error loading cities: {error}</div>
        );

    return (
        <Select
            value={selectedCity}
            onChange={handleCityChange}
            options={cities}
            placeholder="Search for a city..."
            isClearable
            isLoading={isLoading}
            styles={styles}
            className="city-dropdown"
            classNamePrefix="city-select"
        />
    );
};

export default CityDropdown;
