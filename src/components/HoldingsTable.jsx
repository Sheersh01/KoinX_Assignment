import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";

const fmtNum = (n, decimals = 2) => {
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(2);
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const GainCell = ({ gain, balance, coin }) => {
  const isPos = gain >= 0;
  return (
    <div className="gain-cell">
      <span className={`gain-amount ${isPos ? "positive" : "negative"}`}>
        {isPos ? "+" : "-"}$
        {Math.abs(gain).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span className="gain-balance">
        {fmtNum(balance, 4)} {coin}
      </span>
    </div>
  );
};

const DefaultLogo = ({ coin }) => (
  <div className="default-logo">{coin?.charAt(0) || "?"}</div>
);

const SORT_KEYS = {
  asset: "asset",
  holdings: "holdings",
  currentValue: "currentValue",
  stcg: "stcg",
  ltcg: "ltcg",
  amountToSell: "amountToSell",
};

const getSortValue = (entry, sortKey) => {
  const { holding } = entry;

  switch (sortKey) {
    case SORT_KEYS.asset:
      return `${holding.coinName} ${holding.coin}`.toLowerCase();
    case SORT_KEYS.holdings:
      return holding.totalHolding;
    case SORT_KEYS.currentValue:
      return holding.currentPrice * holding.totalHolding;
    case SORT_KEYS.stcg:
      return holding.stcg.gain;
    case SORT_KEYS.ltcg:
      return holding.ltcg.gain;
    case SORT_KEYS.amountToSell:
      return holding.totalHolding;
    default:
      return 0;
  }
};

export default function HoldingsTable() {
  const {
    holdings,
    selectedIds,
    toggleSelection,
    toggleAll,
    showAll,
    setShowAll,
  } = useApp();
  const [sortConfig, setSortConfig] = useState({
    key: SORT_KEYS.asset,
    direction: "asc",
  });

  const allSelected =
    selectedIds.size === holdings.length && holdings.length > 0;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const displayed = useMemo(() => {
    const mapped = holdings.map((holding, originalIndex) => ({
      holding,
      originalIndex,
    }));

    const directionMultiplier = sortConfig.direction === "asc" ? 1 : -1;

    const sorted = mapped.sort((left, right) => {
      const leftValue = getSortValue(left, sortConfig.key);
      const rightValue = getSortValue(right, sortConfig.key);

      if (leftValue < rightValue) return -1 * directionMultiplier;
      if (leftValue > rightValue) return 1 * directionMultiplier;
      return left.originalIndex - right.originalIndex;
    });

    return showAll ? sorted : sorted.slice(0, 5);
  }, [holdings, showAll, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortDirection = (key) =>
    sortConfig.key === key ? sortConfig.direction : null;

  const sortLabel = (label, key) => {
    const direction = getSortDirection(key);
    return (
      <button
        type="button"
        className={`sortable-header ${direction ? "active" : ""}`}
        onClick={() => handleSort(key)}
        aria-label={`Sort by ${label}`}
        aria-sort={
          direction === "asc"
            ? "ascending"
            : direction === "desc"
              ? "descending"
              : "none"
        }
      >
        <span>{label}</span>
        <span className="sort-indicator" aria-hidden="true">
          {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
        </span>
      </button>
    );
  };

  return (
    <div className="holdings-section">
      <h2 className="holdings-title">Holdings</h2>
      <div className="table-wrapper">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                />
              </th>
              <th className="th-asset">
                {sortLabel("Asset", SORT_KEYS.asset)}
              </th>
              <th className="th-holdings">
                {sortLabel("Holdings", SORT_KEYS.holdings)}
                <span className="th-sub">Current Market Rate</span>
              </th>
              <th>
                {sortLabel("Total Current Value", SORT_KEYS.currentValue)}
              </th>
              <th>{sortLabel("Short-term", SORT_KEYS.stcg)}</th>
              <th>{sortLabel("Long-Term", SORT_KEYS.ltcg)}</th>
              <th>{sortLabel("Amount to Sell", SORT_KEYS.amountToSell)}</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(({ holding: h, originalIndex }) => {
              const isSelected = selectedIds.has(originalIndex);
              const totalValue = h.currentPrice * h.totalHolding;
              return (
                <tr
                  key={`${h.coin}-${originalIndex}`}
                  className={`holdings-row ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSelection(originalIndex)}
                >
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(originalIndex)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="td-asset">
                    <div className="asset-info">
                      <div className="asset-logo-wrap">
                        <img
                          src={h.logo}
                          alt={h.coin}
                          className="asset-logo"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <DefaultLogo coin={h.coin} />
                      </div>
                      <div>
                        <div className="asset-name">{h.coinName}</div>
                        <div className="asset-coin">{h.coin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="td-holdings">
                    <div className="holding-amount">
                      {fmtNum(h.totalHolding, 4)} {h.coin}
                    </div>
                    <div className="holding-price">
                      ${fmtNum(h.averageBuyPrice)} / {h.coin}
                    </div>
                  </td>
                  <td className="td-value">${fmtNum(totalValue)}</td>
                  <td>
                    <GainCell
                      gain={h.stcg.gain}
                      balance={h.stcg.balance}
                      coin={h.coin}
                    />
                  </td>
                  <td>
                    <GainCell
                      gain={h.ltcg.gain}
                      balance={h.ltcg.balance}
                      coin={h.coin}
                    />
                  </td>
                  <td className="td-sell">
                    {isSelected ? (
                      <span className="sell-amount">
                        {fmtNum(h.totalHolding, 4)} {h.coin}
                      </span>
                    ) : (
                      <span className="sell-dash">–</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {holdings.length > 5 && (
        <button className="view-all-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "View less" : "View all"}
        </button>
      )}
    </div>
  );
}
