import { routes } from "../../utils/routes.js";

/**
 * Creates the form used to enter a new auction listing.
 *
 * This component only renders and validates the form UI.
 * API submission is handled in a separate ticket.
 *
 * @returns {HTMLFormElement}
 */
function createMediaRow(media = {}) {
  const row = document.createElement("div");

  row.dataset.mediaRow = "";
  row.className =
    "grid gap-4 border border-white/10 bg-neutral-950 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end";

  row.innerHTML = `
    <div>
      <label class="block font-mono text-sm uppercase text-neutral-400">
        Image URL
      </label>

      <input
        type="url"
        name="mediaUrl"
        inputmode="url"
        autocomplete="url"
        class="mt-2 w-full border border-white/20 bg-neutral-950 px-4 py-3 text-white"
        placeholder="https://example.com/image.jpg"
      />
    </div>

    <div>
      <label class="block font-mono text-sm uppercase text-neutral-400">
        Image description
      </label>

      <input
        type="text"
        name="mediaAlt"
        autocomplete="off"
        class="mt-2 w-full border border-white/20 bg-neutral-950 px-4 py-3 text-white"
        placeholder="Describe the image"
      />
    </div>

    <button
      type="button"
      data-remove-media
      class="min-h-12 border border-red-500/40 px-4 font-mono text-sm uppercase text-red-400 hover:border-red-400"
    >
      Remove
    </button>
  `;

  const urlInput = row.querySelector('input[name="mediaUrl"]');
  const altInput = row.querySelector('input[name="mediaAlt"]');
  const removeButton = row.querySelector("[data-remove-media]");

  if (urlInput instanceof globalThis.HTMLInputElement) {
    urlInput.value = media.url || "";
  }

  if (altInput instanceof globalThis.HTMLInputElement) {
    altInput.value = media.alt || "";
  }

  removeButton?.addEventListener("click", () => {
    row.remove();
  });

  return row;
}

/**
 * Collects and validates media entered in a listing form.
 *
 * @param {HTMLFormElement} form - Listing form containing media rows.
 * @returns {{media: Array<{url: string, alt?: string}>, invalidInput: HTMLInputElement|null}}
 */
export function collectListingMedia(form) {
  const media = [];
  const rows = form.querySelectorAll("[data-media-row]");

  for (const row of rows) {
    const urlInput = row.querySelector('input[name="mediaUrl"]');
    const altInput = row.querySelector('input[name="mediaAlt"]');

    if (
      !(urlInput instanceof globalThis.HTMLInputElement) ||
      !(altInput instanceof globalThis.HTMLInputElement)
    ) {
      continue;
    }

    const url = urlInput.value.trim();
    const alt = altInput.value.trim();

    if (!url) {
      continue;
    }

    try {
      new globalThis.URL(url);
    } catch {
      return {
        media: [],
        invalidInput: urlInput,
      };
    }

    media.push({
      url,
      ...(alt && { alt }),
    });
  }

  return {
    media,
    invalidInput: null,
  };
}

export function createListingForm({ mode = "create", listing = null } = {}) {
  const form = document.createElement("form");

  form.className = "mt-10 space-y-7";
  form.noValidate = true;
  const isEditMode = mode === "edit";

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
  <div class="flex items-center justify-between gap-4">
    <div>
      <p class="font-mono text-sm uppercase text-neutral-400">
        Images <span class="text-neutral-500">(optional)</span>
      </p>

      <p class="mt-2 text-sm text-neutral-500">
        Add one or more images to the listing.
      </p>
    </div>

    <button
      type="button"
      data-add-media
      class="border border-white/20 px-4 py-2 font-mono text-sm uppercase text-neutral-300 hover:text-white"
    >
      + Add image
    </button>
  </div>

  <div data-media-list class="mt-5 space-y-5"></div>

  <p
    class="mt-2 min-h-5 text-sm text-red-400"
    data-error-for="media"
    aria-live="polite"
  ></p>
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

    ${
      !isEditMode
        ? `
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
  `
        : ""
    }
   ${
     !isEditMode
       ? `
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
  `
       : ""
   }

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
   ${isEditMode ? "Save changes" : "Publish listing"}
  </button>

  <button
    type="button"
    data-cancel-listing-form
    class="min-h-12 border border-white/15 px-8 font-mono uppercase tracking-wide text-neutral-300 hover:text-white"
  >
    Cancel
  </button>
</div>
  `;
  const mediaList = form.querySelector("[data-media-list]");
  const addMediaButton = form.querySelector("[data-add-media]");

  function addMediaRow(media = {}) {
    if (!mediaList) {
      return;
    }

    mediaList.append(createMediaRow(media));
  }

  addMediaButton?.addEventListener("click", () => {
    addMediaRow();
  });
  const cancelButton = form.querySelector("[data-cancel-listing-form]");

  cancelButton?.addEventListener("click", () => {
    if (isEditMode) {
      form.dispatchEvent(new globalThis.CustomEvent("cancel-edit"));
      return;
    }

    globalThis.location.assign(routes.profile);
  });
  if (!isEditMode) {
    addMediaRow();
  }

  if (isEditMode && listing) {
    const titleInput = form.elements.namedItem("title");
    const descriptionInput = form.elements.namedItem("description");
    const tagsInput = form.elements.namedItem("tags");

    if (titleInput instanceof globalThis.HTMLInputElement) {
      titleInput.value = listing.title || "";
    }

    if (descriptionInput instanceof globalThis.HTMLTextAreaElement) {
      descriptionInput.value = listing.description || "";
    }

    const existingMedia = Array.isArray(listing.media) ? listing.media : [];

    existingMedia.forEach((media) => {
      addMediaRow(media);
    });

    if (tagsInput instanceof globalThis.HTMLInputElement) {
      tagsInput.value = Array.isArray(listing.tags)
        ? listing.tags.join(", ")
        : "";
    }
  }
  return form;
}
