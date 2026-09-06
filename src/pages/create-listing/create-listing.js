import "../../tailwind.css";
import "../../global.css";
import "../../variables.css";
import gavelIcon from "../../assets/icons/gavel.svg";

import { renderHeader } from "../../components/header/header.js";
import { requireAuth } from "../../utils/auth-guard.js";
import { routes } from "../../utils/routes.js";
import { createListingForm } from "../../components/create-listings-form/create-listings-form.js";
import { setupCreateListingForm } from "../../components/create-listings-form/create-listings-form-handler.js";

const session = requireAuth();

if (session) {
  renderHeader();

  const app = document.querySelector("#app");

  if (app) {
    const section = document.createElement("section");

    section.className = "px-6 py-10 sm:px-10 lg:py-12";

    section.innerHTML = `
  <div class="mx-auto max-w-3xl">
    <a
      href="${routes.profile}"
      class="inline-flex items-center gap-2 font-mono text-sm text-neutral-400 transition-colors hover:text-white"
    >
      <span aria-hidden="true">←</span>
      Back
    </a>

    <div class="mt-6">
  <div class="flex items-center gap-2">
    <img
      src="${gavelIcon}"
      alt=""
      class="h-5 w-5"
      aria-hidden="true"
    />

    <h1 class="text-[28px] font-normal italic leading-none md:text-[30px]">
  Create a New Listing
</h1>
  </div>

  <p class="mt-2 text-base text-neutral-400">
    Fill in the details for your auction listing.
  </p>
</div>

    <div data-create-listing-form></div>
  </div>
`;

    const formContainer = section.querySelector("[data-create-listing-form]");

    const form = createListingForm();

    formContainer?.append(form);
    setupCreateListingForm(form);

    app.replaceChildren(section);
  }
}
