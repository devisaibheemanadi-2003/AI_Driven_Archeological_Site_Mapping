import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">🌍 AI Mapping</div>
      <div className="nav-links">
        <NavLink to="/" end className="nav-item">
          Home
        </NavLink>
        <NavLink to="/soil-detection" className="nav-item">
          Soil Detection
        </NavLink>
        <NavLink to="/vegetation-detection" className="nav-item">
          Vegetation Detection
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
