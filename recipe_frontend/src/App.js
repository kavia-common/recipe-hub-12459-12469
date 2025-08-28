import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Simple placeholder pages
function Home() {
  return <p>Welcome to Recipe Hub!</p>;
}
function Recipes() {
  return <p>Recipe list will appear here.</p>;
}
function LoginPage() {
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
    } catch (err) {
      setError('Login failed. Check your credentials.');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 320, margin: '1rem auto', textAlign: 'left' }}>
      <h3>Login</h3>
      <label>Username</label>
      <input
        type="text"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <label>Password</label>
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      {error && <div style={{ color: 'tomato', marginBottom: 8 }}>{error}</div>}
      <button className="theme-toggle" type="submit" disabled={isLoading} style={{ position: 'static' }}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      await register(form);
      setMsg('Account created. You can now sign in.');
    } catch (e2) {
      setErr('Registration failed. Ensure data is valid and not already used.');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: '1rem auto', textAlign: 'left' }}>
      <h3>Register</h3>
      <label>Email</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <label>Username</label>
      <input
        type="text"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <label>Password</label>
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      {err && <div style={{ color: 'tomato', marginBottom: 8 }}>{err}</div>}
      {msg && <div style={{ color: 'seagreen', marginBottom: 8 }}>{msg}</div>}
      <button className="theme-toggle" type="submit" disabled={isLoading} style={{ position: 'static' }}>
        {isLoading ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
}

function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <p>Please sign in to view your profile.</p>;
  return (
    <div>
      <p>Signed in as <strong>{user?.username}</strong> ({user?.email})</p>
      <button className="theme-toggle" onClick={logout} style={{ position: 'static' }}>Sign Out</button>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <nav style={{ marginTop: 16, marginBottom: 16 }}>
          <Link className="App-link" to="/">Home</Link>{" | "}
          <Link className="App-link" to="/recipes">Recipes</Link>{" | "}
          <Link className="App-link" to="/login">Login</Link>{" | "}
          <Link className="App-link" to="/register">Register</Link>{" | "}
          <Link className="App-link" to="/profile">Profile</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
