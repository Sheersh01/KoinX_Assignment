import React from "react";
import { useApp } from "../context/AppContext";

const fmt = (val) => {
  const abs = Math.abs(val);
  const str = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return val < 0 ? `-$${str}` : `$${str}`;
};

function GainsTable({ stcg, ltcg, isAfter }) {
  const stcgNet = stcg.profits - stcg.losses;
  const ltcgNet = ltcg.profits - ltcg.losses;
  const realised = stcgNet + ltcgNet;

  return (
    <div className="gains-table">
      <div className="gains-row gains-header">
        <span></span>
        <span>Short-term</span>
        <span>Long-term</span>
      </div>
      <div className="gains-row">
        <span>Profits</span>
        <span className="gains-val">{fmt(stcg.profits)}</span>
        <span className="gains-val">{fmt(ltcg.profits)}</span>
      </div>
      <div className="gains-row">
        <span>Losses</span>
        <span className={`gains-val ${stcg.losses > 0 ? "negative" : ""}`}>
          {stcg.losses > 0 ? fmt(-stcg.losses) : fmt(stcg.losses)}
        </span>
        <span className={`gains-val ${ltcg.losses > 0 ? "negative" : ""}`}>
          {ltcg.losses > 0 ? fmt(-ltcg.losses) : fmt(ltcg.losses)}
        </span>
      </div>
      <div className="gains-row gains-net">
        <span>Net Capital Gains</span>
        <span className={`gains-val ${stcgNet < 0 ? "negative" : ""}`}>
          {fmt(stcgNet)}
        </span>
        <span className={`gains-val ${ltcgNet < 0 ? "negative" : ""}`}>
          {fmt(ltcgNet)}
        </span>
      </div>
      <div className="gains-realised">
        <span>
          {isAfter ? "Effective Capital Gains:" : "Realised Capital Gains:"}
        </span>
        <span
          className={`realised-amount ${realised < 0 ? "negative-large" : "positive-large"}`}
        >
          {fmt(realised)}
        </span>
      </div>
    </div>
  );
}

export default function CapitalGainsCards() {
  const { capitalGains, afterHarvestingGains } = useApp();
  if (!capitalGains) return null;

  const after = afterHarvestingGains();
  const preRealised =
    capitalGains.stcg.profits -
    capitalGains.stcg.losses +
    capitalGains.ltcg.profits -
    capitalGains.ltcg.losses;
  const afterRealised = after
    ? after.stcg.profits -
      after.stcg.losses +
      after.ltcg.profits -
      after.ltcg.losses
    : preRealised;

  const computedSavings = preRealised - afterRealised;
  const savings =
    typeof capitalGains.savingsOverride === "number"
      ? capitalGains.savingsOverride
      : computedSavings;
  const showSavings = savings > 0;

  return (
    <div className="cards-grid">
      {/* Pre Harvesting */}
      <div className="card card-pre">
        <h2 className="card-title">Pre Harvesting</h2>
        <GainsTable
          stcg={capitalGains.stcg}
          ltcg={capitalGains.ltcg}
          isAfter={false}
        />
      </div>

      {/* After Harvesting */}
      <div className="card card-after">
        <h2 className="card-title">After Harvesting</h2>
        {after && (
          <GainsTable stcg={after.stcg} ltcg={after.ltcg} isAfter={true} />
        )}
        {showSavings && (
          <div className="savings-banner">
            You&apos;re going to save 🎉{" "}
            <strong>
              ${" "}
              {savings.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
