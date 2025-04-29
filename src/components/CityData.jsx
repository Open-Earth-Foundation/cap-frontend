import MapView from "./MapView.jsx";
import EmissionsChart from "./EmissionsChart.jsx";
import { useState, useEffect } from "react";
import { fetchCityContextData } from "../utils/readWrite";
import { useTranslation } from "react-i18next";

const CityData = ({ selectedLocode }) => {
    const { t } = useTranslation();
    const [cityData, setCityData] = useState({});

    const formatNumber = (num) => new Intl.NumberFormat().format(Math.round(num));
    const formatBiome = (biome) => {
        return (biome || "").split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    useEffect(() => {
        const fetchCityData = async () => {
            const allCitiesData = await fetchCityContextData(selectedLocode);
            const cityData = allCitiesData.find(city => city.locode === selectedLocode);
            console.log('cityData', JSON.stringify(cityData, null, 2));// TODO NINA
            setCityData(cityData);
        };
        fetchCityData();
    }, [selectedLocode]);
    return (
        <div className="space-y-4">
            {/* <div className="mt-4 h-[150px] border border-border rounded-lg overflow-hidden">
                <MapView city={cityData} />
            </div> */}

            <div className="pt-6">
                <h3 className="text-xl font-semibold mb-4">{cityData?.name}</h3>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">{t('demographics')}</p>
                        <p>{t('population')}: {formatNumber(cityData?.populationSize)}</p>
                        <p>{t('density')}: {formatNumber(cityData?.populationDensity)} {t('peoplePerKm2')}</p>
                        <p>{t('area')}: {formatNumber(cityData?.area)} {t('km2')}</p>
                        <p>{t('biome')}: {formatBiome(cityData?.biome)}</p>
                        <p>{t('lowIncomePopulation')}: {cityData?.socioEconomicFactors?.lowIncome?.replace('_', ' ')}</p>
                        <p>{t('inadequateWaterAccess')}: {cityData?.accessToPublicServices?.inadequateWaterAccess?.replace('_', ' ')}</p>
                        <p>{t('inadequateSanitation')}: {cityData?.accessToPublicServices?.inadequateSanitation?.replace('_', ' ')}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">{t('totalEmissions')}</p>
                        <p className="text-lg font-semibold mb-4">{formatNumber(cityData?.totalEmissions / 1000)} {t('tCO2e')}</p>
                        <EmissionsChart city={cityData} />
                    </div>

                    <div className="pb-6">
                        <p className="text-sm text-muted-foreground">{t('climateRisks')}</p>
                        {Array.isArray(cityData?.ccra) && cityData.ccra
                            .filter(risk => risk?.normalised_risk_score !== null)
                            .sort((a, b) => (b?.normalised_risk_score || 0) - (a?.normalised_risk_score || 0))
                            .map((risk, i) => {
                                const riskScore = risk?.normalised_risk_score || 0;
                                const riskColor = riskScore >= 0.67
                                    ? 'bg-red-500'
                                    : riskScore >= 0.34
                                        ? 'bg-yellow-500'
                                        : 'bg-blue-500';

                                return (
                                    <div key={i} className="mt-3">
                                        <p className="text-sm mb-1">
                                            <span className="capitalize">{t(risk?.hazard)}</span> - {' '}
                                            <span className="capitalize">{t(risk?.keyimpact)}</span> - {' '}
                                            <span className="font-medium">{riskScore.toFixed(2)}</span>
                                        </p>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div
                                                className={`${riskColor} rounded-full h-2 transition-all`}
                                                style={{ width: `${riskScore * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CityData;