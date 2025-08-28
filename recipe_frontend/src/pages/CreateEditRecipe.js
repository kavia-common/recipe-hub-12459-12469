import React, { useEffect, useState } from "react";
import { createRecipe, getRecipe, updateRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import "../components/recipes.css";

/**
 * Create or edit a recipe.
 */
export default function CreateEditRecipe() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const isEdit = Boolean(recipeId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const data = await getRecipe(recipeId);
        setForm({
          title: data.title || "",
          description: data.description || "",
          ingredients: data.ingredients || "",
          instructions: data.instructions || "",
          image_url: data.image_url || "",
        });
      } catch {
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isEdit, recipeId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const updated = await updateRecipe(recipeId, form);
        navigate(`/recipes/${updated.id}`);
      } else {
        const created = await createRecipe(form);
        navigate(`/recipes/${created.id}`);
      }
    } catch {
      setError("Save failed. Please ensure you are signed in and have permission to modify this recipe.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <h2>{isEdit ? "Edit Recipe" : "Create Recipe"}</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <label>
          Title
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </label>
        <label>
          Description
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>
        <label>
          Ingredients (one per line)
          <textarea
            rows={6}
            value={form.ingredients}
            onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
          />
        </label>
        <label>
          Instructions
          <textarea
            rows={6}
            value={form.instructions}
            onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
          />
        </label>
        <label>
          Image URL
          <input
            value={form.image_url}
            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
          />
        </label>
        {error && <div style={{ color: "tomato" }}>{error}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="btn outline" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
