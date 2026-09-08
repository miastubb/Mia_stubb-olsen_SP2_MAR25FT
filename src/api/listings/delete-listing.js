import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Deletes an auction listing owned by the authenticated user.
 *
 * @param {string} listingId - Auction listing ID.
 * @returns {Promise<Object|null>}
 */
export async function deleteListing(listingId) {
  if (typeof listingId !== "string" || !listingId.trim()) {
    throw new TypeError("A valid listing ID is required.");
  }

  const safeId = encodeURIComponent(listingId.trim());

  return apiRequest({
    endpoint: `${API_ENDPOINTS.auction.listings}/${safeId}`,
    method: "DELETE",
    auth: true,
  });
}
