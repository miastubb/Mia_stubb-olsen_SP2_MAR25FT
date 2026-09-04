import { getAuctionStatus, getCurrentBid } from "../../utils/auction.js";

/**
 * @typedef {Object} ListingMedia
 * @property {string} url - Public URL for the media item.
 * @property {string} [alt] - Alternative text describing the media.
 */

/**
 * @typedef {Object} ListingBid
 * @property {string} id - Unique bid identifier.
 * @property {number} amount - Bid amount in credits.
 * @property {string} [created] - ISO date when the bid was placed.
 * @property {{ name?: string }} [bidder] - Profile that placed the bid.
 */

/**
 * @typedef {Object} ListingDetails
 * @property {string} id - Unique listing identifier.
 * @property {string} title - Listing title.
 * @property {string} [description] - Listing description.
 * @property {string[]} [tags] - Listing tags.
 * @property {ListingMedia[]} [media] - Listing media.
 * @property {string} [created] - ISO date when the listing was created.
 * @property {string} endsAt - ISO date when the auction ends.
 * @property {ListingBid[]} [bids] - Listing bid history.
 * @property {{ name?: string }} [seller] - Listing seller.
 * @property {{ bids?: number }} [_count] - Aggregate listing counts.
 */

/**
 * Formats an ISO date for display.
 *
 * @param {string|undefined} value - ISO date value.
 * @returns {string} Human-readable date or fallback text.
 */
function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Creates the detailed view for one auction listing.
 *
 * @param {ListingDetails} listing - Auction listing to render.
 * @param {boolean} [isAuthenticated=false] - Whether bidding controls may display.
 * @returns {HTMLElement} Completed listing details element.
 */
export function createListingDetails(listing, isAuthenticated = false) {
  const section = document.createElement("section");

  const media = Array.isArray(listing.media) ? listing.media : [];
  const tags = Array.isArray(listing.tags) ? listing.tags : [];
  const bids = Array.isArray(listing.bids) ? listing.bids : [];

  const currentBid = getCurrentBid(bids);
  const bidCount = listing._count?.bids ?? bids.length;
  const status = getAuctionStatus(listing.endsAt);
  const isExpired = status === "ENDED";

  section.className = "px-6 py-10 sm:px-10 lg:py-16";

  section.innerHTML = `
    <div class="mx-auto max-w-7xl">
      <div data-listing-media></div>

      <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <div data-listing-tags class="flex flex-wrap gap-2"></div>

          <h1
            data-listing-title
            class="mt-4 text-3xl font-semibold sm:text-4xl"
          ></h1>

          <p
            data-listing-description
            class="mt-6 max-w-3xl leading-7 text-neutral-300"
          ></p>

          <dl
            class="mt-8 grid gap-6 border-y border-white/10 py-6 sm:grid-cols-2"
          >
            <div>
              <dt class="font-mono text-sm uppercase text-neutral-500">
                Seller
              </dt>
              <dd data-listing-seller class="mt-2"></dd>
            </div>

            <div>
              <dt class="font-mono text-sm uppercase text-neutral-500">
                Created
              </dt>
              <dd data-listing-created class="mt-2"></dd>
            </div>

            <div>
              <dt class="font-mono text-sm uppercase text-neutral-500">
                Auction deadline
              </dt>
              <dd class="mt-2">
                <time data-listing-deadline></time>
              </dd>
            </div>

            <div>
              <dt class="font-mono text-sm uppercase text-neutral-500">
                Status
              </dt>
              <dd data-listing-status class="mt-2"></dd>
            </div>
          </dl>

          <div class="mt-10">
            <h2 class="text-2xl font-semibold">Bid history</h2>
            <div data-listing-bids class="mt-5"></div>
          </div>
        </div>

        <aside class="h-fit border border-white/10 p-6">
          <p class="font-mono text-sm uppercase text-neutral-500">
            Current bid
          </p>

          <p
            data-listing-current-bid
            class="mt-2 text-3xl font-semibold"
          ></p>

          <p data-listing-bid-count class="mt-2 text-neutral-400"></p>

          <div data-listing-bid-controls class="mt-6"></div>
        </aside>
      </div>
    </div>
  `;

  renderMedia(section, listing, media);
  renderTags(section, tags);
  renderListingContent(section, listing, status);
  renderBidHistory(section, bids);
  renderBidSummary(section, bids, currentBid, bidCount);
  renderBidControls(section, isAuthenticated, isExpired);

  return section;
}

