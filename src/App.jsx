import React, { useState } from "react";
import i18n from "i18next";
import { HashRouter, Navigate, Route, Routes, useParams, } from "react-router-dom";
import Hero from "./components/Hero";
import ClimateActions from "./components/ClimateActions.jsx";
import "./index.css";
import { useTranslation } from "react-i18next";
import { CITIES } from "./components/constants.js";
import { ButtonMedium } from "./components/Texts/Button.jsx";

const CityView = () => {
  const { cityName } = useParams();

  const validCity = CITIES.find(
    (city) => city.value.toLowerCase() === cityName?.toLowerCase()
  );

  if (!validCity) {
    return <Navigate to="/" />;
  }

  return (
    <div className={"py-4"}>
      <Hero initialCity={validCity.value} />
      <div
        style={{ backgroundColor: "#fafafa" }}
        className="max-w-screen-xl mx-auto p-12"
      >
        <ClimateActions
          selectedLocode={validCity.locode}
          selectedCity={validCity.value}
        />
      </div>
    </div>
  );
};

const App = () => {
    const { t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen bg-white">
                <header className="bg-primary text-white p-4">
                    <div className="container mx-auto max-w-[1160px] flex justify-between items-center">
                        <h1 className="text-xl font-semibold">CityCatalyst HIAP</h1>
                        <div>
                            <button onClick={() => changeLanguage("en")} className="mx-1">
                                EN
                            </button>
                            <span>|</span>
                            <button onClick={() => changeLanguage("es")} className="mx-1">
                                ES
                            </button>
                            <span>|</span>
                            <button onClick={() => changeLanguage("pt")} className="mx-1">
                                PT
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-grow">
                    <Routes>
                        <Route path="/city/:cityName" element={<CityView />} />
                        <Route
                            path="/"
                            element={
                                <>
                                    <Hero />
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
                                </>
                            }
                        />
                    </Routes>
                </main>

                <footer className="bg-gray-100 py-4 mt-auto">
                    <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                        &copy; 2024 CityCatalyst HIAP | All Rights Reserved
                    </div>
                </footer>
            </div>
        </HashRouter>
    );
};

export default App;
