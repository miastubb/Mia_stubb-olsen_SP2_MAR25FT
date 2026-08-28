import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Retrieves an auction profile by username.
 *
 * @param {string} name
 */
export async function readProfile(name) {
  return apiRequest({
    endpoint: `${API_ENDPOINTS.auction.profiles}/${encodeURIComponent(name)}`,
    auth: true,
  });
}
