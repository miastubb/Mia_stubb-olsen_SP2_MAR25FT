import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Fetches active auction listings.
 * @returns {Promise<Array>}
 */
export async function fetchAuctionListings() {
  const searchParams = new globalThis.URLSearchParams({
    _active: "true",
    _bids: "true",
    limit: "12",
    sort: "created",
    sortOrder: "desc",
  });

  const endpoint = `${API_ENDPOINTS.auction.listings}?${searchParams}`;

  const responseData = await apiRequest({
    endpoint,
  });

  const listings = responseData?.data;

  if (!Array.isArray(listings)) {
    throw new Error("The API returned an unexpected response.");
  }

  return listings;
}
