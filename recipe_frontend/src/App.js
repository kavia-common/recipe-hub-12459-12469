import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import CreateEditRecipe from "./pages/CreateEditRecipe";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <Navbar />

      {/* Floating controls */}
      <ChatbotWidget />
      <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 20 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Home />} />
        <Route path="/recipes/new" element={<CreateEditRecipe />} />
        <Route path="/recipes/:recipeId" element={<RecipeDetail />} />
        <Route path="/recipes/:recipeId/edit" element={<CreateEditRecipe />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
