import { useTranslation } from 'react-i18next';
import EmissionsCharts from './EmissionsChart';
import { TitleLarge } from './Texts/Title';
import { Card } from '@mui/material';
import { toCamelCase } from '../utils/stringUtils';

export function MoreView({ cityData }) {
    const { t } = useTranslation();

    return <div className="pt-6">

        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
                <TitleLarge>{t('emissionsBreakdown')}</TitleLarge>
                <Card>
                    <EmissionsCharts city={cityData} />
                </Card>
            </div>

            <div className="pb-6">
                <TitleLarge>{t('climateRisks')}</TitleLarge>
                <Card>
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
                            console.log('risk?.keyimpact', JSON.stringify(risk?.keyimpact));// TODO NINA
                            return (
                                <div key={i} className="mt-3">
                                    <p className="text-sm mb-1">
                                        <span >{t(toCamelCase(risk?.hazard))}</span> - {' '}
                                        <span >{t('keyImpacts.' + toCamelCase(risk?.keyimpact))}</span> - {' '}
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
                </Card>
            </div>
        </div>
    </div>
}