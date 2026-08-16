import "./tailwind.css";
import "./global.css";
import "./variables.css";

import { Hero } from "./components/hero/hero.js";
import { renderHeader } from "./components/header/header.js";
import { createSearchBar } from "./components/search-bar/search-bar.js";
import {
  createAuctionFilter,
  resetAuctionFilter,
  updateAuctionFilterCounts,
} from "./components/auction-filter/auction-filter.js";
import { createAuctionResults } from "./components/auction-results/auction-results.js";
import {
  filterAuctionListings,
  getAuctionFilterCounts,
} from "./utils/filter-listings.js";
import { fetchAuctionListings } from "./api/listings/read-listings.js";

renderHeader();

const app = document.querySelector("#app");

const landingState = {
  listings: [],
  searchTerm: "",
  activeFilter: "all",
};

let resultsSection;
let isResettingControls = false;

/**
 * Replaces the results area with a status message.
 *
 * @param {string} message - Message shown to the user.
 * @param {"status" | "alert"} role - Accessibility role.
 * @returns {void}
 */
function renderResultsMessage(message, role = "status") {
  const messageElement = document.createElement("p");

  messageElement.className = "my-12 text-center text-base text-[#EBEBEB]";
  messageElement.textContent = message;
  messageElement.setAttribute("role", role);

  if (resultsSection) {
    resultsSection.replaceWith(messageElement);
  } else {
    app.append(messageElement);
  }

  resultsSection = messageElement;
}

/**
 * Fetches and renders auction listings.
 *
 * @returns {Promise<void>}
 */
async function loadAuctionListings() {
  renderResultsMessage("Loading auction listings...");

  try {
    landingState.listings = await fetchAuctionListings();
    renderAuctionListings();
  } catch (error) {
    console.error(error);

    renderResultsMessage(
      "We could not load the auction listings. Please try again later.",
      "alert"
    );
  }
}

/**
 * Renders listings using the current search and filter state.
 *
 * @returns {void}
 */
function renderAuctionListings() {
  const filteredListings = filterAuctionListings(landingState.listings, {
    searchTerm: landingState.searchTerm,
    activeFilter: landingState.activeFilter,
  });

  const hasActiveSearchOrFilter =
    Boolean(landingState.searchTerm) || landingState.activeFilter !== "all";

  const updatedResultsSection = createAuctionResults(filteredListings, {
    hasActiveSearchOrFilter,
    onClearFilters: clearSearchAndFilters,
  });

  if (resultsSection) {
    resultsSection.replaceWith(updatedResultsSection);
  } else {
    app.append(updatedResultsSection);
  }

  resultsSection = updatedResultsSection;

  const filterCounts = getAuctionFilterCounts(
    landingState.listings,
    landingState.searchTerm
  );

  updateAuctionFilterCounts(auctionFilter, filterCounts);
}

/**
 * Updates the current listing search.
 *
 * @param {string} searchTerm - Submitted search term.
 * @returns {void}
 */
function handleSearch(searchTerm) {
  landingState.searchTerm = searchTerm;

  if (!isResettingControls) {
    renderAuctionListings();
  }
}

/**
 * Updates the active listing filter.
 *
 * @param {string} activeFilter - Selected filter name.
 * @returns {void}
 */
function handleFilterChange(activeFilter) {
  landingState.activeFilter = activeFilter;

  if (!isResettingControls) {
    renderAuctionListings();
  }
}

/**
 * Clears the search input, active filter, and filtered results.
 *
 * @returns {void}
 */
function clearSearchAndFilters() {
  isResettingControls = true;

  searchBar.reset();
  resetAuctionFilter(auctionFilter);

  isResettingControls = false;

  renderAuctionListings();
}

const searchBar = createSearchBar(handleSearch);
const auctionFilter = createAuctionFilter(handleFilterChange);

app.append(Hero());
app.append(searchBar);
app.append(auctionFilter);

loadAuctionListings();
