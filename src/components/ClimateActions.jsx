import React from "react";
import "./ClimateActions.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { MdOutlineFlood } from "react-icons/md";
import { FiArrowDownRight } from "react-icons/fi";
import { ADAPTATION, MITIGATION } from "../utils/helpers.js";
import { useTranslation } from "react-i18next";
import CityData from "./CityData.jsx";
import ClimateActionsType from "./ClimateActionsType.jsx";
import { ButtonMedium } from "./Texts/Button.jsx";

const ClimateActions = ({ selectedCity, selectedLocode }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <CityData selectedLocode={selectedLocode} />
      <div className="max-w-screen-xl mx-auto">
        <div className="flex mb-8">
          <ButtonMedium color="#2351DC">{t("climateActions")}</ButtonMedium>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-[#232640] font-poppins">
          {t("topActionsTitle")}
        </h1>
        <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
          {t("topActionsDescription")}
        </p>

        <Tabs>
          <TabList className="flex justify-left mb-0 my-8 tab-actions">
            <Tab>
              <FiArrowDownRight />
              <span className="tab-text">{t("mitigation")}</span>
            </Tab>
            <Tab>
              <div>
                <MdOutlineFlood />
              </div>
              <span className="tab-text">{t("adaptation")}</span>
            </Tab>
          </TabList>

          <TabPanel>
            <ClimateActionsType type={MITIGATION} selectedCity={selectedCity} />
          </TabPanel>

          <TabPanel>
            <ClimateActionsType type={ADAPTATION} selectedCity={selectedCity} />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default ClimateActions;
