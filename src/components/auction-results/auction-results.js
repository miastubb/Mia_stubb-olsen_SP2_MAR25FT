import { createAuctionCard } from "../auction-card/auction-card.js";

/**
 * @typedef {Object} AuctionResultsOptions
 * @property {boolean} [hasActiveSearchOrFilter=false] - Whether the results
 * have been reduced by an active search or filter.
 * @property {() => void} [onClearFilters] - Runs when Clear Filters is selected.
 */

/**
 * Creates the filtered-results empty state.
 *
 * @param {() => void} onClearFilters - Clears the active search and filters.
 * @returns {HTMLElement} The completed empty-state element.
 */
function createFilteredEmptyState(onClearFilters) {
  const emptyState = document.createElement("div");

  emptyState.className =
    "flex flex-col items-center gap-6 border border-white/10 px-6 py-16 text-center";

  const message = document.createElement("p");
  message.className = "font-mono text-lg text-neutral-300";
  message.textContent = "No lots match your search";

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className =
    "cursor-pointer border border-amber-500 px-5 py-3 font-mono uppercase tracking-wider text-amber-500 transition-colors hover:bg-amber-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500";
  clearButton.textContent = "Clear Filters";

  clearButton.addEventListener("click", onClearFilters);

  emptyState.append(message, clearButton);

  return emptyState;
}

/**
 * Creates a responsive collection of auction listing cards.
 *
 * This component only renders listing data. Fetching, filtering, and
 * authentication are handled elsewhere in the application.
 *
 * @param {Object[]} [listings=[]] - Listings matching the Noroff API model.
 * @param {AuctionResultsOptions} [options={}] - Empty-state configuration.
 * @returns {HTMLElement} The auction results section.
 * @throws {TypeError} When listings is not an array or the callback is invalid.
 */
export function createAuctionResults(listings = [], options = {}) {
  if (!Array.isArray(listings)) {
    throw new TypeError("createAuctionResults requires an array of listings.");
  }

  const { hasActiveSearchOrFilter = false, onClearFilters = () => {} } =
    options;

  if (typeof onClearFilters !== "function") {
    throw new TypeError("onClearFilters must be a valid callback function.");
  }

  const resultsSection = document.createElement("section");

  resultsSection.className = "mx-4 mt-8 mb-16 sm:mx-6 lg:mx-10";
  resultsSection.setAttribute("aria-label", "Auction listings");
  resultsSection.setAttribute("aria-live", "polite");

  if (listings.length === 0) {
    if (hasActiveSearchOrFilter) {
      resultsSection.append(createFilteredEmptyState(onClearFilters));
    } else {
      const emptyMessage = document.createElement("p");

      emptyMessage.className =
        "border border-white/10 px-6 py-12 text-center font-mono text-neutral-400";
      emptyMessage.textContent = "No auction listings found.";

      resultsSection.append(emptyMessage);
    }

    return resultsSection;
  }

  const resultsGrid = document.createElement("div");
  const cardFragment = document.createDocumentFragment();

  resultsGrid.className =
    "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  listings.forEach((listing) => {
    cardFragment.append(createAuctionCard(listing));
  });

  resultsGrid.append(cardFragment);
  resultsSection.append(resultsGrid);

  return resultsSection;
}
