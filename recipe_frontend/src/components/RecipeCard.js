import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { favoriteRecipe, unfavoriteRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";

/**
 * Recipe card with basic details and favorite toggle.
 */
export default function RecipeCard({ recipe, onFavoritedChanged }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [fav, setFav] = useState(Boolean(recipe.__is_favorite)); // local UI hint
  const { notify } = useToast();

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (busy) return;
    setBusy(true);

    // Optimistic update
    const prev = fav;
    setFav(!prev);

    try {
      if (prev) {
        await unfavoriteRecipe(recipe.id);
        notify({ type: "success", message: "Removed from favorites." });
      } else {
        await favoriteRecipe(recipe.id);
        notify({ type: "success", message: "Added to favorites." });
      }
      onFavoritedChanged && onFavoritedChanged(recipe.id, !prev);
    } catch (e) {
      // rollback and show error
      setFav(prev);
      notify({ type: "error", message: e?.uiMessage || "Failed to update favorite." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <Link className="thumb" to={`/recipes/${recipe.id}`}>
        <img
          alt={recipe.title}
          src={recipe.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(recipe.title)}`}
        />
      </Link>
      <div className="content">
        <Link to={`/recipes/${recipe.id}`} className="title-link">
          <h4 title={recipe.title}>{recipe.title}</h4>
        </Link>
        {recipe.description && <p className="desc">{recipe.description}</p>}
        <div className="meta">
          <span className="created">{new Date(recipe.created_at).toLocaleDateString()}</span>
          <button className={`fav ${fav ? "on" : ""}`} onClick={toggleFavorite} disabled={busy} aria-label="Toggle favorite">
            {fav ? "★" : "☆"}
          </button>
        </div>
      </div>
    </div>
  );
}
