import { createListing } from "../../api/listings/create-listing.js";
import { routes } from "../../utils/routes.js";
import { collectListingMedia } from "./create-listings-form.js";
/**
 * Connects client-side validation to the create listing form.
 *
 * Validates and submits the create listing form.
 *
 * @param {HTMLFormElement} form - Create listing form.
 * @returns {void}
 */
export function setupCreateListingForm(form) {
  if (!(form instanceof globalThis.HTMLFormElement)) {
    return;
  }

  const titleInput = form.elements.namedItem("title");
  const deadlineInput = form.elements.namedItem("endsAt");
  const descriptionInput = form.elements.namedItem("description");
  const tagsInput = form.elements.namedItem("tags");
  const submitButton = form.querySelector('button[type="submit"]');

  if (
    !(titleInput instanceof globalThis.HTMLInputElement) ||
    !(descriptionInput instanceof globalThis.HTMLTextAreaElement) ||
    !(tagsInput instanceof globalThis.HTMLInputElement) ||
    !(deadlineInput instanceof globalThis.HTMLInputElement) ||
    !(submitButton instanceof globalThis.HTMLButtonElement)
  ) {
    return;
  }

  /**
   * Displays an inline validation message.
   *
   * @param {string} fieldName
   * @param {string} message
   */
  function showError(fieldName, message) {
    const error = form.querySelector(`[data-error-for="${fieldName}"]`);

    if (error) {
      error.textContent = message;
    }
  }

  /**
   * Clears all validation messages.
   */
  function clearErrors() {
    form.querySelectorAll("[data-error-for]").forEach((error) => {
      error.textContent = "";
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    let firstInvalidInput = null;

    if (!titleInput.value.trim()) {
      showError("title", "Enter a title.");
      firstInvalidInput ??= titleInput;
    }

    const deadline = new Date(deadlineInput.value);

    if (!deadlineInput.value || Number.isNaN(deadline.getTime())) {
      showError("endsAt", "Choose an auction deadline.");
      firstInvalidInput ??= deadlineInput;
    } else if (deadline <= new Date()) {
      showError("endsAt", "Auction deadline must be in the future.");
      firstInvalidInput ??= deadlineInput;
    }

    const { media, invalidInput } = collectListingMedia(form);

    if (invalidInput) {
      showError("media", "Enter a valid image URL.");
      firstInvalidInput ??= invalidInput;
    }

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      return;
    }

    const tags = tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const listing = {
      title: titleInput.value.trim(),
      endsAt: new Date(deadlineInput.value).toISOString(),
      ...(descriptionInput.value.trim() && {
        description: descriptionInput.value.trim(),
      }),
      ...(tags.length > 0 && {
        tags,
      }),
      ...(media.length > 0 && {
        media,
      }),
    };

    submitButton.disabled = true;
    submitButton.textContent = "Publishing...";

    try {
      const response = await createListing(listing);
      const listingId = response?.data?.id;

      if (listingId) {
        globalThis.location.assign(`${routes.listing}?id=${listingId}`);
      } else {
        globalThis.location.assign(routes.profile);
      }
    } catch (error) {
      showError(
        "form",
        error instanceof Error
          ? error.message
          : "Unable to create the listing. Please try again."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Publish listing";
    }
  });
}
