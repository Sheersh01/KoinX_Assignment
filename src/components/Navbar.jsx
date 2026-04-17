import React from "react";
import { useApp } from "../context/AppContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { darkMode, setDarkMode } = useApp();
  const isDark = darkMode;
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo" aria-label="KoinX">
          <img src={logo} alt="KoinX" className="logo-image" />
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span
            className="material-symbols-rounded theme-toggle-icon"
            aria-hidden="true"
          >
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </div>
    </nav>
  );
}
