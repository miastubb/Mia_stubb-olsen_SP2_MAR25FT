import { routes } from "../../utils/routes.js";
/**
 * Creates the form used to enter a new auction listing.
 *
 * This component only renders and validates the form UI.
 * API submission is handled in a separate ticket.
 *
 * @returns {HTMLFormElement}
 */
export function createListingForm() {
  const form = document.createElement("form");

  form.className = "mt-10 space-y-7";
  form.noValidate = true;

  form.innerHTML = `
    <div>
      <label
        for="listing-title"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Title <span aria-hidden="true">*</span>
      </label>

      <input
        id="listing-title"
        name="title"
        type="text"
        required
        autocomplete="off"
        class="mt-2 w-full border border-white/20 bg-neutral-950 px-4 py-3 text-white"
      />

      <p
        class="mt-2 min-h-5 text-sm text-red-400"
        data-error-for="title"
        aria-live="polite"
      ></p>
    </div>

    <div>
      <label
        for="listing-description"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Description <span class="text-neutral-500">(optional)</span>
      </label>

      <textarea
        id="listing-description"
        name="description"
        rows="6"
        class="mt-2 w-full resize-y border border-white/20 bg-neutral-950 px-4 py-3 text-white"
      ></textarea>
    </div>

    <div>
      <label
        for="listing-media-url"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Image URL <span class="text-neutral-500">(optional)</span>
      </label>

      <input
        id="listing-media-url"
        name="mediaUrl"
        type="url"
        inputmode="url"
        autocomplete="url"
        class="mt-2 w-full border border-white/20 bg-neutral-950 px-4 py-3 text-white"
        placeholder="https://example.com/image.jpg"
      />

      <p
        class="mt-2 min-h-5 text-sm text-red-400"
        data-error-for="mediaUrl"
        aria-live="polite"
      ></p>
    </div>

    <div>
      <label
        for="listing-media-alt"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Image description <span class="text-neutral-500">(optional)</span>
      </label>

      <input
        id="listing-media-alt"
        name="mediaAlt"
        type="text"
        autocomplete="off"
        class="mt-2 w-full border border-white/20 bg-neutral-950 px-4 py-3 text-white"
        placeholder="Describe the image"
      />
    </div>

    <div>
      <label
        for="listing-tags"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Tags <span class="text-neutral-500">(optional)</span>
      </label>

      <input
        id="listing-tags"
        name="tags"
        type="text"
        autocomplete="off"
        class="mt-2 w-full border border-white/20 bg-neutral-950 px-4 py-3 text-white"
        placeholder="art, vintage, furniture"
      />

      <p class="mt-2 text-sm text-neutral-500">
        Separate multiple tags with commas.
      </p>
    </div>

    <div>
      <label
        for="listing-deadline"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Auction deadline <span aria-hidden="true">*</span>
      </label>

      <input
        id="listing-deadline"
        name="endsAt"
        type="datetime-local"
        required
        class="mt-2 w-full border border-white/20 bg-neutral-950 px-4 py-3 text-white"
      />

      <p
        class="mt-2 min-h-5 text-sm text-red-400"
        data-error-for="endsAt"
        aria-live="polite"
      ></p>
    </div>

    <div
  class="grid gap-4 border border-white/10 bg-neutral-950 p-5 sm:grid-cols-[auto_1fr] sm:items-center"
>
  <div>
    <p class="font-mono text-sm text-neutral-400">
      Current Bids
    </p>
    <p class="mt-1 font-mono text-2xl font-semibold text-white">
      0
    </p>
  </div>

  <p class="text-sm leading-6 text-neutral-500">
    Starts at zero. Bidders can place bids once the listing is published.
  </p>
</div>

    <div
  class="flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row"
>
<p
  class="min-h-5 text-sm text-red-400"
  data-error-for="form"
  aria-live="polite"
></p>
  <button
    type="submit"
    class="min-h-12 bg-(--color-primary) px-10 font-mono font-semibold uppercase tracking-wide text-black"
  >
    Publish listing
  </button>

  <button
    type="button"
    data-cancel-create-listing
    class="min-h-12 border border-white/15 px-8 font-mono uppercase tracking-wide text-neutral-300 hover:text-white"
  >
    Cancel
  </button>
</div>
  `;
  const cancelButton = form.querySelector("[data-cancel-create-listing]");

  cancelButton?.addEventListener("click", () => {
    globalThis.location.assign(routes.profile);
  });

  return form;
}
