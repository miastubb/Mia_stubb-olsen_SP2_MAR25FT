/**
 * Connects client-side validation to the create listing form.
 *
 * This handler validates form input only.
 * API submission is handled separately.
 *
 * @param {HTMLFormElement} form - Create listing form.
 * @returns {void}
 */
export function setupCreateListingForm(form) {
  if (!(form instanceof globalThis.HTMLFormElement)) {
    return;
  }

  const titleInput = form.elements.namedItem("title");
  const mediaUrlInput = form.elements.namedItem("mediaUrl");
  const deadlineInput = form.elements.namedItem("endsAt");

  if (
    !(titleInput instanceof globalThis.HTMLInputElement) ||
    !(mediaUrlInput instanceof globalThis.HTMLInputElement) ||
    !(deadlineInput instanceof globalThis.HTMLInputElement)
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    let firstInvalidInput = null;

    if (!titleInput.value.trim()) {
      showError("title", "Enter a title.");
      firstInvalidInput ??= titleInput;
    }

    if (mediaUrlInput.value.trim()) {
      try {
        new globalThis.URL(mediaUrlInput.value.trim());
      } catch {
        showError("mediaUrl", "Enter a valid image URL.");
        firstInvalidInput ??= mediaUrlInput;
      }
    }

    const deadline = new Date(deadlineInput.value);

    if (!deadlineInput.value || Number.isNaN(deadline.getTime())) {
      showError("endsAt", "Choose an auction deadline.");
      firstInvalidInput ??= deadlineInput;
    } else if (deadline <= new Date()) {
      showError("endsAt", "Auction deadline must be in the future.");
      firstInvalidInput ??= deadlineInput;
    }

    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }
  });
}
