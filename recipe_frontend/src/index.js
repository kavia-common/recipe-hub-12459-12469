import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/toast.css';
import './components/chatbot.css';
import './components/note-title.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { getConfig } from './config';
import { ToastProvider } from './components/Toast';
import { logStartupDiagnostics } from './diagnostics';

const rootEl = document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);

// Render a simple friendly error UI to avoid a blank screen in case config is missing
function renderConfigError(err) {
  const message = (err && err.message) ? err.message : 'Application failed to start due to configuration error.';
  const suggestion = 'Ensure REACT_APP_API_BASE_URL is set in your .env file. See recipe_frontend/.env.example.';
  root.render(
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <h2>Recipe Hub</h2>
      <p style={{ color: '#dc2626' }}><strong>Startup error:</strong> {message}</p>
      <p>{suggestion}</p>
      <pre style={{ background: '#111827', color: '#e5e7eb', padding: 12, borderRadius: 8, overflow: 'auto' }}>
{`Required:
- REACT_APP_API_BASE_URL (no trailing slash), e.g.
  http://localhost:3001
  or
  https://vscode-internal-31111-qa.qa01.cloud.kavia.ai:3001

Optional:
- REACT_APP_ROUTER_BASENAME (default "/")`}
      </pre>
    </div>
  );
}

try {
  // Log minimal config for CI/preview visibility
  logStartupDiagnostics();

  const { routerBasename } = getConfig();
  root.render(
    <React.StrictMode>
      <BrowserRouter basename={routerBasename}>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (e) {
  // If config throws (e.g., missing REACT_APP_API_BASE_URL), show an explanatory message.
  renderConfigError(e);
}
