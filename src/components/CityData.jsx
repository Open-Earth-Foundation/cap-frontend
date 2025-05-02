import { useState, useEffect } from "react";
import { fetchCityContextData } from "../utils/readWrite";
import { useTranslation } from "react-i18next";
import { HeadlineSmall } from "./Texts/Headline";
import { LessView } from "./LessView";
import { MoreView } from "./MoreView";
import { ButtonMedium } from "./Texts/Button";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { MdOutlineLocationOn } from "react-icons/md";
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
            {cityData?.name && <div className="flex items-center gap-2 pb-4">
                <MdOutlineLocationOn size={24} color="#2351DC" />
                <HeadlineSmall>{cityData?.name}, {t('brazil')}</HeadlineSmall>
            </div>}
            {cityData?.name && <LessView cityData={cityData} />}
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