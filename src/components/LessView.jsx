import { HeadlineLarge } from "./Texts/Headline";
import { TitleMedium } from "./Texts/Title";
import { BodyMedium } from "./Texts/Body";
import { Card } from "@mui/material";
import MapView from "./MapView";
import { useTranslation } from 'react-i18next';
import { MdArrowOutward, MdOutlinePeople, MdOutlineAspectRatio } from "react-icons/md";
import { PiTreeBold } from "react-icons/pi";

export function LessView({ cityData }) {
    const { t } = useTranslation();

    const formatNumber = (num) => new Intl.NumberFormat().format(Math.round(num));
    const formatBiome = (biome) => {
        return (biome || "").split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
                <MapView city={cityData} />
            </div>
            <Card>
                <div className="space-y-4 p-6 ">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <MdArrowOutward color="#7A7B9A" size={24} />
                            <div>
                                <HeadlineLarge >{formatNumber(cityData?.totalEmissions / 1000)} {t('tCO2e')}</HeadlineLarge>
                                <BodyMedium>{t('totalEmissions')}</BodyMedium>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdOutlinePeople color="#7A7B9A" size={24} />
                            <div >
                                <TitleMedium >{formatNumber(cityData?.populationSize)}</TitleMedium>
                                <BodyMedium>{t('population')}</BodyMedium>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdOutlineAspectRatio color="#7A7B9A" size={24} />
                            <div >
                                <TitleMedium >{formatNumber(cityData?.area)} {t('km2')}</TitleMedium>
                                <BodyMedium>{t('area')}</BodyMedium>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <PiTreeBold color="#7A7B9A" size={24} />
                            <div >
                                <TitleMedium >{t('biomes.' + cityData?.biome)}</TitleMedium>
                                <BodyMedium>{t('biome')}</BodyMedium>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}