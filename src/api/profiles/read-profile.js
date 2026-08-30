import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Retrieves one Auction House profile.
 *
 * Uses supplied credentials during login, or the saved session afterward.
 *
 * @param {string} name
 * @param {{token?: string, apiKey?: string}} [credentials]
 */
export async function readProfile(name, credentials = {}) {
  return apiRequest({
    endpoint: `${API_ENDPOINTS.auction.profiles}/${encodeURIComponent(name)}`,
    auth: true,
    token: credentials.token,
    apiKey: credentials.apiKey,
  });
}
