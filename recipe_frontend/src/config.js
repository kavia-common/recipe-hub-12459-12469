//
// PUBLIC_INTERFACE
// getConfig returns the app configuration derived from environment variables.
//
export function getConfig() {
  /** This function returns the app configuration derived from environment variables. */
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