/**
 * Renders the listing's primary media or a fallback state.
 *
 * @param {HTMLElement} section - Listing details root element.
 * @param {ListingDetails} listing - Current auction listing.
 * @param {ListingMedia[]} media - Normalized listing media.
 * @returns {void}
 */
function renderMedia(section, listing, media) {
  const container = section.querySelector("[data-listing-media]");

  if (!container) {
    return;
  }

  if (!media[0]?.url) {
    container.className =
      "flex aspect-16/9 items-center justify-center overflow-hidden bg-neutral-800 font-mono text-neutral-400 sm:aspect-2/1";
    container.textContent = "No image available";
    return;
  }

  container.className = "";

  const primaryContainer = document.createElement("div");
  const primaryImage = document.createElement("img");

  primaryContainer.className =
    "aspect-16/9 overflow-hidden bg-neutral-800 sm:aspect-2/1";

  primaryImage.src = media[0].url;
  primaryImage.alt = media[0].alt || listing.title || "Auction listing";
  primaryImage.className = "h-full w-full object-cover";

  primaryContainer.append(primaryImage);
  container.append(primaryContainer);

  if (media.length <= 1) {
    return;
  }

  const gallery = document.createElement("div");

  gallery.className =
    "mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5";

  media.forEach((item, index) => {
    if (!item?.url) {
      return;
    }

    const button = document.createElement("button");
    const thumbnail = document.createElement("img");

    button.type = "button";
    button.className =
      "aspect-square overflow-hidden border border-white/10 bg-neutral-800";
    button.setAttribute(
      "aria-label",
      `View image ${index + 1} of ${media.length}`
    );

    thumbnail.src = item.url;
    thumbnail.alt = "";
    thumbnail.className =
      "h-full w-full object-cover transition-opacity hover:opacity-80";

    button.append(thumbnail);

    button.addEventListener("click", () => {
      primaryImage.src = item.url;
      primaryImage.alt =
        item.alt || listing.title || `Auction listing image ${index + 1}`;
    });

    gallery.append(button);
  });

  container.append(gallery);
}

/**
 * Renders listing tags.
 *
 * @param {HTMLElement} section - Listing details root element.
 * @param {string[]} tags - Listing tags.
 * @returns {void}
 */
function renderTags(section, tags) {
  const container = section.querySelector("[data-listing-tags]");

  if (!container) {
    return;
  }

  if (tags.length === 0) {
    const fallback = document.createElement("span");

    fallback.className = "font-mono uppercase text-orange-500";
    fallback.textContent = "Uncategorized";

    container.append(fallback);
    return;
  }

  tags.forEach((tag) => {
    const element = document.createElement("span");

    element.className =
      "border border-orange-500/40 px-3 py-1 font-mono text-sm uppercase text-orange-500";
    element.textContent = tag;

    container.append(element);
  });
}

/**
 * Renders the listing's descriptive and auction metadata.
 *
 * @param {HTMLElement} section - Listing details root element.
 * @param {ListingDetails} listing - Current auction listing.
 * @param {"ENDED" | "ENDING" | ""} status - Current auction status.
 * @returns {void}
 */
function renderListingContent(section, listing, status) {
  const title = section.querySelector("[data-listing-title]");
  const description = section.querySelector("[data-listing-description]");
  const seller = section.querySelector("[data-listing-seller]");
  const created = section.querySelector("[data-listing-created]");
  const deadline = section.querySelector("[data-listing-deadline]");
  const statusElement = section.querySelector("[data-listing-status]");

  if (title) {
    title.textContent = listing.title || "Untitled listing";
  }

  if (description) {
    description.textContent =
      listing.description?.trim() || "No description provided.";
  }

  if (seller) {
    seller.textContent = listing.seller?.name || "Unknown seller";
  }

  if (created) {
    created.textContent = formatDate(listing.created);
  }

  if (deadline) {
    deadline.textContent = formatDate(listing.endsAt);

    if (listing.endsAt) {
      deadline.dateTime = listing.endsAt;
    }
  }

  if (statusElement) {
    statusElement.textContent = status || "ACTIVE";
  }
}

