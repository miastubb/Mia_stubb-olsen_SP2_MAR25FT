import "../../tailwind.css";
import "../../global.css";
import "../../variables.css";

import { renderHeader } from "../../components/header/header.js";
import { createProfile } from "../../components/profile/profile.js";
import { requireAuth } from "../../utils/auth-guard.js";
import {
  readProfile,
  readProfileListings,
  readProfileBids,
} from "../../api/profiles/read-profile.js";

const session = requireAuth();

if (session) {
  renderHeader();

  const app = document.querySelector("#app");

  loadProfile(app, session.profile.name);
}

/**
 * Loads and renders the authenticated user's current profile and activity.
 *
 * @param {HTMLElement|null} app
 * @param {string} name
 * @returns {Promise<void>}
 */
async function loadProfile(app, name) {
  if (!app) {
    return;
  }

  app.innerHTML = `
    <section class="px-6 py-16 sm:px-10" aria-live="polite">
      <p class="text-neutral-400">Loading profile...</p>
    </section>
  `;

  try {
    const [profileResponse, listingsResponse, bidsResponse] = await Promise.all(
      [readProfile(name), readProfileListings(name), readProfileBids(name)]
    );

    const profile = profileResponse?.data;
    const listings = listingsResponse?.data;
    const bids = bidsResponse?.data;

    if (!profile) {
      throw new Error("Profile data was not returned.");
    }

    app.replaceChildren(
      createProfile({
        user: profile,
        listings: Array.isArray(listings) ? listings : [],
        bids: Array.isArray(bids) ? bids : [],
      })
    );
  } catch {
    app.innerHTML = `
      <section class="px-6 py-16 sm:px-10" role="alert">
        <h1 class="text-3xl font-semibold">Unable to load profile</h1>
        <p class="mt-3 text-neutral-400">
          Your profile could not be loaded. Please try again.
        </p>
      </section>
    `;
  }
}
