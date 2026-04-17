import React from "react";
import { useApp } from "../context/AppContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { darkMode, setDarkMode } = useApp();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo" aria-label="KoinX">
          <img src={logo} alt="KoinX" className="logo-image" />
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
