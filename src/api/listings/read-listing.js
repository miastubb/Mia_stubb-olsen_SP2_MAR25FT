import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Fetches one auction listing by ID.
 *
 * Includes seller and bid data required by the single listing page.
 *
 * @param {string} id - Auction listing ID.
 * @returns {Promise<Object>}
 * @throws {TypeError} When no valid listing ID is provided.
 */
export async function readListing(id) {
  if (typeof id !== "string" || !id.trim()) {
    throw new TypeError("A valid listing ID is required.");
  }

  const safeId = encodeURIComponent(id.trim());

  const searchParams = new globalThis.URLSearchParams({
    _seller: "true",
    _bids: "true",
  });

  const endpoint = `${API_ENDPOINTS.auction.listings}/${safeId}?${searchParams}`;

  const responseData = await apiRequest({
    endpoint,
  });

  const listing = responseData?.data;

  if (!listing || typeof listing !== "object") {
    throw new Error("The API returned an unexpected response.");
  }

  return listing;
}
