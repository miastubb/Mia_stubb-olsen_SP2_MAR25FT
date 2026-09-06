import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Creates a new auction listing for the authenticated user.
 *
 * @param {Object} listing
 * @param {string} listing.title
 * @param {string} [listing.description]
 * @param {string[]} [listing.tags]
 * @param {Array<{url: string, alt?: string}>} [listing.media]
 * @param {string} listing.endsAt
 * @returns {Promise<Object|null>}
 */
export async function createListing(listing) {
  return apiRequest({
    endpoint: API_ENDPOINTS.auction.listings,
    method: "POST",
    body: listing,
    auth: true,
  });
}
