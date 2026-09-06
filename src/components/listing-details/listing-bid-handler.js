import { createBid } from "../../api/listings/create-bid.js";

/**
 * Connects bid form behaviour for a rendered auction listing.
 *
 * @param {HTMLElement} section - Listing details root element.
 * @param {Object} options
 * @param {string} options.listingId - Auction listing ID.
 * @param {number} options.currentBid - Current highest bid.
 * @param {() => Promise<void>|void} options.onSuccess - Runs after a successful bid.
 * @returns {void}
 */
export function setupBidHandler(section, { listingId, currentBid, onSuccess }) {
  const form = section.querySelector("[data-bid-form]");
  const input = section.querySelector("[data-bid-input]");
  const button = section.querySelector("[data-bid-submit]");
  const feedback = section.querySelector("[data-bid-feedback]");

  if (
    !(form instanceof globalThis.HTMLFormElement) ||
    !(input instanceof globalThis.HTMLInputElement) ||
    !(button instanceof globalThis.HTMLButtonElement) ||
    !(feedback instanceof globalThis.HTMLElement)
  ) {
    return;
  }

  const minimumBid = currentBid + 1;

  function showFeedback(message) {
    feedback.textContent = message;
  }

  function updateButtonState() {
    const amount = Number(input.value);
    const isValid = Number.isFinite(amount) && amount >= minimumBid;

    button.disabled = !isValid;
    button.classList.toggle("cursor-not-allowed", !isValid);
    button.classList.toggle("opacity-60", !isValid);
  }

  input.addEventListener("input", () => {
    showFeedback("");
    updateButtonState();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = Number(input.value);

    if (!Number.isFinite(amount) || amount < minimumBid) {
      showFeedback(`Your bid must be at least ${minimumBid} credits.`);
      input.focus();
      return;
    }

    button.disabled = true;
    input.disabled = true;
    button.textContent = "Placing bid...";
    showFeedback("");

    try {
      await createBid(listingId, amount);
      showFeedback("Bid placed successfully.");

      await onSuccess?.();
    } catch (error) {
      showFeedback(
        error instanceof Error
          ? error.message
          : "Unable to place your bid. Please try again."
      );
    } finally {
      button.textContent = "Place bid";
      input.disabled = false;
      updateButtonState();
    }
  });

  updateButtonState();
}
