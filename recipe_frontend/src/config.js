//
// PUBLIC_INTERFACE
// getConfig returns the app configuration derived from environment variables.
//
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

  if (!apiBaseUrl) {
    // Developers: ensure REACT_APP_API_BASE_URL is set in .env to point at the backend.
    // We throw to help catch misconfiguration early in CI or local dev.
    throw new Error(
      "Missing REACT_APP_API_BASE_URL. Please set it in your .env file."
    );
  }

  return {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""), // normalize: remove trailing slash
    routerBasename,
  };
}
