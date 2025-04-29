import { HeadlineLarge } from "./Texts/Headline";
import { TitleMedium } from "./Texts/Title";
import { BodyMedium } from "./Texts/Body";
import { Card } from "@mui/material";
import MapView from "./MapView";
import { useTranslation } from 'react-i18next';

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
                <div className="space-y-4 px-4 py-4">
                    <div className="flex flex-col gap-4">
                        <div>
                            <HeadlineLarge>{formatNumber(cityData?.totalEmissions / 1000)} {t('tCO2e')}</HeadlineLarge>
                            <BodyMedium>{t('totalEmissions')}</BodyMedium>
                        </div>
                        <div>
                            <TitleMedium>{formatNumber(cityData?.populationSize)}</TitleMedium>
                            <BodyMedium>{t('population')}</BodyMedium>
                        </div>
                        <div>
                            <TitleMedium>{formatNumber(cityData?.area)} {t('km2')}</TitleMedium>
                            <BodyMedium>{t('area')}</BodyMedium>
                        </div>
                        <div>
                            <TitleMedium>{t('biomes.' + cityData?.biome)}</TitleMedium>
                            <BodyMedium>{t('biome')}</BodyMedium>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}