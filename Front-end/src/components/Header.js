import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { Bell } from "lucide-react";
function Header() {
  const location = useLocation();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/admin">
            <img
              src={logo}
              alt="Company logo"
              width="60"
              className="d-inline-block align-top"
            />
          </Link>

          {/* Toggle Button for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto gap-4"></ul>

            {/* Info Button */}
            <div className="d-flex gap-3 align-items-center">
              <Link to="/info">
                <button className="btn btn-warning text-white highlight-button">
                  <Bell size={20} />
                  Thông báo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: "70px" }}></div>
      <style>
        {`
          .nav-link {
            position: relative;
            transition: color 0.3s ease-in-out;
          }
          .nav-link::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 0;
            height: 2px;
            background-color: red;
            transition: all 0.3s ease-in-out;
            transform: translateX(-50%);
          }
          .nav-link.active {
            color: red !important;
          }
          .nav-link.active::after {
            width: 100%;
          }
          .nav-link:hover {
            color: red !important;
          }
          .nav-link:hover::after {
            width: 100%;
          }
          .highlight-button {
            background-color: #0070f4 !important;
            border-color: #0070f4 !important;
            box-shadow: 0 0 8px rgba(0, 112, 244, 0.5);
            transition: all 0.3s ease-in-out;
          }
          .highlight-button:hover {
            background-color: #005bb5 !important;
            box-shadow: 0 0 12px rgba(0, 112, 244, 0.7);
            transform: translateY(-2px);
          }
        `}
      </style>
    </>
  );
}

export default Header;
