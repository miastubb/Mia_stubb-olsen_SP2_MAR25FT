import { createAuctionCard } from "../auction-card/auction-card.js";

/**
 * Creates a responsive collection of auction listing cards.
 *
 * This component only renders listing data. Fetching, filtering, and
 * authentication are handled elsewhere in the application.
 *
 * @param {Object[]} [listings=[]] - Listings matching the Noroff API model.
 * @returns {HTMLElement} The auction results section.
 * @throws {TypeError} When listings is not an array.
 */
export function createAuctionResults(listings = []) {
  if (!Array.isArray(listings)) {
    throw new TypeError("createAuctionResults requires an array of listings.");
  }

  const resultsSection = document.createElement("section");

  resultsSection.className = "mx-4 mt-8 mb-16 sm:mx-6 lg:mx-10";
  resultsSection.setAttribute("aria-label", "Auction listings");

  if (listings.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className =
      "border border-white/10 px-6 py-12 text-center font-mono text-neutral-400";
    emptyMessage.textContent = "No auction listings found.";

    resultsSection.append(emptyMessage);

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
