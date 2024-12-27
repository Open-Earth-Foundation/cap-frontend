
import React, {useState} from "react";
import Select from "react-select";
import {CITIES} from "./constants.js";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const CityDropdown = ({onCityChange, styles}) => {
    const [cities] = useState(CITIES);
    const [selectedCity, setSelectedCity] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        if (selectedOption) {
            navigate(`/city/${selectedOption.value}`);
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
