import { api } from "./client";

// PUBLIC_INTERFACE
export async function listRecipes({ q = "", skip = 0, limit = 12, title = "", ingredient = "", author_id = null } = {}) {
  /** List recipes with optional search and pagination */
  const params = {};
  if (q) params.q = q;
  if (title) params.title = title;
  if (ingredient) params.ingredient = ingredient;
  if (author_id != null) params.author_id = author_id;
  params.skip = skip;
  params.limit = limit;
  const { data } = await api.get("/recipes", { params });
  return data;
}

// PUBLIC_INTERFACE
export async function getRecipe(recipe_id) {
  /** Get a single recipe by id */
  const { data } = await api.get(`/recipes/${recipe_id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function createRecipe(payload) {
  /** Create a new recipe (requires auth) */
  const { data } = await api.post("/recipes", payload);
  return data;
}

// PUBLIC_INTERFACE
export async function updateRecipe(recipe_id, payload) {
  /** Update a recipe by id (requires auth and ownership) */
  const { data } = await api.put(`/recipes/${recipe_id}`, payload);
  return data;
}

// PUBLIC_INTERFACE
export async function deleteRecipe(recipe_id) {
  /** Delete a recipe by id (requires auth and ownership) */
  const { data } = await api.delete(`/recipes/${recipe_id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function favoriteRecipe(recipe_id) {
  /** Mark a recipe as favorite (requires auth) */
  const { data } = await api.post(`/recipes/${recipe_id}/favorite`);
  return data;
}

// PUBLIC_INTERFACE
export async function unfavoriteRecipe(recipe_id) {
  /** Unmark a recipe as favorite (requires auth) */
  const { data } = await api.delete(`/recipes/${recipe_id}/favorite`);
  return data;
}

// PUBLIC_INTERFACE
export async function listMyFavorites({ skip = 0, limit = 20 } = {}) {
  /** List my favorite recipes (requires auth) */
  const params = { skip, limit };
  const { data } = await api.get(`/recipes/favorites/me`, { params });
  return data;
}
