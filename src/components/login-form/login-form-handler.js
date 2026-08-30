import { createApiKey } from "../../api/auth/create-api-key.js";
import { loginUser } from "../../api/auth/login.js";
import { ApiError } from "../../api/client.js";
import { readProfile } from "../../api/profiles/read-profile.js";
import {
  clearFormError,
  clearValidationErrors,
  enableValidationCleanup,
  minLength,
  normalizeEmail,
  required,
  showFormError,
  showValidationErrors,
  studentEmail,
  validateFields,
} from "../../utils/form-validation.js";
import { routes } from "../../utils/routes.js";
import { saveSession } from "../../utils/session-storage.js";

const loginRules = {
  email: [required("Email"), studentEmail],
  password: [required("Password"), minLength(8, "Password")],
};

/**
 * @typedef {object} LoginValues
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {object} LoginProfile
 * @property {string} accessToken
 * @property {string} name
 * @property {string} [email]
 * @property {string} [bio]
 * @property {Record<string, unknown>|null} [avatar]
 * @property {Record<string, unknown>|null} [banner]
 */

/**
 * @typedef {object} AuctionProfile
 * @property {string} name
 * @property {number} credits
 * @property {string} [email]
 * @property {string} [bio]
 * @property {Record<string, unknown>|null} [avatar]
 * @property {Record<string, unknown>|null} [banner]
 */

/**
 * Reads and normalizes login values.
 * The password is intentionally left unchanged.
 *
 * @param {HTMLFormElement} form
 * @returns {LoginValues}
 */
function getLoginValues(form) {
  const formData = new window.FormData(form);
  const password = formData.get("password");

  return {
    email: normalizeEmail(formData.get("email")),
    password: typeof password === "string" ? password : "",
  };
}

/**
 * Extracts an object from a standard API response.
 *
 * @param {unknown} response
 * @returns {Record<string, unknown>|null}
 */
function getResponseData(response) {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    return null;
  }

  const data = /** @type {{data?: unknown}} */ (response).data;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  return /** @type {Record<string, unknown>} */ (data);
}

/**
 * Extracts and verifies the required login response properties.
 *
 * @param {unknown} response
 * @returns {LoginProfile|null}
 */
function getLoginProfile(response) {
  const profile = getResponseData(response);

  if (
    !profile ||
    typeof profile.accessToken !== "string" ||
    !profile.accessToken.trim() ||
    typeof profile.name !== "string" ||
    !profile.name.trim()
  ) {
    return null;
  }

  return /** @type {LoginProfile} */ (profile);
}

/**
 * Extracts and verifies an API key response.
 *
 * @param {unknown} response
 * @returns {string|null}
 */
function getApiKey(response) {
  const data = getResponseData(response);

  if (!data || typeof data.key !== "string" || !data.key.trim()) {
    return null;
  }

  return data.key;
}

/**
 * Extracts and verifies the Auction House profile response.
 *
 * @param {unknown} response
 * @param {string} expectedName
 * @returns {AuctionProfile|null}
 */
function getAuctionProfile(response, expectedName) {
  const profile = getResponseData(response);

  if (
    !profile ||
    profile.name !== expectedName ||
    typeof profile.credits !== "number" ||
    !Number.isFinite(profile.credits)
  ) {
    return null;
  }

  return /** @type {AuctionProfile} */ (profile);
}

/**
 * Returns a safe user-facing login error.
 *
 * @param {unknown} error
 * @param {"login"|"profile"} stage
 * @returns {string}
 */
function getLoginErrorMessage(error, stage) {
  if (error instanceof ApiError) {
    if (stage === "login" && (error.status === 400 || error.status === 401)) {
      return "Email or password is incorrect.";
    }

    if (error.status === 0) {
      return "Unable to connect. Please check your connection and try again.";
    }
  }

  if (stage === "profile") {
    return "Login succeeded, but your auction profile could not be loaded. Please try again.";
  }

  return "Login failed. Please try again.";
}

/**
 * Updates the form's submission state.
 *
 * @param {HTMLFormElement} form
 * @param {HTMLButtonElement} submitButton
 * @param {boolean} isSubmitting
 */
function setSubmitting(form, submitButton, isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Logging in..." : "Log in";

  if (isSubmitting) {
    form.setAttribute("aria-busy", "true");
  } else {
    form.removeAttribute("aria-busy");
  }
}

/**
 * Connects the login form to validation, authentication and session storage.
 *
 * @param {HTMLFormElement} form
 */
export function initializeLoginForm(form) {
  const submitButton = form.querySelector('button[type="submit"]');

  if (!(submitButton instanceof window.HTMLButtonElement)) {
    return;
  }

  let isSubmitting = false;

  enableValidationCleanup(form, loginRules);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    clearFormError(form);
    form.querySelector("[data-registration-success]")?.remove();

    const values = getLoginValues(form);
    const errors = validateFields(values, loginRules);

    if (Object.keys(errors).length > 0) {
      showValidationErrors(form, errors);
      return;
    }

    clearValidationErrors(form);

    isSubmitting = true;
    setSubmitting(form, submitButton, true);

    /** @type {"login"|"profile"} */
    let requestStage = "login";

    try {
      const loginResponse = await loginUser(values);
      const loginProfile = getLoginProfile(loginResponse);

      if (!loginProfile) {
        throw new Error("Invalid login response.");
      }

      requestStage = "profile";

      const apiKeyResponse = await createApiKey(
        loginProfile.accessToken,
        "Provenance"
      );
      const apiKey = getApiKey(apiKeyResponse);

      if (!apiKey) {
        throw new Error("API key could not be created.");
      }

      const profileResponse = await readProfile(loginProfile.name, {
        token: loginProfile.accessToken,
        apiKey,
      });
      const auctionProfile = getAuctionProfile(
        profileResponse,
        loginProfile.name
      );

      if (!auctionProfile) {
        throw new Error("Invalid auction profile response.");
      }

      const session = saveSession({
        token: loginProfile.accessToken,
        apiKey,
        profile: {
          ...loginProfile,
          ...auctionProfile,
        },
      });

      if (!session) {
        throw new Error("Session could not be saved.");
      }

      window.location.assign(routes.home);
    } catch (error) {
      showFormError(form, getLoginErrorMessage(error, requestStage));

      const passwordField = form.elements.namedItem("password");

      if (passwordField instanceof window.HTMLInputElement) {
        passwordField.value = "";
      }

      isSubmitting = false;
      setSubmitting(form, submitButton, false);
    }
  });
}
