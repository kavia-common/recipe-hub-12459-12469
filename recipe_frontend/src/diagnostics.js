//
// PUBLIC_INTERFACE
// logStartupDiagnostics logs a minimal summary of configuration and environment hints.
// It is safe to include in production; it only logs to console.
export function logStartupDiagnostics() {
  try {
    // Avoid breaking if console is not available
    if (typeof console === "undefined") return;
    const api = process.env.REACT_APP_API_BASE_URL;
    const base = process.env.REACT_APP_ROUTER_BASENAME || "/";
    console.info(
      "[RecipeHub] Startup config:",
      { REACT_APP_API_BASE_URL: api || "(missing)", REACT_APP_ROUTER_BASENAME: base }
    );
  } catch {
    // ignore
  }
}
