import gavelIcon from "../../assets/icons/gavel.svg";
import { routes } from "../../utils/routes.js";

const html = String.raw;

const labelClass = "block text-sm uppercase tracking-wider text-(--color-text)";

const inputClass =
  "mt-2 w-full border border-neutral-700 bg-neutral-900 px-5 py-4 text-(--color-text) placeholder:text-neutral-600 transition-colors hover:border-neutral-600 focus:border-(--color-primary) focus:outline-2 focus:outline-offset-2 focus:outline-(--color-primary)";

const hintClass = "mt-2 text-sm leading-relaxed text-neutral-400";

/**
 * Creates the registration page content and form.
 *
 * The form uses native browser validation but does not submit to the API yet.
 *
 * @returns {HTMLElement}
 */
export function createRegistrationForm() {
  const section = document.createElement("section");

  section.className = "px-4 pb-20 pt-8 sm:px-6 lg:pb-24";
  section.setAttribute("aria-labelledby", "registration-heading");

  section.innerHTML = html`
    <div class="mx-auto max-w-2xl">
      <header class="text-center">
        <img
          src="${gavelIcon}"
          alt=""
          class="mx-auto h-8 w-8"
          aria-hidden="true"
        />

        <h1
          id="registration-heading"
          class="mt-5 text-4xl leading-tight sm:text-5xl"
        >
          Create an account
        </h1>

        <p class="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
          New members receive
          <strong class="font-bold text-(--color-primary)">
            1,000 credits
          </strong>
          to start bidding.
        </p>
      </header>

      <form
        id="registration-form"
        class="mx-auto mt-12 max-w-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-10"
        method="post"
      >
        <aside
          class="border border-neutral-700 bg-neutral-900 px-5 py-5 leading-relaxed text-neutral-300 sm:px-6"
          aria-label="Registration requirement"
        >
          Registration requires a
          <strong class="text-(--color-text)">@stud.noroff.no</strong>
          email address.
        </aside>

        <p id="required-fields-note" class="mt-6 text-sm text-neutral-400">
          Fields marked <span aria-hidden="true">*</span> are required.
        </p>

        <fieldset class="mt-6" aria-describedby="required-fields-note">
          <legend
            class="text-base font-bold uppercase tracking-wider text-(--color-text)"
          >
            Account details
          </legend>

          <div class="mt-6 space-y-6">
            <div>
              <label for="register-username" class="${labelClass}">
                Username
                <span class="text-(--color-primary)" aria-hidden="true">*</span>
                <span class="sr-only">required</span>
              </label>

              <input
                id="register-username"
                class="${inputClass}"
                name="name"
                type="text"
                autocomplete="username"
                placeholder="your_username"
                pattern="[A-Za-z0-9_]+"
                aria-describedby="register-username-hint"
                required
              />

              <p id="register-username-hint" class="${hintClass}">
                Use letters, numbers and underscores only.
              </p>
            </div>

            <div>
              <label for="register-email" class="${labelClass}">
                Email
                <span class="text-(--color-primary)" aria-hidden="true">*</span>
                <span class="sr-only">required</span>
              </label>

              <input
                id="register-email"
                class="${inputClass}"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@stud.noroff.no"
                pattern="[^s@]+@stud.noroff.no"
                aria-describedby="register-email-hint"
                required
              />

              <p id="register-email-hint" class="${hintClass}">
                Enter your Noroff student email address.
              </p>
            </div>

            <div>
              <label for="register-password" class="${labelClass}">
                Password
                <span class="text-(--color-primary)" aria-hidden="true">*</span>
                <span class="sr-only">required</span>
              </label>

              <input
                id="register-password"
                class="${inputClass}"
                name="password"
                type="password"
                autocomplete="new-password"
                placeholder="Minimum 8 characters"
                minlength="8"
                aria-describedby="register-password-hint"
                required
              />

              <p id="register-password-hint" class="${hintClass}">
                Your password must contain at least eight characters.
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset class="mt-10 border-t border-neutral-800 pt-8">
          <legend
            class="pr-3 text-base font-bold uppercase tracking-wider text-(--color-text)"
          >
            Personalize your profile
            <span class="text-sm font-normal text-neutral-400">
              (optional)
            </span>
          </legend>

          <div class="mt-6 space-y-7">
            <div>
              <label for="register-bio" class="${labelClass}">
                Bio
                <span class="text-neutral-400">(optional)</span>
              </label>

              <textarea
                id="register-bio"
                class="${inputClass} min-h-32 resize-y"
                name="bio"
                rows="4"
                maxlength="160"
                placeholder="Tell collectors a little about yourself"
                aria-describedby="register-bio-hint"
              ></textarea>

              <p id="register-bio-hint" class="${hintClass}">
                Maximum 160 characters.
              </p>
            </div>

            <fieldset class="border border-neutral-800 p-4 sm:p-5">
              <legend
                class="px-2 text-sm font-bold uppercase tracking-wider text-(--color-text)"
              >
                Avatar <span class="text-neutral-400">(optional)</span>
              </legend>

              <div class="space-y-6">
                <div>
                  <label for="register-avatar-url" class="${labelClass}">
                    Image URL
                    <span class="text-neutral-400">(optional)</span>
                  </label>

                  <input
                    id="register-avatar-url"
                    class="${inputClass}"
                    name="avatarUrl"
                    type="url"
                    autocomplete="off"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label for="register-avatar-alt" class="${labelClass}">
                    Image description
                    <span class="text-neutral-400">(optional)</span>
                  </label>

                  <input
                    id="register-avatar-alt"
                    class="${inputClass}"
                    name="avatarAlt"
                    type="text"
                    maxlength="120"
                    placeholder="Describe your avatar"
                    aria-describedby="register-avatar-alt-hint"
                  />

                  <p id="register-avatar-alt-hint" class="${hintClass}">
                    Complete this when adding an avatar URL. Maximum 120
                    characters.
                  </p>
                </div>
              </div>
            </fieldset>

            <fieldset class="border border-neutral-800 p-4 sm:p-5">
              <legend
                class="px-2 text-sm font-bold uppercase tracking-wider text-(--color-text)"
              >
                Banner <span class="text-neutral-400">(optional)</span>
              </legend>

              <div class="space-y-6">
                <div>
                  <label for="register-banner-url" class="${labelClass}">
                    Image URL
                    <span class="text-neutral-400">(optional)</span>
                  </label>

                  <input
                    id="register-banner-url"
                    class="${inputClass}"
                    name="bannerUrl"
                    type="url"
                    autocomplete="off"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                <div>
                  <label for="register-banner-alt" class="${labelClass}">
                    Image description
                    <span class="text-neutral-400">(optional)</span>
                  </label>

                  <input
                    id="register-banner-alt"
                    class="${inputClass}"
                    name="bannerAlt"
                    type="text"
                    maxlength="120"
                    placeholder="Describe your banner"
                    aria-describedby="register-banner-alt-hint"
                  />

                  <p id="register-banner-alt-hint" class="${hintClass}">
                    Complete this when adding a banner URL. Maximum 120
                    characters.
                  </p>
                </div>
              </div>
            </fieldset>
          </div>
        </fieldset>

        <button
          type="submit"
          class="mt-8 flex min-h-14 w-full items-center justify-center bg-(--color-primary) px-6 py-4 text-base font-bold uppercase tracking-wider text-black transition-colors hover:bg-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
        >
          Create account
        </button>

        <p class="mt-6 text-center text-neutral-400">
          Already registered?
          <a
            href="${routes.login}"
            class="text-(--color-primary) underline underline-offset-4 hover:text-(--color-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  `;

  const form = section.querySelector("#registration-form");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  return section;
}