/**
 * Renders the listing's bid history.
 *
 * @param {HTMLElement} section - Listing details root element.
 * @param {ListingBid[]} bids - Normalized listing bids.
 * @returns {void}
 */
function renderBidHistory(section, bids) {
  const container = section.querySelector("[data-listing-bids]");

  if (!container) {
    return;
  }

  if (bids.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "text-neutral-400";
    emptyMessage.textContent = "No bids have been placed yet.";

    container.append(emptyMessage);
    return;
  }

  const list = document.createElement("ul");

  list.className = "divide-y divide-white/10";

  const sortedBids = [...bids].sort(
    (a, b) => Number(b.amount) - Number(a.amount)
  );

  sortedBids.forEach((bid) => {
    const item = document.createElement("li");
    const bidder = document.createElement("span");
    const amount = document.createElement("span");
    const date = document.createElement("time");

    item.className =
      "grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center";

    bidder.className = "font-medium";
    bidder.textContent = bid.bidder?.name || "Anonymous bidder";

    amount.className = "font-mono font-semibold";
    amount.textContent = `${Number(bid.amount || 0).toLocaleString(
      "en-US"
    )} credits`;

    date.className = "text-sm text-neutral-500 sm:col-start-1 sm:row-start-2";
    date.textContent = formatDate(bid.created);

    if (bid.created) {
      date.dateTime = bid.created;
    }

    item.append(bidder, amount, date);
    list.append(item);
  });

  container.append(list);
}
/**
 * Renders the current bid amount and total bid count.
 *
 * @param {HTMLElement} section - Listing details root element.
 * @param {ListingBid[]} bids - Normalized listing bids.
 * @param {number} currentBid - Highest current bid amount.
 * @param {number} bidCount - Total number of bids.
 * @returns {void}
 */
function renderBidSummary(section, bids, currentBid, bidCount) {
  const currentBidElement = section.querySelector("[data-listing-current-bid]");
  const bidCountElement = section.querySelector("[data-listing-bid-count]");

  if (currentBidElement) {
    currentBidElement.textContent =
      bids.length > 0
        ? `${currentBid.toLocaleString("en-US")} credits`
        : "No bids";
  }

  if (bidCountElement) {
    bidCountElement.textContent = `${bidCount} ${
      bidCount === 1 ? "bid" : "bids"
    }`;
  }
}
/**
 * Renders bidding controls based on authentication and auction status.
 *
 * This ticket only renders the bidding interface. It does not submit bids.
 *
 * @param {HTMLElement} section - Listing details root element.
 * @param {boolean} isAuthenticated - Whether the viewer is authenticated.
 * @param {boolean} isExpired - Whether the auction has ended.
 * @returns {void}
 */
function renderBidControls(section, isAuthenticated, isExpired) {
  const container = section.querySelector("[data-listing-bid-controls]");

  if (!container) {
    return;
  }

  if (isExpired) {
    const message = document.createElement("p");

    message.className = "font-mono text-neutral-400";
    message.textContent = "This auction has ended.";

    container.append(message);
    return;
  }

  if (!isAuthenticated) {
    const message = document.createElement("p");

    message.className = "font-mono text-neutral-400";
    message.textContent = "Log in to place a bid.";

    container.append(message);
    return;
  }

  const label = document.createElement("label");
  const input = document.createElement("input");
  const button = document.createElement("button");

  label.htmlFor = "bid-amount";
  label.className = "block font-mono text-sm uppercase text-neutral-400";
  label.textContent = "Your bid";

  input.id = "bid-amount";
  input.name = "amount";
  input.type = "number";
  input.min = "1";
  input.inputMode = "numeric";
  input.className =
    "mt-2 w-full border border-white/20 bg-transparent px-4 py-3 text-white";

  button.type = "button";
  button.disabled = true;
  button.className =
    "mt-4 w-full cursor-not-allowed bg-orange-500 px-4 py-3 font-mono font-semibold uppercase text-black opacity-60";
  button.textContent = "Place bid";

  container.append(label, input, button);
}
