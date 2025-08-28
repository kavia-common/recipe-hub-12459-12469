import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

/**
 * Responsive Navbar with links and auth actions.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">RecipeHub</Link>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          ☰
        </button>
        <nav className={`links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/recipes">Browse</NavLink>
          {isAuthenticated && <NavLink to="/favorites">Favorites</NavLink>}
          {isAuthenticated && <NavLink to="/recipes/new">Create</NavLink>}
          <a href="#recommend-title" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-note-title-recommender")); }}>Recommend Title</a>
        </nav>
        <div className="auth">
          {isAuthenticated ? (
            <div className="profile">
              <span className="user">@{user?.username}</span>
              <button className="btn small" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login" className="btn small outline">Login</NavLink>
              <NavLink to="/register" className="btn small">Register</NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
