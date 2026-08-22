import gavelIcon from "../../assets/icons/gavel.svg";
import loginIcon from "../../assets/icons/right-arrow.svg";
import registerIcon from "../../assets/icons/user-plus.svg";
import { routes } from "../../utils/routes.js";

const html = String.raw;

export function renderHeader() {
  const header = document.querySelector("#site-header");

  header.innerHTML = html`
    <nav
      class="grid grid-cols-[auto_1fr_auto] items-center px-4 py-5 sm:px-6 lg:px-4 xl:px-10"
      aria-label="Main navigation"
    >
      <!-- Brand -->
      <a
        href="${routes.home}"
        class="col-start-1 flex shrink-0 items-center gap-3 whitespace-nowrap text-lg font-bold uppercase tracking-widest xl:text-xl"
      >
        <img src="${gavelIcon}" alt="" class="h-6 w-6" aria-hidden="true" />
        <span>Provenance</span>
      </a>

      <!-- Desktop navigation -->
      <div
        class="col-start-2 hidden items-center justify-self-center gap-4 whitespace-nowrap lg:flex xl:gap-8"
      >
        <a
          href="#"
          class="text-base uppercase tracking-wider text-amber-400 xl:text-lg"
        >
          Discover
        </a>

        <a
          href="#"
          class="text-base uppercase tracking-wider text-amber-400 xl:text-lg"
        >
          Ending Soon
        </a>

        <a
          href="#"
          class="text-base uppercase tracking-wider text-amber-400 xl:text-lg"
        >
          Collections
        </a>

        <a
          href="#"
          class="text-base uppercase tracking-wider text-(--color-text) xl:text-lg"
        >
          Sell
        </a>
      </div>

      <!-- Right-side controls -->
      <div
        class="col-start-3 flex shrink-0 items-center justify-self-end gap-5"
      >
        <!-- Authentication -->
        <div class="hidden shrink-0 items-center gap-2 md:flex xl:gap-3">
          <a
            href="${routes.login}"
            class="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap border border-neutral-700 px-4 text-base uppercase tracking-wider text-(--color-text) xl:px-6 xl:text-lg"
          >
            <img src="${loginIcon}" alt="" class="h-4 w-4" aria-hidden="true" />
            Log In
          </a>

          <a
            href="${routes.register}"
            class="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-(--color-primary) px-4 text-base uppercase tracking-wider text-black xl:px-6 xl:text-lg"
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

        <!-- Mobile and tablet menu button -->
        <button
          type="button"
          id="menu-button"
          class="flex h-11 w-11 shrink-0 items-center justify-center lg:hidden"
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
      </div>
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

        <div
          class="grid grid-cols-2 gap-2 border-t border-neutral-800 pt-5 md:hidden"
        >
          <a
            href="${routes.login}"
            class="flex h-13 items-center justify-center gap-2 border border-neutral-700 text-base uppercase tracking-wider text-(--color-text)"
          >
            <img src="${loginIcon}" alt="" class="h-4 w-4" aria-hidden="true" />
            Log In
          </a>

          <a
            href="${routes.register}"
            class="flex h-13 items-center justify-center gap-2 bg-(--color-primary) text-base uppercase tracking-wider text-black"
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
