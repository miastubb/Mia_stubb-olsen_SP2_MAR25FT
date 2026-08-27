import gavelIcon from "../../assets/icons/gavel.svg";
import { routes } from "../../utils/routes.js";
import { initializeLoginForm } from "./login-form-handler.js";

const html = String.raw;

const labelClass = "block text-sm uppercase tracking-wider text-(--color-text)";

const inputClass =
  "mt-2 w-full border border-neutral-700 bg-neutral-900 px-5 py-4 text-(--color-text) placeholder:text-neutral-600 transition-colors hover:border-neutral-600 focus:border-(--color-primary) focus:outline-2 focus:outline-offset-2 focus:outline-(--color-primary)";

/**
 * @typedef {object} LoginFormOptions
 * @property {boolean} [showRegistrationSuccess]
 */

/**
 * Creates the login-page content and form.
 *
 * The form uses reusable validation and submits through the login API.
 *
 * @param {LoginFormOptions} [options]
 * @returns {HTMLElement}
 */
export function createLoginForm({ showRegistrationSuccess = false } = {}) {
  const section = document.createElement("section");

  const successMessage = showRegistrationSuccess
    ? html`
        <div
          class="mb-8 border-l-4 border-(--color-primary) bg-neutral-900 px-5 py-5 text-left"
          role="status"
          aria-live="polite"
          tabindex="-1"
          data-registration-success
        >
          <p class="font-bold text-(--color-text)">
            Account created successfully.
          </p>
          <p class="mt-2 text-neutral-300">
            You can now log in with your new account.
          </p>
        </div>
      `
    : "";

  section.className = "px-4 pb-20 pt-8 sm:px-6 lg:pb-24";
  section.setAttribute("aria-labelledby", "login-heading");

  section.innerHTML = html`
    <div class="mx-auto max-w-2xl">
      <header class="text-center">
        <img
          src="${gavelIcon}"
          alt=""
          class="mx-auto h-8 w-8"
          aria-hidden="true"
        />

        <h1 id="login-heading" class="mt-5 text-4xl leading-tight sm:text-5xl">
          Welcome back
        </h1>

        <p class="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
          Sign in to your Provenance account.
        </p>
      </header>

      <form
        id="login-form"
        class="mx-auto mt-12 max-w-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-10"
        method="post"
        novalidate
      >
        ${successMessage}

        <div class="space-y-7">
          <div>
            <label for="login-email" class="${labelClass}">Email</label>

            <input
              id="login-email"
              class="${inputClass}"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="you@stud.noroff.no"
              required
            />
          </div>

          <div>
            <label for="login-password" class="${labelClass}">Password</label>

            <input
              id="login-password"
              class="${inputClass}"
              name="password"
              type="password"
              autocomplete="current-password"
              placeholder="Enter your password"
              minlength="8"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="mt-8 flex min-h-14 w-full items-center justify-center bg-(--color-primary) px-6 py-4 text-base font-bold uppercase tracking-wider text-black transition-colors hover:bg-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) disabled:cursor-not-allowed disabled:opacity-60"
        >
          Log in
        </button>

        <p class="mt-6 text-center text-neutral-400">
          No account?
          <a
            href="${routes.register}"
            class="text-(--color-primary) underline underline-offset-4 hover:text-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
          >
            Register here
          </a>
        </p>
      </form>
    </div>
  `;

  const form = section.querySelector("#login-form");

  if (form instanceof window.HTMLFormElement) {
    initializeLoginForm(form);
  }

  return section;
}
