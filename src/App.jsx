import React, {useState, useEffect} from "react";
import Hero from "./components/Hero";
import ClimateActions from "./components/ClimateActions.jsx";
import CityMap from "./components/CityMap.jsx";
import "./index.css";
import climateActions from "./data/climateActions.js";

const App = () => {
    const [selectedCity, setSelectedCity] = useState("");
    const [ccraData, setCcraData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCcraData = async (city) => {
        if (!city) return;
        setLoading(true);
        setError(null);
        try {
            const filteredData = climateActions.filter(
                (action) => action.city_name === city,
            );
            setCcraData(filteredData);
        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchTerm) => {
        setSelectedCity(searchTerm);
        if (searchTerm) {
            fetchCcraData(searchTerm);
        }
    };

    const handleBack = () => {
        setSelectedCity("");
        setCcraData([]);
        setError(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <header className="bg-primary text-white p-4 ">
                <div className="container mx-auto max-w-[1160px] align-center">
                    <h1 className="text-xl font-semibold">CityCatalyst CAP</h1>
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
                                Select a city to explore climate actions
                            </h2>
                            <p className="text-gray-500">
                                Discover top actions tailored to the city's climate needs.
                            </p>
                        </div>
                    </div>
                )}

                {/* Show ClimateActions if city is selected */}
                {selectedCity && (
                    <div className="container mx-auto px-4 py-10 text-gray-500">
                        <ClimateActions
                            selectedCity={selectedCity}
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
