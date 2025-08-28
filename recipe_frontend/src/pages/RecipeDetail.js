import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, favoriteRecipe, getRecipe, unfavoriteRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import "../components/recipes.css";

/**
 * Recipe detail page with actions.
 */
export default function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [busyFav, setBusyFav] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getRecipe(recipeId);
        setRecipe(data);
      } catch {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [recipeId]);

  const canEdit = isAuthenticated && user && recipe && user.id === recipe.author_id;

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBusyFav(true);
    try {
      if (fav) {
        await unfavoriteRecipe(recipe.id);
        setFav(false);
      } else {
        await favoriteRecipe(recipe.id);
        setFav(true);
      }
    } catch {
      // ignore
    } finally {
      setBusyFav(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(recipe.id);
      navigate("/recipes");
    } catch {
      // ignore for MVP
    }
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!recipe) return <div className="page"><p>Recipe not found.</p></div>;

  return (
    <div className="page">
      <div className="detail-header">
        <img
          alt={recipe.title}
          src={recipe.image_url || `https://placehold.co/800x600?text=${encodeURIComponent(recipe.title)}`}
        />
        <div>
          <h2>{recipe.title}</h2>
          <div className="meta-row">
            <span>By user #{recipe.author_id}</span>•{" "}
            <span>{new Date(recipe.created_at).toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className={`btn small ${fav ? "" : "outline"}`} onClick={toggleFavorite} disabled={busyFav}>
              {fav ? "★ Favorited" : "☆ Favorite"}
            </button>
            {canEdit && (
              <>
                <Link to={`/recipes/${recipe.id}/edit`} className="btn small">Edit</Link>
                <button className="btn small outline" onClick={onDelete}>Delete</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="detail-body">
        {recipe.description && (
          <section>
            <h3>Description</h3>
            <p>{recipe.description}</p>
          </section>
        )}
        {recipe.ingredients && (
          <section>
            <h3>Ingredients</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{recipe.ingredients}</pre>
          </section>
        )}
        {recipe.instructions && (
          <section>
            <h3>Instructions</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{recipe.instructions}</pre>
          </section>
        )}
      </div>
    </div>
  );
}
