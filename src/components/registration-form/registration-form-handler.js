import { registerUser } from "../../api/auth/register.js";
import {
  clearFormError,
  clearValidationErrors,
  enableValidationCleanup,
  matchesPattern,
  minLength,
  normalizeEmail,
  normalizeText,
  required,
  showFormError,
  showValidationErrors,
  studentEmail,
  validateFields,
  webUrl,
} from "../../utils/form-validation.js";
import { routes } from "../../utils/routes.js";

const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

const registrationRules = {
  name: [
    required("Username"),
    matchesPattern(
      USERNAME_PATTERN,
      "Username can contain only letters, numbers and underscores."
    ),
  ],
  email: [required("Email"), studentEmail],
  password: [required("Password"), minLength(8, "Password")],
  avatarUrl: [webUrl("Avatar URL")],
  bannerUrl: [webUrl("Banner URL")],
};

/**
 * @typedef {object} RegistrationValues
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} bio
 * @property {string} avatarUrl
 * @property {string} avatarAlt
 * @property {string} bannerUrl
 * @property {string} bannerAlt
 */

/**
 * @typedef {object} RegistrationPayload
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} [bio]
 * @property {{url: string, alt: string}} [avatar]
 * @property {{url: string, alt: string}} [banner]
 */

/**
 * Reads and normalizes registration values.
 * The password is intentionally not normalized or stored.
 *
 * @param {HTMLFormElement} form
 * @returns {RegistrationValues}
 */
function getRegistrationValues(form) {
  const formData = new window.FormData(form);
  const password = formData.get("password");

  return {
    name: normalizeText(formData.get("name")),
    email: normalizeEmail(formData.get("email")),
    password: typeof password === "string" ? password : "",
    bio: normalizeText(formData.get("bio")),
    avatarUrl: normalizeText(formData.get("avatarUrl")),
    avatarAlt: normalizeText(formData.get("avatarAlt")),
    bannerUrl: normalizeText(formData.get("bannerUrl")),
    bannerAlt: normalizeText(formData.get("bannerAlt")),
  };
}

/**
 * Creates the API payload and excludes empty optional properties.
 *
 * @param {RegistrationValues} values
 * @returns {RegistrationPayload}
 */
function createRegistrationPayload(values) {
  /** @type {RegistrationPayload} */
  const payload = {
    name: values.name,
    email: values.email,
    password: values.password,
  };

  if (values.bio) {
    payload.bio = values.bio;
  }

  if (values.avatarUrl) {
    payload.avatar = {
      url: values.avatarUrl,
      alt: values.avatarAlt,
    };
  }

  if (values.bannerUrl) {
    payload.banner = {
      url: values.bannerUrl,
      alt: values.bannerAlt,
    };
  }

  return payload;
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
  submitButton.textContent = isSubmitting
    ? "Creating account…"
    : "Create account";

  if (isSubmitting) {
    form.setAttribute("aria-busy", "true");
  } else {
    form.removeAttribute("aria-busy");
  }
}

/**
 * Connects a registration form to validation and the registration API.
 *
 * @param {HTMLFormElement} form
 */
export function initializeRegistrationForm(form) {
  const submitButton = form.querySelector('button[type="submit"]');

  if (!(submitButton instanceof window.HTMLButtonElement)) {
    return;
  }

  let isSubmitting = false;

  enableValidationCleanup(form, registrationRules);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    clearFormError(form);

    const values = getRegistrationValues(form);
    const errors = validateFields(values, registrationRules);

    if (Object.keys(errors).length > 0) {
      showValidationErrors(form, errors);
      return;
    }

    clearValidationErrors(form);

    isSubmitting = true;
    setSubmitting(form, submitButton, true);

    try {
      await registerUser(createRegistrationPayload(values));

      window.location.assign(`${routes.login}?registration=success`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      showFormError(form, message);

      const passwordField = form.elements.namedItem("password");

      if (passwordField instanceof window.HTMLInputElement) {
        passwordField.value = "";
      }

      isSubmitting = false;
      setSubmitting(form, submitButton, false);
    }
  });
}
