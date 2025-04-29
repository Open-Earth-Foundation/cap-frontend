import { useTranslation } from 'react-i18next';
import EmissionsChart from './EmissionsChart';

export function MoreView({ cityData }) {
    const { t } = useTranslation();

    return <div className="pt-6">

        <div className="space-y-4 grid grid-cols-3 gap-4">
            <div className="col-span-2">
                <p className="text-sm font-medium mb-2 ">{t('emissionsBySector')}</p>
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
}