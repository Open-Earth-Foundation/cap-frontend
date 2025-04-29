import { useState, useEffect } from "react";
import { fetchCityContextData } from "../utils/readWrite";
import { useTranslation } from "react-i18next";
import { HeadlineSmall } from "./Texts/Headline";
import { LessView } from "./LessView";
import { MoreView } from "./MoreView";
import { TitleLarge } from "./Texts/Title";
const CityData = ({ selectedLocode }) => {
    const { t } = useTranslation();
    const [cityData, setCityData] = useState({});

    useEffect(() => {
        const fetchCityData = async () => {
            const allCitiesData = await fetchCityContextData(selectedLocode);
            const cityData = allCitiesData.find(city => city.locode === selectedLocode);
            setCityData(cityData);
        };
        fetchCityData();
    }, [selectedLocode]);
    return (
        <>
            <HeadlineSmall>{cityData?.name}</HeadlineSmall>
            <LessView cityData={cityData} />
            <MoreView cityData={cityData} />
        </>
    );
};

export default CityData;