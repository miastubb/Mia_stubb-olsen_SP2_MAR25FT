const STUDENT_EMAIL_PATTERN = /^[^\s@]+@stud\.noroff\.no$/;

/**
 * Creates a minimum-length validator.
 *
 * Empty values are handled separately by the required validator.
 *
 * @param {number} minimum
 * @param {string} fieldLabel
 * @returns {Validator}
 */
export function minLength(minimum, fieldLabel = "This field") {
  return (value) => {
    if (typeof value !== "string" || value.length === 0) {
      return "";
    }

    return value.length >= minimum
      ? ""
      : `${fieldLabel} must contain at least ${minimum} characters.`;
  };
}

/**
 * Creates a validator that checks a value against a regular expression.
 *
 * Empty values are handled separately by the required validator.
 *
 * @param {RegExp} pattern
 * @param {string} message
 * @returns {Validator}
 */
export function matchesPattern(pattern, message) {
  return (value) => {
    const text = normalizeText(value);

    if (!text) {
      return "";
    }

    return pattern.test(text) ? "" : message;
  };
}

/**
 * Creates a validator for optional HTTP or HTTPS URLs.
 *
 * @param {string} fieldLabel
 * @returns {Validator}
 */
export function webUrl(fieldLabel = "URL") {
  return (value) => {
    const text = normalizeText(value);

    if (!text) {
      return "";
    }

    try {
      const url = new URL(text);
      const isWebUrl = url.protocol === "http:" || url.protocol === "https:";

      return isWebUrl ? "" : `${fieldLabel} must be a valid web address.`;
    } catch {
      return `${fieldLabel} must be a valid web address.`;
    }
  };
}

/**
 * @typedef {(value: unknown) => string} Validator
 */

/**
 * Removes unnecessary surrounding whitespace from text.
 * Non-string values become an empty string.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Normalizes an email address for validation and API submission.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

/**
 * Creates a required-field validator.
 *
 * @param {string} fieldLabel
 * @returns {Validator}
 */
export function required(fieldLabel = "This field") {
  return (value) => (normalizeText(value) ? "" : `${fieldLabel} is required.`);
}

/**
 * Validates that an email uses the Noroff student domain.
 *
 * Empty values are handled separately by the required validator.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function studentEmail(value) {
  const email = normalizeEmail(value);

  if (!email) {
    return "";
  }

  return STUDENT_EMAIL_PATTERN.test(email)
    ? ""
    : "Enter a valid @stud.noroff.no email address.";
}

/**
 * Runs validation rules and returns one message per invalid field.
 *
 * @param {Record<string, unknown>} values
 * @param {Record<string, Validator[]>} rules
 * @returns {Record<string, string>}
 */
export function validateFields(values, rules) {
  const errors = {};

  for (const [fieldName, validators] of Object.entries(rules)) {
    const value = values[fieldName];

    for (const validate of validators) {
      const message = validate(value);

      if (message) {
        errors[fieldName] = message;
        break;
      }
    }
  }

  return errors;
}

let generatedFieldId = 0;

/**
 * Ensures that a field has an ID that can be used for accessibility.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} field
 * @returns {string}
 */
function ensureFieldId(field) {
  if (!field.id) {
    generatedFieldId += 1;
    field.id = `form-field-${generatedFieldId}`;
  }

  return field.id;
}

/**
 * Adds an ID to a field's aria-describedby value without removing
 * existing descriptions or hints.
 *
 * @param {HTMLElement} field
 * @param {string} descriptionId
 */
function addDescription(field, descriptionId) {
  const descriptions = new Set(
    (field.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean)
  );

  descriptions.add(descriptionId);
  field.setAttribute("aria-describedby", [...descriptions].join(" "));
}

/**
 * Removes one ID from a field's aria-describedby value.
 *
 * @param {HTMLElement} field
 * @param {string} descriptionId
 */
function removeDescription(field, descriptionId) {
  const descriptions = (field.getAttribute("aria-describedby") ?? "")
    .split(/\s+/)
    .filter((id) => id && id !== descriptionId);

  if (descriptions.length) {
    field.setAttribute("aria-describedby", descriptions.join(" "));
  } else {
    field.removeAttribute("aria-describedby");
  }
}

/**
 * Displays an accessible inline error for one field.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} field
 * @param {string} message
 */
export function showFieldError(field, message) {
  const fieldId = ensureFieldId(field);
  const errorId = `${fieldId}-error`;
  let errorElement = document.getElementById(errorId);

  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.id = errorId;
    errorElement.className = "form-error form-error--field";
    errorElement.dataset.validationError = "true";
    errorElement.setAttribute("role", "alert");
    field.insertAdjacentElement("afterend", errorElement);
  }

  errorElement.textContent = message;
  field.setAttribute("aria-invalid", "true");
  addDescription(field, errorId);
}

/**
 * Removes the inline error associated with one field.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} field
 */
export function clearFieldError(field) {
  const errorId = field.id ? `${field.id}-error` : "";

  if (errorId) {
    document.getElementById(errorId)?.remove();
    removeDescription(field, errorId);
  }

  field.removeAttribute("aria-invalid");
}

/**
 * Removes all field-level validation errors from a form.
 *
 * @param {HTMLFormElement} form
 */
export function clearValidationErrors(form) {
  form
    .querySelectorAll(
      'input[aria-invalid="true"], textarea[aria-invalid="true"], select[aria-invalid="true"]'
    )
    .forEach((field) => clearFieldError(field));

  form
    .querySelectorAll('[data-validation-error="true"]')
    .forEach((errorElement) => errorElement.remove());
}

/**
 * Displays field errors and focuses the first invalid field.
 *
 * @param {HTMLFormElement} form
 * @param {Record<string, string>} errors
 */
export function showValidationErrors(form, errors) {
  clearValidationErrors(form);

  let firstInvalidField = null;

  for (const [fieldName, message] of Object.entries(errors)) {
    const field = form.elements.namedItem(fieldName);

    if (!field || typeof field.setAttribute !== "function") {
      continue;
    }

    showFieldError(field, message);
    firstInvalidField ??= field;
  }

  firstInvalidField?.focus();
}

/**
 * Displays an API or form-level error through the same feedback system.
 *
 * @param {HTMLFormElement} form
 * @param {unknown} message
 */
export function showFormError(form, message) {
  clearFormError(form);

  const errorElement = document.createElement("p");
  errorElement.className = "form-error form-error--form";
  errorElement.dataset.formError = "true";
  errorElement.setAttribute("role", "alert");
  errorElement.textContent =
    normalizeText(message) || "Something went wrong. Please try again.";

  form.prepend(errorElement);
}

/**
 * Removes the current API or form-level error.
 *
 * @param {HTMLFormElement} form
 */
export function clearFormError(form) {
  form.querySelector('[data-form-error="true"]')?.remove();
}

/**
 * Removes stale feedback once the affected field becomes valid.
 *
 * @param {HTMLFormElement} form
 * @param {Record<string, Validator[]>} rules
 * @returns {() => void} Function that removes the event listener
 */
export function enableValidationCleanup(form, rules) {
  function handleInput(event) {
    const field = event.target;

    if (!field?.name) {
      return;
    }

    clearFormError(form);

    const fieldRules = rules[field.name];

    if (!fieldRules || field.getAttribute("aria-invalid") !== "true") {
      return;
    }

    const errors = validateFields(
      { [field.name]: field.value },
      { [field.name]: fieldRules }
    );

    if (!errors[field.name]) {
      clearFieldError(field);
    }
  }

  form.addEventListener("input", handleInput);

  return () => form.removeEventListener("input", handleInput);
}
