import React, {useState} from "react";
import i18n from "i18next";
import Hero from "./components/Hero";
import ClimateActions from "./components/ClimateActions.jsx";
import CityMap from "./components/CityMap.jsx";
import "./index.css";
import {readFile} from "./utils/readWrite.js";
import {ADAPTATION, MITIGATION} from "./utils/helpers.js";
import {useTranslation} from 'react-i18next';

const App = () => {
    const [selectedCity, setSelectedCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adaptationData, setAdaptationData] = useState([]);
    const [mitigationData, setMitigationData] = useState([]);
    const {t} = useTranslation();

    const fetchData = async (city, type) => {
        if (!city) return;
        setLoading(true);
        setError(null);
        try {
            const data = await readFile(city, type);
            if (type === ADAPTATION) {
                setAdaptationData(data);
            } else {
                setMitigationData(data);
            }
        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchTerm) => {
        setSelectedCity(searchTerm);
        if (searchTerm) {
            fetchData(searchTerm, ADAPTATION);
            fetchData(searchTerm, MITIGATION);
        }
    };

    const handleBack = () => {
        setSelectedCity("");
        setAdaptationData([]);
        setMitigationData([]);
        setError(null);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <header className="bg-primary text-white p-4">
                <div className="container mx-auto max-w-[1160px] flex justify-between items-center">
                    <h1 className="text-xl font-semibold">CityCatalyst CAP</h1>
                    <div>
                         <button onClick={() => changeLanguage('en')} className="mx-1">EN</button>
                        <span>|</span>
                        <button onClick={() => changeLanguage('es')} className="mx-1">ES</button>
                        <span>|</span>
                        <button onClick={() => changeLanguage('pt')} className="mx-1">PT</button>
                     </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {/* Always show Hero component with search */}
                <Hero onSearch={handleSearch} initialCity={selectedCity}/>
                {selectedCity && (
                    <div className="container mx-auto px-4 flex justify-center items-center gap-32 max-w-[1200px]">
                        <CityMap selectedCity={selectedCity}/>
                    </div>
                )}
                {/* Empty State */}
                {!selectedCity && (
                    <div className="container mx-auto px-4 py-10 mb-20">
                        <div className="max-w-md mx-auto text-center">
                            <img
                                src="/city-image.svg"
                                alt="Cityscape"
                                className="mx-auto mb-6 h-32 w-auto"
                            />
                            <h2 className="text-xl font-semibold mb-2">
                                {t("selectACityToExploreClimateActions")}
                            </h2>
                            <p className="text-gray-500">
                                {t("discoverTopActionsTailoredToTheCitysClimateNeeds")}
                            </p>
                        </div>
                    </div>
                )}

                {/* Show ClimateActions if city is selected */}
                {selectedCity && (
                    <div className="container mx-auto px-4 py-10 text-gray-500">
                        <ClimateActions
                            selectedCity={selectedCity}
                            mitigationData={mitigationData}
                            setMitigationData={setMitigationData}
                            adaptationData={adaptationData}
                            setAdaptationData={setAdaptationData}
                            loading={loading}
                            error={error}
                            onBack={handleBack}
                        />
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 py-4 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                    &copy; 2024 CityCatalyst CAP | All Rights Reserved
                </div>
            </footer>
        </div>
    );
};

export default App;