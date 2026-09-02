import { createAuctionCard } from "../auction-card/auction-card.js";

const html = String.raw;

/**
 * Safely reads a media URL from a profile media object.
 *
 * @param {Record<string, unknown>|null|undefined} media
 * @returns {string}
 */
function getMediaUrl(media) {
  return typeof media?.url === "string" ? media.url : "";
}
/**
 * Initializes the profile activity tabs.
 *
 * @param {HTMLElement} profile
 * @returns {void}
 */
function initializeProfileTabs(profile) {
  const tabs = profile.querySelectorAll('[role="tab"]');
  const panels = profile.querySelectorAll('[role="tabpanel"]');

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelId = tab.getAttribute("aria-controls");

      tabs.forEach((currentTab) => {
        const isSelected = currentTab === tab;

        currentTab.setAttribute("aria-selected", String(isSelected));
        currentTab.classList.toggle("border-(--color-primary)", isSelected);
        currentTab.classList.toggle("text-(--color-primary)", isSelected);
        currentTab.classList.toggle("text-neutral-400", !isSelected);
      });

      panels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== panelId);
      });
    });
  });
}
/**
 * Returns unique listings associated with the user's bids.
 *
 * @param {Array} bids
 * @returns {Array}
 */
function getBidListings(bids) {
  const listings = bids
    .map((bid) => bid.listing)
    .filter((listing) => listing?.id);

  return Array.from(
    new Map(listings.map((listing) => [listing.id, listing])).values()
  );
}
/**
 * Creates the authenticated user's profile page.
 *
 * @param {Object} data
 * @param {Object} data.user
 * @param {Array} data.listings
 * @param {Array} data.bids
 * @returns {HTMLElement}
 */
export function createProfile({ user, listings = [], bids = [] }) {
  const profile = document.createElement("section");
  const bidListings = getBidListings(bids);

  const listingCount = listings.length;
  const bidCount = bids.length;

  const avatarUrl = getMediaUrl(user.avatar);
  const bannerUrl = getMediaUrl(user.banner);

  const credits =
    typeof user.credits === "number"
      ? user.credits.toLocaleString("en-US")
      : "Unavailable";

  profile.innerHTML = html`
    <section aria-labelledby="profile-heading">
      <div
        class="relative min-h-70 border-b border-neutral-900 bg-neutral-950 bg-cover bg-center"
        ${bannerUrl ? `style="background-image: url('${bannerUrl}')"` : ""}
      >
        <div
          class="absolute -bottom-12 left-6 h-24 w-24 overflow-hidden rounded-full border-4 border-(--color-primary) bg-neutral-900 sm:left-10 sm:h-32 sm:w-32"
        >
          ${
            avatarUrl
              ? html`
                  <img
                    src="${avatarUrl}"
                    alt=""
                    class="h-full w-full object-cover"
                  />
                `
              : ""
          }
        </div>
      </div>

      <div class="px-6 pt-18 pb-10 sm:px-10 sm:pt-20">
        <div
          class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
        >
          <div>
            <h1 id="profile-heading" class="text-3xl font-semibold sm:text-4xl">
              ${user.name}
            </h1>

            ${
              user.email
                ? html`
                    <p class="mt-2 text-base text-neutral-400 sm:text-lg">
                      ${user.email}
                    </p>
                  `
                : ""
            }
            ${
              user.bio
                ? html`
                    <p class="mt-5 max-w-2xl text-base text-neutral-300">
                      ${user.bio}
                    </p>
                  `
                : ""
            }

            <dl class="mt-8 flex flex-wrap gap-10">
              <div>
                <dt class="text-sm text-neutral-400 sm:text-base">Listings</dt>
                <dd class="order-first text-xl font-semibold">
                  ${listingCount}
                </dd>
              </div>

              <div>
                <dt class="text-sm text-neutral-400 sm:text-base">
                  Bids Placed
                </dt>
                <dd class="order-first text-xl font-semibold">${bidCount}</dd>
              </div>

              <div>
                <dt class="text-sm text-neutral-400 sm:text-base">Credits</dt>
                <dd class="order-first text-xl font-semibold">$${credits}</dd>
              </div>
            </dl>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              class="inline-flex min-h-12 items-center justify-center border border-neutral-700 px-6 uppercase tracking-wider"
              data-edit-profile
            >
              Edit Profile
            </button>

            <button
              type="button"
              class="inline-flex min-h-12 items-center justify-center bg-(--color-primary) px-6 uppercase tracking-wider text-black"
              data-create-listing
            >
              + Create Listing
            </button>
          </div>
        </div>
      </div>
    </section>

    <section
      class="border-t border-neutral-900"
      aria-labelledby="profile-activity-heading"
    >
      <h2 id="profile-activity-heading" class="sr-only">Profile activity</h2>

      <div
        class="flex gap-8 border-b border-neutral-800 px-6 sm:px-10"
        role="tablist"
        aria-label="Profile activity"
      >
        <button
          type="button"
          class="border-b-2 border-(--color-primary) px-2 py-5 uppercase tracking-wider text-(--color-primary)"
          role="tab"
          aria-selected="true"
          aria-controls="my-listings-panel"
          id="my-listings-tab"
        >
          My Listings (${listingCount})
        </button>

        <button
          type="button"
          class="px-2 py-5 uppercase tracking-wider text-neutral-400"
          role="tab"
          aria-selected="false"
          aria-controls="my-bids-panel"
          id="my-bids-tab"
        >
          My Bids (${bidListings.length})
        </button>
      </div>

      <div
        id="my-listings-panel"
        class="px-6 py-10 sm:px-10"
        role="tabpanel"
        aria-labelledby="my-listings-tab"
      >
        <div
          class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          data-profile-listings
        ></div>
      </div>
      <div
        id="my-bids-panel"
        class="hidden px-6 py-10 sm:px-10"
        role="tabpanel"
        aria-labelledby="my-bids-tab"
      >
        <div
          class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          data-profile-bids
        ></div>
      </div>
    </section>
  `;
  const listingsContainer = profile.querySelector("[data-profile-listings]");
  const bidsContainer = profile.querySelector("[data-profile-bids]");

  if (listings.length > 0) {
    listings.forEach((listing) => {
      listingsContainer.append(createAuctionCard(listing));
    });
  } else {
    const emptyState = document.createElement("p");
    emptyState.className = "text-neutral-400";
    emptyState.textContent = "You haven't created any listings yet.";
    listingsContainer.append(emptyState);
  }

  if (bidListings.length > 0) {
    bidListings.forEach((listing) => {
      bidsContainer.append(createAuctionCard(listing));
    });
  } else {
    const emptyState = document.createElement("p");
    emptyState.className = "text-neutral-400";
    emptyState.textContent = "You haven't placed any bids yet.";
    bidsContainer.append(emptyState);
  }

  initializeProfileTabs(profile);
  return profile;
}
