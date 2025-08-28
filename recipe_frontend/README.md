# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight: No heavy UI frameworks - uses only vanilla CSS and React
- Modern UI: Clean, responsive design
- Fast: Minimal dependencies for quick loading times
- Simple: Easy to understand and modify

## Environment Configuration

This app reads its runtime configuration from environment variables exposed by Create React App (must be prefixed with REACT_APP_). Copy .env.example to .env and set the values for your environment.

Required:
- REACT_APP_API_BASE_URL — Base URL of the backend API (no trailing slash).
  - Example (local dev): http://localhost:3001
  - Example (deployment): https://api.example.com

Optional:
- REACT_APP_ROUTER_BASENAME — Router basename if the frontend is served from a sub-path. Defaults to "/".

Where it's used:
- src/config.js exposes getConfig() that reads these env vars and normalizes them.
- src/api/client.js imports getConfig() and creates an Axios instance with baseURL set to apiBaseUrl from the environment.

If REACT_APP_API_BASE_URL is not set, the app will throw an error at startup to help catch misconfiguration early.

## Getting Started (Development)

In the project directory, you can run:

### Prerequisites
- Ensure the backend is running (default dev port 3001). See the backend README.
- Copy .env.example to .env and set REACT_APP_API_BASE_URL to the backend URL (no trailing slash).

### npm start
Runs the app in development mode.
Open http://localhost:3000 to view it in your browser.

### npm test
Launches the test runner in interactive watch mode.

## Production build and deployment

### 1) Configure environment
Before building, set the environment variables so Create React App inlines them into the static bundle:
- REACT_APP_API_BASE_URL (required): e.g., https://api.myrecipehub.com
- REACT_APP_ROUTER_BASENAME (optional): e.g., /app if your site is served under a sub-path.

You can set them inline for a one-off build or via a .env.production file. Example (Linux/macOS):
   REACT_APP_API_BASE_URL="https://api.myrecipehub.com" npm run build

On Windows (PowerShell):
   setx REACT_APP_API_BASE_URL "https://api.myrecipehub.com"
   npm run build

Note: CRA reads env at build time; changes at runtime require a rebuild.

### 2) Build static assets
From recipe_frontend:
   npm install
   npm run build

This produces an optimized static bundle in the build/ directory.

### 3) Deploy static files
You can serve the contents of build/ using:
- Any static hosting (e.g., Netlify, Vercel, GitHub Pages, S3 + CloudFront).
- A traditional web server (nginx/Apache). For a Single Page App, configure a fallback to /index.html for unknown routes so client-side routing works.

Example nginx config snippet:
   location / {
     root   /var/www/recipe_frontend/build;
     try_files $uri /index.html;
   }

If hosted under a sub-path (e.g., https://www.myrecipehub.com/app), set REACT_APP_ROUTER_BASENAME="/app" at build time and configure your web server to serve the build at that path.

### 4) Connect to the backend
- Ensure the backend is reachable from the browser at REACT_APP_API_BASE_URL and that CORS on the backend allows your frontend origin(s).
- For production, set backend CORS_ALLOW_ORIGINS to your final frontend origin(s) (no wildcard).

## Troubleshooting

- Missing REACT_APP_API_BASE_URL:
  The app will throw at startup if this is not set. Create .env from .env.example and set the correct backend URL.

- 401/403 errors when creating/editing/favoriting:
  You must be logged in. Use the Register and Login pages first. If the token expired, log in again.

- CORS errors:
  Ensure the backend CORS allows the frontend origin. In production, avoid "*"; list exact origins.

- Routing returns 404 on refresh:
  Configure your static host/server to fallback to index.html for unknown routes (SPA).

## Customization

See src/App.css and component CSS files for styling hooks and variables.

## Learn More

For additional CRA documentation, visit:
- https://facebook.github.io/create-react-app/docs/getting-started
- https://facebook.github.io/create-react-app/docs/deployment
