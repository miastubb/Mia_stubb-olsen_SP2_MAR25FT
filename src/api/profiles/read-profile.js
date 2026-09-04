import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Retrieves one Auction House profile.
 *
 * @param {string} name
 * @param {{ token?: string, apiKey?: string }} [credentials]
 * @returns {Promise<object>}
 */
export async function readProfile(name, credentials = {}) {
  return apiRequest({
    endpoint: `${API_ENDPOINTS.auction.profiles}/${encodeURIComponent(name)}`,
    auth: true,
    token: credentials.token,
    apiKey: credentials.apiKey,
  });
}

/**
 * Retrieves listings created by one Auction House profile.
 *
 * @param {string} name
 * @returns {Promise<object>}
 */
export async function readProfileListings(name) {
  return apiRequest({
    endpoint: `${API_ENDPOINTS.auction.profiles}/${encodeURIComponent(name)}/listings?_bids=true`,
    auth: true,
  });
}

/**
 * Retrieves bids placed by one Auction House profile.
 *
 * Includes each bid's associated listing for profile activity rendering.
 *
 * @param {string} name
 * @returns {Promise<object>}
 */
export async function readProfileBids(name) {
  return apiRequest({
    endpoint: `${API_ENDPOINTS.auction.profiles}/${encodeURIComponent(name)}/bids?_listings=true`,
    auth: true,
  });
}
