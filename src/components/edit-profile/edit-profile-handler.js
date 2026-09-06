import { updateProfile } from "../../api/profiles/update-profile.js";

/**
 * Validates and submits the edit profile form.
 *
 * @param {HTMLFormElement} form - Edit profile form.
 * @param {string} profileName - Current authenticated profile name.
 * @param {() => Promise<void>|void} onSuccess - Runs after a successful update.
 * @returns {void}
 */
export function setupEditProfileForm(form, profileName, onSuccess) {
  if (!(form instanceof globalThis.HTMLFormElement)) {
    return;
  }

  const bioInput = form.elements.namedItem("bio");
  const avatarUrlInput = form.elements.namedItem("avatarUrl");
  const avatarAltInput = form.elements.namedItem("avatarAlt");
  const bannerUrlInput = form.elements.namedItem("bannerUrl");
  const bannerAltInput = form.elements.namedItem("bannerAlt");
  const submitButton = form.querySelector('button[type="submit"]');

  if (
    !(bioInput instanceof globalThis.HTMLTextAreaElement) ||
    !(avatarUrlInput instanceof globalThis.HTMLInputElement) ||
    !(avatarAltInput instanceof globalThis.HTMLInputElement) ||
    !(bannerUrlInput instanceof globalThis.HTMLInputElement) ||
    !(bannerAltInput instanceof globalThis.HTMLInputElement) ||
    !(submitButton instanceof globalThis.HTMLButtonElement)
  ) {
    return;
  }

  function showError(fieldName, message) {
    const error = form.querySelector(`[data-error-for="${fieldName}"]`);

    if (error) {
      error.textContent = message;
    }
  }

  function clearErrors() {
    form.querySelectorAll("[data-error-for]").forEach((error) => {
      error.textContent = "";
    });
  }

  function isValidUrl(value) {
    if (!value) {
      return true;
    }

    try {
      new globalThis.URL(value);
      return true;
    } catch {
      return false;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const avatarUrl = avatarUrlInput.value.trim();
    const bannerUrl = bannerUrlInput.value.trim();

    let firstInvalidInput = null;

    if (!isValidUrl(avatarUrl)) {
      showError("avatarUrl", "Enter a valid avatar URL.");
      firstInvalidInput ??= avatarUrlInput;
    }

    if (!isValidUrl(bannerUrl)) {
      showError("bannerUrl", "Enter a valid banner URL.");
      firstInvalidInput ??= bannerUrlInput;
    }

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      return;
    }

    const profile = {
      bio: bioInput.value.trim(),
      ...(avatarUrl && {
        avatar: {
          url: avatarUrl,
          alt: avatarAltInput.value.trim(),
        },
      }),
      ...(bannerUrl && {
        banner: {
          url: bannerUrl,
          alt: bannerAltInput.value.trim(),
        },
      }),
    };

    submitButton.disabled = true;
    submitButton.textContent = "Saving...";

    try {
      await updateProfile(profileName, profile);
      await onSuccess?.();
    } catch (error) {
      showError(
        "form",
        error instanceof Error
          ? error.message
          : "Unable to update your profile. Please try again."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Save changes";
    }
  });
}
