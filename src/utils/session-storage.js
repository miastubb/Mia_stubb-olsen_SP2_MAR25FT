const SESSION_KEY = "auctionSession";

/**
 * @typedef {object} SessionProfile
 * @property {string} name
 * @property {string} [email]
 * @property {string} [bio]
 * @property {Record<string, unknown>|null} [avatar]
 * @property {Record<string, unknown>|null} [banner]
 * @property {number} [credits]
 */

/**
 * @typedef {object} SessionData
 * @property {string} token
 * @property {string} [apiKey]
 * @property {SessionProfile} profile
 */

/**
 * Checks whether a value is a non-array object.
 * @param {unknown} value
 * @returns {boolean}
 */
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Checks whether stored session data has the expected structure.
 * @param {unknown} value
 * @returns {boolean}
 */
function isValidSession(value) {
  if (!isObject(value)) {
    return false;
  }

  const session = /** @type {Record<string, unknown>} */ (value);

  if (typeof session.token !== "string" || !session.token.trim()) {
    return false;
  }

  if (session.apiKey !== undefined && typeof session.apiKey !== "string") {
    return false;
  }

  if (!isObject(session.profile)) {
    return false;
  }

  const profile = /** @type {Record<string, unknown>} */ (session.profile);

  if (typeof profile.name !== "string" || !profile.name.trim()) {
    return false;
  }

  if (profile.credits !== undefined && typeof profile.credits !== "number") {
    return false;
  }

  return true;
}

/**
 * Saves a whitelisted user session.
 * @param {SessionData} sessionData
 * @returns {SessionData|null}
 */
export function saveSession({ token, apiKey, profile }) {
  if (!token.trim() || !profile.name.trim()) {
    return null;
  }

  /** @type {SessionProfile} */
  const safeProfile = {
    name: profile.name,
    ...(typeof profile.email === "string" && {
      email: profile.email,
    }),
    ...(typeof profile.bio === "string" && {
      bio: profile.bio,
    }),
    ...(isObject(profile.avatar) && {
      avatar: profile.avatar,
    }),
    ...(isObject(profile.banner) && {
      banner: profile.banner,
    }),
    ...(typeof profile.credits === "number" && {
      credits: profile.credits,
    }),
  };

  /** @type {SessionData} */
  const session = {
    token,
    ...(apiKey && { apiKey }),
    profile: safeProfile,
  };

  try {
    globalThis.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current session.
 * @returns {SessionData|null}
 */
export function getSession() {
  try {
    const storedSession = globalThis.localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
      return null;
    }

    const session = JSON.parse(storedSession);

    if (!isValidSession(session)) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Clears the current session.
 */
export function clearSession() {
  try {
    globalThis.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage may be unavailable or restricted.
  }
}
