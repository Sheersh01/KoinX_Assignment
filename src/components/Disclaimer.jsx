import React, { useState } from "react";

const notes = [
  "Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.",
  "Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.",
  "Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.",
  "Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.",
  "Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.",
];

export default function Disclaimer() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`disclaimer ${open ? "open" : ""}`}>
      <button
        className="disclaimer-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="disclaimer-icon material-symbols-rounded"
          aria-hidden="true"
        >
          info
        </span>
        <span className="disclaimer-title">
          Important Notes &amp; Disclaimers
        </span>
        <span
          className="disclaimer-chevron material-symbols-rounded"
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>
      <div className={`disclaimer-content ${open ? "open" : ""}`}>
        <ul className="disclaimer-list">
          {notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
