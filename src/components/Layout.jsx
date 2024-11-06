import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="text-xl">City Climate Action Priorization</h1>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
