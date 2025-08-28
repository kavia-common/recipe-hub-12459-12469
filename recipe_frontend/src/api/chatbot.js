import { api } from "./client";

/**
 * PUBLIC_INTERFACE
 * Send a chat request to the backend /chatbot endpoint and return the response data.
 * @param {{ messages: Array<{role:"user"|"assistant"|"system", content: string}>, model?: string|null, max_tokens?: number|null, temperature?: number|null }} params
 * @returns {Promise<import("../types").ChatbotResponse|any>}
 */
export async function sendChatMessage({ messages, model = null, max_tokens = null, temperature = null }) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("messages array is required");
  }

  const payload = { messages };
  if (model != null) payload.model = model;
  if (max_tokens != null) payload.max_tokens = max_tokens;
  if (temperature != null) payload.temperature = temperature;

  const { data } = await api.post("/chatbot", payload);
  // Ensure a consistent shape in edge cases
  if (!data || typeof data !== "object") return { choices: [{ index: 0, message: { role: "assistant", content: "" } }] };
  if (!Array.isArray(data.choices)) data.choices = [];
  return data;
}
