import React from "react";
import {useTranslation} from "react-i18next";

const Layout = ({ children }) => {
   const {t} = useTranslation();

    return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="text-xl">{t("cityClimateActionPrioritization")}</h1>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
