/**
 * Creates a pre-populated profile editing form.
 *
 * @param {Object} user - Current profile data.
 * @returns {HTMLFormElement}
 */
export function createEditProfileForm(user) {
  const form = document.createElement("form");

  const avatarUrl = typeof user.avatar?.url === "string" ? user.avatar.url : "";
  const avatarAlt = typeof user.avatar?.alt === "string" ? user.avatar.alt : "";
  const bannerUrl = typeof user.banner?.url === "string" ? user.banner.url : "";
  const bannerAlt = typeof user.banner?.alt === "string" ? user.banner.alt : "";

  form.className = "mt-8 space-y-6";
  form.noValidate = true;

  form.innerHTML = `
    <div>
      <label
        for="profile-bio"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Bio <span class="text-neutral-500">(optional)</span>
      </label>

      <textarea
        id="profile-bio"
        name="bio"
        rows="4"
        class="mt-2 w-full resize-y border border-white/15 bg-neutral-950 px-4 py-3 text-white"
      >${user.bio || ""}</textarea>
    </div>

    <div>
      <label
        for="profile-avatar-url"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Avatar URL <span class="text-neutral-500">(optional)</span>
      </label>

      <input
        id="profile-avatar-url"
        name="avatarUrl"
        type="url"
        value="${avatarUrl}"
        class="mt-2 w-full border border-white/15 bg-neutral-950 px-4 py-3 text-white"
      />

      <p
        class="mt-2 min-h-5 text-sm text-red-400"
        data-error-for="avatarUrl"
        aria-live="polite"
      ></p>
    </div>

    <div>
      <label
        for="profile-avatar-alt"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Avatar description <span class="text-neutral-500">(optional)</span>
      </label>

      <input
        id="profile-avatar-alt"
        name="avatarAlt"
        type="text"
        value="${avatarAlt}"
        class="mt-2 w-full border border-white/15 bg-neutral-950 px-4 py-3 text-white"
      />
    </div>

    <div>
      <label
        for="profile-banner-url"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Banner URL <span class="text-neutral-500">(optional)</span>
      </label>

      <input
        id="profile-banner-url"
        name="bannerUrl"
        type="url"
        value="${bannerUrl}"
        class="mt-2 w-full border border-white/15 bg-neutral-950 px-4 py-3 text-white"
      />

      <p
        class="mt-2 min-h-5 text-sm text-red-400"
        data-error-for="bannerUrl"
        aria-live="polite"
      ></p>
    </div>

    <div>
      <label
        for="profile-banner-alt"
        class="block font-mono text-sm uppercase text-neutral-400"
      >
        Banner description <span class="text-neutral-500">(optional)</span>
      </label>

      <input
        id="profile-banner-alt"
        name="bannerAlt"
        type="text"
        value="${bannerAlt}"
        class="mt-2 w-full border border-white/15 bg-neutral-950 px-4 py-3 text-white"
      />
    </div>

    <p
      class="min-h-5 text-sm text-red-400"
      data-error-for="form"
      aria-live="polite"
    ></p>

    <div class="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
      <button
        type="submit"
        class="min-h-12 bg-(--color-primary) px-8 font-mono font-semibold uppercase text-black"
      >
        Save changes
      </button>

      <button
        type="button"
        data-cancel-edit-profile
        class="min-h-12 border border-white/15 px-8 font-mono uppercase text-neutral-300"
      >
        Cancel
      </button>
    </div>
  `;

  return form;
}
