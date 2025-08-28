/**
 * PUBLIC_INTERFACE
 * getConfig returns the app configuration derived from environment variables.
 * It enforces presence of REACT_APP_API_BASE_URL at runtime in the browser.
 * During certain CI/build steps, process.env may be missing; in that case we avoid
 * throwing synchronously to prevent build hangs and instead return placeholders.
 */
// PUBLIC_INTERFACE
export function getConfig() {
  /**
   * This function returns the app configuration derived from environment variables.
   * Required:
   *  - REACT_APP_API_BASE_URL: Base URL to the backend API (no trailing slash).
   * Optional:
   *  - REACT_APP_ROUTER_BASENAME: Router basename when served from a sub-path (defaults to "/").
   */
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const routerBasename = process.env.REACT_APP_ROUTER_BASENAME || "/";

  // If running in a browser environment and apiBaseUrl is missing, throw so UI can show a friendly message.
  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

  if (!apiBaseUrl) {
    const msg = "Missing REACT_APP_API_BASE_URL. Please set it in your .env file.";
    if (isBrowser) {
      // Let index.js catch and render a friendly message
      throw new Error(msg);
    }
    // In non-browser (build/CI pre-processing) return a placeholder to prevent build-time crashes.
    // Note: CRA inlines env vars at build time; if missing at actual runtime, index.js will still show the message.
    return {
      apiBaseUrl: "http://placeholder.invalid",
      routerBasename,
    };
  }

  return {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""), // normalize: remove trailing slash
    routerBasename,
  };
}
