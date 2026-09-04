import "../../tailwind.css";
import "../../global.css";
import "../../variables.css";
import { createListingDetails } from "../../components/listing-details/listing-details.js";
import { getSession } from "../../utils/session-storage.js";

import { readListing } from "../../api/listings/read-listing.js";
import { renderHeader } from "../../components/header/header.js";

renderHeader();

const app = document.querySelector("#app");

/**
 * Reads and validates the listing ID from the current URL.
 *
 * @returns {string|null}
 */
function getListingId() {
  const searchParams = new globalThis.URLSearchParams(
    globalThis.location.search
  );

  const id = searchParams.get("id")?.trim();

  return id || null;
}

/**
 * Loads one listing and renders its detailed auction view.
 *
 * @param {HTMLElement|null} container - Page container for the listing.
 * @returns {Promise<void>}
 */
async function loadListing(container) {
  if (!container) {
    return;
  }

  const listingId = getListingId();

  if (!listingId) {
    container.innerHTML = `
      <section class="px-6 py-16 sm:px-10" role="alert">
        <h1 class="text-3xl font-semibold">Listing not found</h1>
        <p class="mt-3 text-neutral-400">
          No valid auction listing was specified.
        </p>
      </section>
    `;

    return;
  }

  container.innerHTML = `
    <section class="px-6 py-16 sm:px-10" aria-live="polite">
      <p class="text-neutral-400">Loading listing...</p>
    </section>
  `;

  try {
    const listing = await readListing(listingId);
    const session = getSession();

    container.replaceChildren(createListingDetails(listing, Boolean(session)));
  } catch {
    container.innerHTML = `
      <section class="px-6 py-16 sm:px-10" role="alert">
        <h1 class="text-3xl font-semibold">Unable to load listing</h1>
        <p class="mt-3 text-neutral-400">
          This auction listing could not be loaded. Please try again.
        </p>
      </section>
    `;
  }
}

loadListing(app);
