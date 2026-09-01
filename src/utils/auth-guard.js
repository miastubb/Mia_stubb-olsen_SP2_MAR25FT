import { getSession } from "./session-storage.js";
import { routes } from "./routes.js";

/**
 * Builds a login URL that preserves the user's current location.
 *
 * The current pathname, query string, and hash are stored in a
 * `redirect` query parameter so the user can return to the original
 * location after successfully logging in.
 *
 * @returns {string} The login URL including the encoded redirect target.
 */
function getLoginRedirectUrl() {
  const currentLocation = `${globalThis.location.pathname}${globalThis.location.search}${globalThis.location.hash}`;

  const loginUrl = new URL(routes.login, globalThis.location.origin);
  loginUrl.searchParams.set("redirect", currentLocation);

  return loginUrl.toString();
}

/**
 * Redirects an unauthenticated user to the login page.
 *
 * The current application location is preserved in the `redirect`
 * query parameter so it can be restored after authentication.
 *
 * @returns {void}
 */
function redirectToLogin() {
  globalThis.location.assign(getLoginRedirectUrl());
}

/**
 * Requires an authenticated session before allowing access to a protected page.
 *
 * If a valid session exists, the session is returned so the calling page can
 * immediately use the authenticated user's data.
 *
 * If no valid session exists, the user is redirected to the login page and
 * the current location is preserved for a later redirect after login.
 *
 * @returns {ReturnType<typeof getSession>}
 * The authenticated session, or `null` when the user is redirected.
 */
export function requireAuth() {
  const session = getSession();

  if (session) {
    return session;
  }

  redirectToLogin();

  return null;
}

/**
 * Requires an authenticated session before allowing a protected user action.
 *
 * This guard is intended for authenticated actions on otherwise public pages,
 * such as placing a bid on a listing. Public access to the page remains
 * unaffected until the protected action is attempted.
 *
 * If a valid session exists, the session is returned so the calling action
 * can immediately use authenticated user data.
 *
 * If no valid session exists, the user is redirected to the login page and
 * the current location is preserved for a later redirect after login.
 *
 * @returns {ReturnType<typeof getSession>}
 * The authenticated session, or `null` when the user is redirected.
 */
export function requireAuthAction() {
  const session = getSession();

  if (session) {
    return session;
  }

  redirectToLogin();

  return null;
}
