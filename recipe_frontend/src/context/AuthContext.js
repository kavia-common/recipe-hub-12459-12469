/**
 * Authentication Context for Recipe Hub.
 * Exposes:
 *  - user: current user object or null
 *  - token: current access token or null
 *  - status: "idle" | "loading" | "authenticated" | "unauthenticated" | "error"
 *  - login, logout, register, refreshProfile actions
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAccessToken, setAccessToken, login as apiLogin, register as apiRegister, getProfile } from "../api/client";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state and actions to the component tree. */
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const [token, setToken] = useState(() => getAccessToken());

  const refreshProfile = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
    setStatus("loading");
    try {
      const me = await getProfile();
      setUser(me);
      setStatus("authenticated");
      return me;
    } catch (err) {
      // Token invalid or server error
      setAccessToken(null);
      setToken(null);
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  const login = useCallback(async ({ username, password }) => {
    setStatus("loading");
    try {
      const data = await apiLogin({ username, password });
      setToken(data?.access_token || null);
      await refreshProfile();
      return data;
    } catch (err) {
      setStatus("error");
      throw err;
    }
  }, [refreshProfile]);

  const register = useCallback(async ({ email, username, password }) => {
    setStatus("loading");
    try {
      const userCreated = await apiRegister({ email, username, password });
      setStatus("unauthenticated");
      return userCreated;
    } catch (err) {
      setStatus("error");
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Initial load: if token exists, try to fetch profile
  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setStatus("unauthenticated");
    }
  }, [token, refreshProfile]);

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      login,
      logout,
      register,
      refreshProfile,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
    }),
    [user, token, status, login, logout, register, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
