import React, { useEffect, useState } from "react";
import { listMyFavorites } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";
import "../components/recipes.css";
import { useToast } from "../components/Toast";

/**
 * List of user's favorite recipes.
 */
export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await listMyFavorites({ skip: 0, limit: 100 });
      // Mark as favorite for UI
      const mapped = (data || []).map((r) => ({ ...r, __is_favorite: true }));
      setRecipes(mapped);
    } catch (err) {
      setRecipes([]);
      notify({ type: "error", message: err?.uiMessage || "Failed to load favorites." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFavChange = () => {
    // Re-fetch after unfavorite to refresh view
    load();
  };

  return (
    <div className="page">
      <h2>My Favorites</h2>
      {loading ? (
        <p className="loading-inline"><span className="spinner" /> Loading...</p>
      ) : recipes.length === 0 ? (
        <p>You have not favorited any recipes yet.</p>
      ) : (
        <div className="grid">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} onFavoritedChanged={onFavChange} />
          ))}
        </div>
      )}
    </div>
  );
}
