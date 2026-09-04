import {
  formatTimeRemaining,
  getAuctionStatus,
  getCurrentBid,
} from "../../utils/auction.js";
import { routes } from "../../utils/routes.js";

/**
 * @typedef {Object} AuctionMedia
 * @property {string} url - Public URL for the media item.
 * @property {string} alt - Alternative text describing the media.
 */

/**
 * @typedef {Object} AuctionBid
 * @property {string} id - Unique bid identifier.
 * @property {number} amount - Number of credits placed in the bid.
 */

/**
 * @typedef {Object} AuctionListing
 * @property {string} id - Unique listing identifier.
 * @property {string} title - Listing title.
 * @property {string} [description] - Description of the listing.
 * @property {string[]} [tags] - Listing categories or descriptive tags.
 * @property {AuctionMedia[]} [media] - Images associated with the listing.
 * @property {string} [created] - ISO date when the listing was created.
 * @property {string} endsAt - ISO date when the auction ends.
 * @property {AuctionBid[]} [bids] - Bids included using the `_bids=true` query.
 * @property {{ bids?: number }} [_count] - Aggregate listing counts.
 */
/**
 * Creates a summary card for an auction listing.
 *
 * @param {AuctionListing} listing - Listing data matching the Noroff API model.
 * @returns {HTMLElement} The completed auction card element.
 * @throws {TypeError} When no valid listing object is provided.
 */

export function createAuctionCard(listing) {
  const card = document.createElement("article");

  const media = Array.isArray(listing.media) ? listing.media : [];
  const bids = Array.isArray(listing.bids) ? listing.bids : [];
  const bidCount = listing._count?.bids ?? bids.length;
  const currentBid = getCurrentBid(bids);
  const extraPhotoCount = Math.max(media.length - 1, 0);
  const status = getAuctionStatus(listing.endsAt);

  card.className = "overflow-hidden bg-white text-black";
  card.dataset.listingId = listing.id;

  card.innerHTML = `
    <div class="relative aspect-4/3 overflow-hidden bg-neutral-800">
      <div data-card-image></div>

      <span
        data-card-status
        class="absolute top-4 left-4 hidden bg-red-800 px-3 py-2 font-mono font-medium text-white"
      ></span>

      <span
        data-card-photos
        class="absolute right-4 bottom-3 hidden font-mono text-white"
      ></span>
    </div>

    <div class="p-6">
      <p
        data-card-category
        class="font-mono uppercase tracking-wider text-orange-800"
      ></p>

      <h2 data-card-title class="mt-4 min-h-14 text-xl font-medium text-black!"></h2>

      <div class="mt-4 border-t border-neutral-200 pt-4">
        <div class="flex justify-between gap-4">
          <div>
            <p class="font-mono text-neutral-500">Current Bid</p>
            <p data-card-bid class="mt-2 font-mono text-lg font-semibold"></p>
          </div>

          <div class="text-right">
            <p class="font-mono text-neutral-500">Bids</p>
            <p
              data-card-bid-count
              class="mt-2 font-mono text-lg font-semibold"
            ></p>
          </div>
        </div>

        <div class="mt-6 flex items-center gap-2 font-mono text-orange-800">
          <span aria-hidden="true">◷</span>
          <time data-card-time></time>
        </div>
      </div>
    </div>
  `;

  const imageContainer = card.querySelector("[data-card-image]");

  if (media[0]?.url) {
    const image = document.createElement("img");
    image.src = media[0].url;
    image.alt = media[0].alt || listing.title || "Auction listing";
    image.className = "h-full w-full object-cover";
    imageContainer.append(image);
  } else {
    imageContainer.className =
      "flex h-full items-center justify-center font-mono text-neutral-400";
    imageContainer.textContent = "No image available";
  }

  card.querySelector("[data-card-category]").textContent =
    listing.tags?.[0] || "Uncategorized";

  card.querySelector("[data-card-title]").textContent =
    listing.title || "Untitled listing";

  card.querySelector("[data-card-bid]").textContent =
    bids.length > 0
      ? `${currentBid.toLocaleString("en-US")} credits`
      : "No bids";

  card.querySelector("[data-card-bid-count]").textContent = bidCount;

  const timeElement = card.querySelector("[data-card-time]");
  timeElement.dateTime = listing.endsAt;
  timeElement.textContent = formatTimeRemaining(listing.endsAt);

  if (status) {
    const statusElement = card.querySelector("[data-card-status]");
    statusElement.textContent = status;
    statusElement.classList.remove("hidden");
  }

  if (extraPhotoCount > 0) {
    const photoElement = card.querySelector("[data-card-photos]");
    photoElement.textContent = `+${extraPhotoCount} photos`;
    photoElement.classList.remove("hidden");
  }

  card.tabIndex = 0;
  card.setAttribute("role", "link");

  const openListing = () => {
    const listingUrl = new URL(routes.listing, globalThis.location.origin);
    listingUrl.searchParams.set("id", listing.id);

    globalThis.location.assign(listingUrl.toString());
  };

  card.addEventListener("click", openListing);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      openListing();
    }
  });

  return card;
}
