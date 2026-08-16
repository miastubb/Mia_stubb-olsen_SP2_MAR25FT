const LISTINGS_URL = "https://v2.api.noroff.dev/auction/listings";

/**
 * Fetches active auction listings.
 * @returns {Promise<Array>} Auction listings
 */
export async function fetchAuctionListings() {
  const url = new URL(LISTINGS_URL);

  url.searchParams.set("_active", "true");
  url.searchParams.set("_bids", "true");
  url.searchParams.set("limit", "12");
  url.searchParams.set("sort", "created");
  url.searchParams.set("sortOrder", "desc");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not fetch listings: ${response.status}`);
  }

  const responseData = await response.json();

  if (!Array.isArray(responseData.data)) {
    throw new Error("The API returned an unexpected response.");
  }

  return responseData.data;
}
