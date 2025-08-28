import React, { useEffect, useState } from "react";
import { createRecipe, getRecipe, updateRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import "../components/recipes.css";
import { useToast } from "../components/Toast";

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
  const [fieldErrors, setFieldErrors] = useState({});
  const { notify } = useToast();

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
    setFieldErrors({});

    // Basic client-side validation: non-empty title, length, image url format if present
    const errs = {};
    const title = form.title.trim();
    if (!title) errs.title = "Title is required.";
    if (title && title.length > 200) errs.title = "Title must be 200 characters or fewer.";
    if (form.image_url && !/^https?:\/\/.+/i.test(form.image_url)) {
      errs.image_url = "Image URL must start with http:// or https://";
    }
    if (Object.keys(errs).length) {
      setSaving(false);
      setFieldErrors(errs);
      setError("Please fix the highlighted fields.");
      return;
    }

    try {
      if (isEdit) {
        const updated = await updateRecipe(recipeId, { ...form, title });
        notify({ type: "success", message: "Recipe updated." });
        navigate(`/recipes/${updated.id}`);
      } else {
        const created = await createRecipe({ ...form, title });
        notify({ type: "success", message: "Recipe created." });
        navigate(`/recipes/${created.id}`);
      }
    } catch (err) {
      const msg = err?.uiMessage || "Save failed. Please ensure you are signed in and have permission to modify this recipe.";
      setError(msg);

      // Map FastAPI 422 validation to field-level messages if possible
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        const fErrs = {};
        detail.forEach((d) => {
          const loc = Array.isArray(d?.loc) ? d.loc : [];
          const field = loc[loc.length - 1]; // e.g., 'title'
          if (typeof field === "string") {
            fErrs[field] = d?.msg || "Invalid value.";
          }
        });
        setFieldErrors(fErrs);
      }
      notify({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page"><p className="loading-inline"><span className="spinner" /> Loading...</p></div>;

  return (
    <div className="page">
      <h2>{isEdit ? "Edit Recipe" : "Create Recipe"}</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <label>
          Title
          <input
            required
            aria-invalid={Boolean(fieldErrors.title)}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g., Spaghetti Carbonara"
          />
          {fieldErrors.title && <small style={{ color: "tomato" }}>{fieldErrors.title}</small>}
        </label>
        <label>
          Description
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Short summary of the dish"
          />
        </label>
        <label>
          Ingredients (one per line)
          <textarea
            rows={6}
            value={form.ingredients}
            onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
            placeholder={"e.g.\n- 200g spaghetti\n- 2 eggs\n- 50g pancetta"}
          />
        </label>
        <label>
          Instructions
          <textarea
            rows={6}
            value={form.instructions}
            onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
            placeholder={"1) Boil pasta\n2) Prepare sauce\n3) Combine and serve"}
          />
        </label>
        <label>
          Image URL
          <input
            aria-invalid={Boolean(fieldErrors.image_url)}
            value={form.image_url}
            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
            placeholder="https://example.com/your-image.jpg"
          />
          {fieldErrors.image_url && <small style={{ color: "tomato" }}>{fieldErrors.image_url}</small>}
        </label>
        {error && <div style={{ color: "tomato" }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? <span className="loading-inline"><span className="spinner" />Saving...</span> : "Save"}
          </button>
          <button className="btn outline" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
