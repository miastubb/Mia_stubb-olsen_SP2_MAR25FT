import gavelIcon from "../../assets/icons/gavel.svg";
import loginIcon from "../../assets/icons/right-arrow.svg";
import registerIcon from "../../assets/icons/user-plus.svg";

const html = String.raw;

export function renderHeader() {
  const header = document.querySelector("#site-header");

  header.innerHTML = html`
    <nav
      class="flex items-center justify-between px-4 py-4"
      aria-label="Main navigation"
    >
      <!-- Brand -->
      <a
        href="/"
        class="flex items-center gap-3 font-bold uppercase tracking-widest"
      >
        <img src="${gavelIcon}" alt="" class="h-6 w-6" aria-hidden="true" />
        <span>Provenance</span>
      </a>

      <!-- Desktop navigation -->
      <div class="hidden lg:flex items-center gap-8">
        <a href="#" class="text-base uppercase tracking-wider text-amber-400">
          Discover
        </a>

        <a href="#" class="text-base uppercase tracking-wider text-amber-400">
          Ending Soon
        </a>

        <a href="#" class="text-base uppercase tracking-wider text-amber-400">
          Collections
        </a>

        <a
          href="#"
          class="text-base uppercase tracking-wider text-(--color-text)"
        >
          Sell
        </a>
      </div>

      <!-- Desktop authentication -->
      <div class="hidden items-center gap-3 md:flex">
        <a
          href="/login/"
          class="inline-flex h-11 items-center justify-center gap-2 border border-neutral-700 px-6 text-base uppercase tracking-wider text-(--color-text)"
        >
          <img src="${loginIcon}" alt="" class="h-4 w-4" aria-hidden="true" />
          Log In
        </a>

        <a
          href="/register/"
          class="inline-flex h-11 items-center justify-center gap-2 bg-(--color-primary) px-6 text-base uppercase tracking-wider text-black"
        >
          <img
            src="${registerIcon}"
            alt=""
            class="h-4 w-4"
            aria-hidden="true"
          />
          Register
        </a>
      </div>

      <!-- Mobile menu button -->
      <button
        type="button"
        id="menu-button"
        class="md:hidden"
        aria-label="Open navigation menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <span id="menu-icon" aria-hidden="true">
          <span class="block h-0.5 w-6 bg-current"></span>
          <span class="mt-1.5 block h-0.5 w-6 bg-current"></span>
          <span class="mt-1.5 block h-0.5 w-6 bg-current"></span>
        </span>
      </button>
    </nav>

    <!-- Mobile navigation -->
    <div id="mobile-menu" class="hidden px-4 pb-4 lg:hidden">
      <div class="flex flex-col gap-4">
        <a
          href="#"
          class="text-base uppercase tracking-wider text-(--color-text)"
        >
          Discover
        </a>
        <a
          href="#"
          class="text-base uppercase tracking-wider text-(--color-text)"
        >
          Ending Soon
        </a>
        <a
          href="#"
          class="text-base uppercase tracking-wider text-(--color-text)"
        >
          Collections
        </a>
        <a
          href="#"
          class="text-base uppercase tracking-wider text-(--color-text)"
        >
          Sell
        </a>

        <div class="grid grid-cols-2 gap-2 border-t border-neutral-800 pt-5">
          <a
            href="/login/"
            class="flex h-[52px] items-center justify-center gap-2 border border-neutral-700 text-base uppercase tracking-wider text-(--color-text)"
          >
            <img src="${loginIcon}" alt="" class="h-4 w-4" aria-hidden="true" />
            Log In
          </a>

          <a
            href="/register/"
            class="flex h-[52px] items-center justify-center gap-2 bg-(--color-primary) text-base uppercase tracking-wider text-black"
          >
            <img
              src="${registerIcon}"
              alt=""
              class="h-4 w-4"
              aria-hidden="true"
            />
            Register
          </a>
        </div>
      </div>
    </div>
  `;

  const menuButton = document.querySelector("#menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");
  const menuIcon = document.querySelector("#menu-icon");

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("hidden");

    if (isOpen) {
      menuButton.setAttribute("aria-label", "Open navigation menu");

      menuIcon.innerHTML = `
        <span class="block h-0.5 w-6 bg-current"></span>
        <span class="mt-1.5 block h-0.5 w-6 bg-current"></span>
        <span class="mt-1.5 block h-0.5 w-6 bg-current"></span>
      `;
    } else {
      menuButton.setAttribute("aria-label", "Close navigation menu");

      menuIcon.innerHTML = `
        <span class="block h-0.5 w-6 rotate-45 bg-current"></span>
        <span class="-mt-0.5 block h-0.5 w-6 -rotate-45 bg-current"></span>
      `;
    }
  });
}
