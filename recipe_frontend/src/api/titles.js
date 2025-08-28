import { api } from "./client";

/**
 * PUBLIC_INTERFACE
 * Request title recommendations from the backend for a given note content.
 * @param {{ content: string }} payload - The note content to analyze.
 * @returns {Promise<{ suggestions: string[] }>}
 */
export async function recommendTitles({ content }) {
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("content is required");
  }
  const { data } = await api.post("/recommend-title", { content });
  // Normalize shape
  const suggestions = Array.isArray(data?.suggestions) ? data.suggestions : [];
  return { suggestions };
}
