import "../../tailwind.css";
import "../../global.css";
import "../../variables.css";
import { routes } from "../../utils/routes.js";
import { renderFooter } from "../../components/footer/footer.js";
import { createListingDetails } from "../../components/listing-details/listing-details.js";
import { getSession } from "../../utils/session-storage.js";
import { setupBidHandler } from "../../components/listing-details/listing-bid-handler.js";

import { readListing } from "../../api/listings/read-listing.js";
import { deleteListing } from "../../api/listings/delete-listing.js";
import { renderHeader } from "../../components/header/header.js";
import { updateListing } from "../../api/listings/update-listing.js";
import {
  collectListingMedia,
  createListingForm,
} from "../../components/create-listings-form/create-listings-form.js";
renderHeader();
renderFooter();

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

    const isOwner =
      Boolean(session?.profile?.name) &&
      session.profile.name === listing.seller?.name;

    const listingDetails = createListingDetails(
      listing,
      Boolean(session),
      isOwner
    );

    container.replaceChildren(listingDetails);

    if (session) {
      setupBidHandler(listingDetails, {
        listingId,
        currentBid: Math.max(
          0,
          ...(Array.isArray(listing.bids)
            ? listing.bids.map((bid) => Number(bid.amount) || 0)
            : [])
        ),
        onSuccess: async () => {
          await loadListing(container);
        },
      });
    }
    if (isOwner) {
      const editButton = listingDetails.querySelector("[data-edit-listing]");

      const deleteButton = listingDetails.querySelector(
        "[data-delete-listing]"
      );

      editButton?.addEventListener("click", () => {
        const editForm = createListingForm({
          mode: "edit",
          listing,
        });

        container.replaceChildren(editForm);

        editForm.addEventListener("cancel-edit", async () => {
          await loadListing(container);
        });

        editForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          const titleInput = editForm.elements.namedItem("title");
          const descriptionInput = editForm.elements.namedItem("description");
          const tagsInput = editForm.elements.namedItem("tags");
          const submitButton = editForm.querySelector('button[type="submit"]');

          if (
            !(titleInput instanceof globalThis.HTMLInputElement) ||
            !(descriptionInput instanceof globalThis.HTMLTextAreaElement) ||
            !(tagsInput instanceof globalThis.HTMLInputElement) ||
            !(submitButton instanceof globalThis.HTMLButtonElement)
          ) {
            return;
          }

          editForm.querySelectorAll("[data-error-for]").forEach((error) => {
            error.textContent = "";
          });

          if (!titleInput.value.trim()) {
            const titleError = editForm.querySelector(
              '[data-error-for="title"]'
            );

            if (titleError) {
              titleError.textContent = "Enter a title.";
            }

            titleInput.focus();
            return;
          }

          const { media, invalidInput } = collectListingMedia(editForm);

          if (invalidInput) {
            const mediaError = editForm.querySelector(
              '[data-error-for="media"]'
            );

            if (mediaError) {
              mediaError.textContent = "Enter a valid image URL.";
            }

            invalidInput.focus();
            return;
          }

          const tags = tagsInput.value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

          const updatedListing = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            tags,
            media,
          };

          submitButton.disabled = true;
          submitButton.textContent = "Saving...";

          try {
            await updateListing(listingId, updatedListing);
            await loadListing(container);
          } catch (error) {
            const formError = editForm.querySelector('[data-error-for="form"]');

            if (formError) {
              formError.textContent =
                error instanceof Error
                  ? error.message
                  : "Unable to update the listing. Please try again.";
            }

            submitButton.disabled = false;
            submitButton.textContent = "Save changes";
          }
        });
      });

      deleteButton?.addEventListener("click", async () => {
        const confirmed = globalThis.confirm(
          "Are you sure you want to delete this listing?"
        );

        if (!confirmed) {
          return;
        }

        deleteButton.disabled = true;
        deleteButton.textContent = "Deleting...";

        try {
          await deleteListing(listingId);
          globalThis.location.assign(routes.profile);
        } catch (error) {
          globalThis.alert(
            error instanceof Error
              ? error.message
              : "Unable to delete the listing. Please try again."
          );

          deleteButton.disabled = false;
          deleteButton.textContent = "Delete listing";
        }
      });
    }
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
