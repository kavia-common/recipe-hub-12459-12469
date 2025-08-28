import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/toast.css';
import './components/chatbot.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { getConfig } from './config';
import { ToastProvider } from './components/Toast';

const root = ReactDOM.createRoot(document.getElementById('root'));

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
