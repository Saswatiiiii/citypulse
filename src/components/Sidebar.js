import logo from "../assets/citypulse-logo.png";

import React from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  FaChartPie,
  FaCloudSun,
  FaMapMarkedAlt,
  FaExclamationCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";

import {
  useTheme,
} from "../context/ThemeContext";

import "../styles/Sidebar.css";

function Sidebar() {

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  return (

    <div className="sidebar">

      <div>

        <div className="logo-section">

          <img
            src={logo}
            alt="CityPulse"
            className="sidebar-logo"
          />

          <div className="logo-text">

            <h2>
              CityPulse
            </h2>

            <p>
              Smart City Monitoring System
            </p>

          </div>

        </div>

        <nav>

          <NavLink to="/">
            <FaChartPie />
            Dashboard
          </NavLink>

          <NavLink to="/weather">
            <FaCloudSun />
            Weather
          </NavLink>

          <NavLink to="/map">
            <FaMapMarkedAlt />
            Map
          </NavLink>

          <NavLink to="/reports">
            <FaExclamationCircle />
            Reports
          </NavLink>

        </nav>

      </div>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
      >

        {darkMode ? <FaSun /> : <FaMoon />}

      </button>

    </div>
  );
}

export default Sidebar;