import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

/**
 * Login page using AuthContext
 */
export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { notify } = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      notify({ type: "success", message: "Signed in successfully." });
      navigate("/");
    } catch (err) {
      const msg = err?.uiMessage || "Login failed. Check your credentials.";
      setError(msg);
      notify({ type: "error", message: msg });
    }
  };

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <h2>Sign in</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Username
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        {error && <div style={{ color: "tomato" }}>{error}</div>}
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        No account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
