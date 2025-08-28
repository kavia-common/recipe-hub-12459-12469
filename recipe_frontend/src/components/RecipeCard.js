import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { favoriteRecipe, unfavoriteRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext";

/**
 * Recipe card with basic details and favorite toggle.
 */
export default function RecipeCard({ recipe, onFavoritedChanged }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [fav, setFav] = useState(Boolean(recipe.__is_favorite)); // local UI hint

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBusy(true);
    try {
      if (fav) {
        await unfavoriteRecipe(recipe.id);
        setFav(false);
      } else {
        await favoriteRecipe(recipe.id);
        setFav(true);
      }
      onFavoritedChanged && onFavoritedChanged(recipe.id, !fav);
    } catch (e) {
      // noop minimal error handling
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
