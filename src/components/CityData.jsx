import { useState, useEffect } from "react";
import { fetchCityContextData } from "../utils/readWrite";
import { useTranslation } from "react-i18next";
import { HeadlineSmall } from "./Texts/Headline";
import { LessView } from "./LessView";
import { MoreView } from "./MoreView";
import { ButtonMedium } from "./Texts/Button";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

const CityData = ({ selectedLocode }) => {
    const { t } = useTranslation();
    const [cityData, setCityData] = useState({});
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const fetchCityData = async () => {
            const allCitiesData = await fetchCityContextData(selectedLocode);
            const cityData = allCitiesData.find(city => city.locode === selectedLocode);
            setCityData(cityData);
        };
        fetchCityData();
    }, [selectedLocode]);

    const toggleView = () => {
        setShowMore(!showMore);
    };

    return (
        <>
            <HeadlineSmall>{cityData?.name}</HeadlineSmall>
            <LessView cityData={cityData} />
            {showMore ? <MoreView cityData={cityData} /> : null}
            <div className="mt-4">
                <div onClick={toggleView} className="flex justify-center items-center gap-2">
                    {showMore ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    <ButtonMedium>
                        {showMore ? t('viewLess') : t('viewMore')}
                    </ButtonMedium>
                </div>
            </div>
        </>
    );
};

export default CityData;