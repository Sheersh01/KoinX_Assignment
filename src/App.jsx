import React, { useEffect, useRef, useState } from "react";
import { AppProvider } from "./context/AppContext";
import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Disclaimer from "./components/Disclaimer";
import CapitalGainsCards from "./components/CapitalGainsCards";
import HoldingsTable from "./components/HoldingsTable";
import "./App.css";

const AppInner = () => {
  const { darkMode, loading, error } = useApp();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const howItWorksRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        howItWorksRef.current &&
        !howItWorksRef.current.contains(event.target)
      ) {
        setShowHowItWorks(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowHowItWorks(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Tax Harvesting</h1>
          <div className="how-it-works-wrap" ref={howItWorksRef}>
            <button
              type="button"
              className="how-it-works"
              onClick={() => setShowHowItWorks((prev) => !prev)}
              aria-expanded={showHowItWorks}
              aria-controls="how-it-works-popover"
            >
              How it works?
            </button>
            {showHowItWorks && (
              <div
                className="how-it-works-popover"
                id="how-it-works-popover"
                role="dialog"
              >
                <p>
                  Select the assets you want to harvest. The app offsets gains
                  and losses to show your effective capital gains after
                  harvesting.
                </p>
              </div>
            )}
          </div>
        </div>
        <Disclaimer />
        {loading ? (
          <div className="loader-wrap">
            <div className="spinner" />
            <p>Loading your portfolio...</p>
          </div>
        ) : error ? (
          <div className="error-wrap">{error}</div>
        ) : (
          <>
            <CapitalGainsCards />
            <HoldingsTable />
          </>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
