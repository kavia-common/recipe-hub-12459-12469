import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

/**
 * Register page using AuthContext
 */
export default function Register() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const { notify } = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await register(form);
      setMsg("Account created. You can now sign in.");
      notify({ type: "success", message: "Account created. Please sign in." });
      setTimeout(() => navigate("/login"), 700);
    } catch (error) {
      const message = error?.uiMessage || "Registration failed. Ensure data is valid and not already used.";
      setErr(message);
      notify({ type: "error", message });
    }
  };

  return (
    <div className="page" style={{ maxWidth: 480 }}>
      <h2>Create account</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
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
        {err && <div style={{ color: "tomato" }}>{err}</div>}
        {msg && <div style={{ color: "seagreen" }}>{msg}</div>}
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
