const ENDING_SOON_WINDOW = 24 * 60 * 60 * 1000;
const NEW_ARRIVAL_WINDOW = 7 * 24 * 60 * 60 * 1000;
const HOT_BID_THRESHOLD = 3;

const VALID_FILTERS = new Set(["all", "ending", "hot", "new"]);

/**
 * Checks whether a listing matches a search term.
 *
 * Searches the listing title, description, and tags without case sensitivity.
 *
 * @param {Object} listing - Listing matching the Noroff API model.
 * @param {string} searchTerm - Search value entered by the user.
 * @returns {boolean} Whether the listing matches the search.
 */
function matchesSearch(listing, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  const searchableContent = [
    listing.title,
    listing.description,
    ...(Array.isArray(listing.tags) ? listing.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableContent.includes(normalizedSearch);
}

/**
 * Returns the number of bids placed on a listing.
 *
 * @param {Object} listing - Listing matching the Noroff API model.
 * @returns {number} The listing's bid count.
 */
function getBidCount(listing) {
  return listing._count?.bids ?? listing.bids?.length ?? 0;
}

/**
 * Checks whether a listing matches the selected filter.
 *
 * Ending Soon means ending within 24 hours.
 * Hot means having at least three bids.
 * New means created within the last seven days.
 *
 * @param {Object} listing - Listing matching the Noroff API model.
 * @param {string} activeFilter - Selected auction filter.
 * @param {number} now - Current timestamp.
 * @returns {boolean} Whether the listing matches the selected filter.
 */
function matchesFilter(listing, activeFilter, now) {
  if (activeFilter === "all") {
    return true;
  }

  if (activeFilter === "ending") {
    const remainingTime = new Date(listing.endsAt).getTime() - now;

    return remainingTime > 0 && remainingTime <= ENDING_SOON_WINDOW;
  }

  if (activeFilter === "hot") {
    return getBidCount(listing) >= HOT_BID_THRESHOLD;
  }

  if (activeFilter === "new") {
    const listingAge = now - new Date(listing.created).getTime();

    return listingAge >= 0 && listingAge <= NEW_ARRIVAL_WINDOW;
  }

  return false;
}

/**
 * Filters auction listings using the current search term and active tab.
 *
 * @param {Object[]} listings - Listings matching the Noroff API model.
 * @param {Object} [criteria={}] - Current search and filtering criteria.
 * @param {string} [criteria.searchTerm=""] - Search term entered by the user.
 * @param {string} [criteria.activeFilter="all"] - Selected filter tab.
 * @param {number} [criteria.now=Date.now()] - Timestamp used by date filters.
 * @returns {Object[]} Listings matching both criteria.
 * @throws {TypeError} When listings is not an array.
 * @throws {RangeError} When activeFilter is not supported.
 */
export function filterAuctionListings(
  listings,
  { searchTerm = "", activeFilter = "all", now = Date.now() } = {}
) {
  if (!Array.isArray(listings)) {
    throw new TypeError("filterAuctionListings requires an array of listings.");
  }

  if (!VALID_FILTERS.has(activeFilter)) {
    throw new RangeError(`Unsupported auction filter: ${activeFilter}`);
  }

  return listings.filter((listing) => {
    return (
      matchesSearch(listing, searchTerm) &&
      matchesFilter(listing, activeFilter, now)
    );
  });
}

/**
 * Calculates the number of search-matching listings in every filter.
 *
 * @param {Object[]} listings - Listings matching the Noroff API model.
 * @param {string} [searchTerm=""] - Current search term.
 * @param {number} [now=Date.now()] - Timestamp used by date filters.
 * @returns {{all: number, ending: number, hot: number, new: number}}
 * Counts for every filter tab.
 */
export function getAuctionFilterCounts(
  listings,
  searchTerm = "",
  now = Date.now()
) {
  const searchMatches = filterAuctionListings(listings, {
    searchTerm,
    activeFilter: "all",
    now,
  });

  return {
    all: searchMatches.length,
    ending: searchMatches.filter((listing) =>
      matchesFilter(listing, "ending", now)
    ).length,
    hot: searchMatches.filter((listing) => matchesFilter(listing, "hot", now))
      .length,
    new: searchMatches.filter((listing) => matchesFilter(listing, "new", now))
      .length,
  };
}
