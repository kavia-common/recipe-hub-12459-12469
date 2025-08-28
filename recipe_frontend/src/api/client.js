/**
 * API Client for Recipe Hub frontend.
 * - Reads base URL from env (via getConfig)
 * - Injects Bearer token when available
 * - Centralizes error handling
 */

import axios from "axios";
import { getConfig } from "../config";

// Token storage keys
const TOKEN_KEY = "rh_access_token";

// PUBLIC_INTERFACE
export function getAccessToken() {
  /** Return the current access token from localStorage, or null if not set. */
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setAccessToken(token) {
  /** Persist a new access token to localStorage (or clear when falsy). */
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors (e.g., private mode)
  }
}

// Create axios instance
const { apiBaseUrl } = getConfig();
export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      // FastAPI expects "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 globally if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You could add global handling/logging here
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export async function login({ username, password }) {
  /**
   * Perform OAuth2 password flow login and store access token.
   * Returns token response: { access_token, token_type }
   */
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  form.append("grant_type", "password");

  const { data } = await api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (data?.access_token) {
    setAccessToken(data.access_token);
  }
  return data;
}

// PUBLIC_INTERFACE
export async function register({ email, username, password }) {
  /**
   * Register a new user.
   * Returns created user object.
   */
  const { data } = await api.post("/auth/register", { email, username, password });
  return data;
}

// PUBLIC_INTERFACE
export async function getProfile() {
  /**
   * Get current user's profile using stored token.
   * Returns user object or throws on 401.
   */
  const { data } = await api.get("/auth/profile");
  return data;
}
