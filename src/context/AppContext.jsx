import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCapitalGains, fetchHoldings } from "../data/mockApi";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [capitalGains, setCapitalGains] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    Promise.all([fetchCapitalGains(), fetchHoldings()])
      .then(([cgData, hData]) => {
        setCapitalGains(cgData.capitalGains);
        setHoldings(hData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data. Please try again.");
        setLoading(false);
      });
  }, []);

  const toggleSelection = (idx) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === holdings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(holdings.map((_, i) => i)));
    }
  };

  const afterHarvestingGains = () => {
    if (!capitalGains) return null;
    let stcgProfits = capitalGains.stcg.profits;
    let stcgLosses = capitalGains.stcg.losses;
    let ltcgProfits = capitalGains.ltcg.profits;
    let ltcgLosses = capitalGains.ltcg.losses;

    selectedIds.forEach((idx) => {
      const h = holdings[idx];
      if (!h) return;
      const stcgGain = h.stcg.gain || 0;
      const ltcgGain = h.ltcg.gain || 0;
      if (stcgGain > 0) stcgProfits += stcgGain;
      else stcgLosses += Math.abs(stcgGain);
      if (ltcgGain > 0) ltcgProfits += ltcgGain;
      else ltcgLosses += Math.abs(ltcgGain);
    });

    return {
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses },
    };
  };

  return (
    <AppContext.Provider
      value={{
        capitalGains,
        holdings,
        selectedIds,
        toggleSelection,
        toggleAll,
        loading,
        error,
        darkMode,
        setDarkMode,
        showAll,
        setShowAll,
        afterHarvestingGains,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
