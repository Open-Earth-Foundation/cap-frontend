import React, {useState} from "react";
import Select from "react-select";
import {CITIES} from "./constants.js";
import {useTranslation} from "react-i18next";

const CityDropdown = ({onCityChange, styles}) => {
    const [cities, setCities] = useState(CITIES);

    const [selectedCity, setSelectedCity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {t} = useTranslation();

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        if (selectedOption) {
            onCityChange(selectedOption.value);
        }
    };

    if (error)
        return (
            <div className="text-red-500 text-sm">{t("errorLoadingCities")}: {error}</div>
        );

    return (
        <Select
            value={selectedCity}
            onChange={handleCityChange}
            options={cities}
            placeholder={t("searchForACity")}
            isClearable
            isLoading={isLoading}
            styles={styles}
            className="city-dropdown"
            classNamePrefix="city-select"
        />
    );
};

export default CityDropdown;
