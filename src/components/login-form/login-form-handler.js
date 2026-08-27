import { loginUser } from "../../api/auth/login.js";
import { ApiError } from "../../api/client.js";
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
 * @property {number} [credits]
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
 * Extracts and verifies the required login response properties.
 *
 * @param {unknown} response
 * @returns {LoginProfile|null}
 */
function getLoginProfile(response) {
  const data =
    response && typeof response === "object" && !Array.isArray(response)
      ? /** @type {{data?: unknown}} */ (response).data
      : null;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const profile = /** @type {Record<string, unknown>} */ (data);

  if (
    typeof profile.accessToken !== "string" ||
    !profile.accessToken.trim() ||
    typeof profile.name !== "string" ||
    !profile.name.trim()
  ) {
    return null;
  }

  return /** @type {LoginProfile} */ (data);
}

/**
 * Returns a safe user-facing login error.
 *
 * @param {unknown} error
 * @returns {string}
 */
function getLoginErrorMessage(error) {
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 401) {
      return "Email or password is incorrect.";
    }

    if (error.status === 0) {
      return "Unable to connect. Please check your connection and try again.";
    }
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

    try {
      const response = await loginUser(values);
      const profile = getLoginProfile(response);

      if (!profile) {
        throw new Error("Invalid login response.");
      }

      const session = saveSession({
        token: profile.accessToken,
        profile,
      });

      if (!session) {
        throw new Error("Session could not be saved.");
      }

      window.location.assign(routes.home);
    } catch (error) {
      showFormError(form, getLoginErrorMessage(error));

      const passwordField = form.elements.namedItem("password");

      if (passwordField instanceof window.HTMLInputElement) {
        passwordField.value = "";
      }

      isSubmitting = false;
      setSubmitting(form, submitButton, false);
    }
  });
}
