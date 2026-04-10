import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MessageOverlay from "./MessageOverlay";
import "../styles/navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowLogoutConfirm(false);
    window.location.href = "/";
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="navbar">

      <div className="navbar-container">

        <h1 className="logo">UniVault</h1>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/download">Download</Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogoutClick} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>

      </div>

      <MessageOverlay
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        buttonText="Yes, Logout"
        cancelText="Cancel"
        onClose={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

    </div>
  );
}