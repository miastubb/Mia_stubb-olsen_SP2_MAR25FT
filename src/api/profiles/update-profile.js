import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Updates an authenticated Auction House profile.
 *
 * @param {string} name - Profile name.
 * @param {Object} profile
 * @param {string} [profile.bio]
 * @param {{url: string, alt?: string}|null} [profile.avatar]
 * @param {{url: string, alt?: string}|null} [profile.banner]
 * @returns {Promise<Object|null>}
 */
export async function updateProfile(name, profile) {
  return apiRequest({
    endpoint: `${API_ENDPOINTS.auction.profiles}/${encodeURIComponent(name)}`,
    method: "PUT",
    body: profile,
    auth: true,
  });
}
