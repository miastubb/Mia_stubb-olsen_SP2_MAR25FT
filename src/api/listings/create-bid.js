import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Places a bid on an auction listing.
 *
 * @param {string} listingId - Auction listing ID.
 * @param {number} amount - Bid amount in credits.
 * @returns {Promise<Object>}
 */
export async function createBid(listingId, amount) {
  if (typeof listingId !== "string" || !listingId.trim()) {
    throw new TypeError("A valid listing ID is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new TypeError("A valid bid amount is required.");
  }

  const safeId = encodeURIComponent(listingId.trim());
  const endpoint = `${API_ENDPOINTS.auction.listings}/${safeId}/bids`;

  const responseData = await apiRequest({
    endpoint,
    method: "POST",
    body: {
      amount,
    },
    auth: true,
  });

  const bid = responseData?.data;

  if (!bid || typeof bid !== "object") {
    throw new Error("The API returned an unexpected response.");
  }

  return bid;
}
