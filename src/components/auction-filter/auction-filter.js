/**
 * Updates the visible result counts in the auction filter.
 *
 * @param {HTMLElement} filterNav - Auction filter navigation element.
 * @param {Record<string, number>} counts - Counts keyed by filter name.
 * @returns {void}
 */
export function updateAuctionFilterCounts(filterNav, counts) {
  Object.entries(counts).forEach(([filterName, count]) => {
    const countElement = filterNav.querySelector(
      `[data-filter-count="${filterName}"]`
    );

    if (countElement) {
      countElement.textContent = `(${count})`;
    }
  });
}

/**
 * Resets the auction filter to All Lots.
 *
 * @param {HTMLElement} filterNav - Auction filter navigation element.
 * @returns {void}
 */
export function resetAuctionFilter(filterNav) {
  const allLotsButton = filterNav.querySelector('[data-filter="all"]');

  allLotsButton?.click();
}

/**
 * Creates the landing-page auction filter navigation.
 *
 * @param {(filterName: string) => void} [onFilterChange] - Runs when the
 * active filter changes.
 * @returns {HTMLElement} The auction filter navigation.
 * @throws {TypeError} When onFilterChange is not a function.
 */
export function createAuctionFilter(onFilterChange = () => {}) {
  if (typeof onFilterChange !== "function") {
    throw new TypeError(
      "createAuctionFilter requires a valid callback function."
    );
  }

  const filterNav = document.createElement("nav");

  filterNav.className = "mx-4 mt-16 sm:mx-6 lg:mx-10";
  filterNav.setAttribute("aria-label", "Filter auction listings");

  filterNav.innerHTML = `
    <div class="grid w-full grid-cols-2 gap-2 md:flex md:gap-0 md:border-b md:border-white/10">
      <button
        type="button"
        data-filter="all"
        aria-pressed="true"
        class="border border-amber-500 px-4 py-4 font-mono font-medium uppercase tracking-wider text-amber-500 md:border-x-0 md:border-t-0 md:border-b-2 md:px-6"
      >
        All Lots
        <span data-filter-count="all">(0)</span>
      </button>

      <button
        type="button"
        data-filter="ending"
        aria-pressed="false"
        class="border border-white/10 px-4 py-4 font-mono font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white md:border-x-0 md:border-t-0 md:border-b-2 md:border-transparent md:px-6"
      >
        Ending Soon
        <span data-filter-count="ending">(0)</span>
      </button>

      <button
        type="button"
        data-filter="hot"
        aria-pressed="false"
        class="border border-white/10 px-4 py-4 font-mono font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white md:border-x-0 md:border-t-0 md:border-b-2 md:border-transparent md:px-6"
      >
        Hot
        <span data-filter-count="hot">(0)</span>
      </button>

      <button
        type="button"
        data-filter="new"
        aria-pressed="false"
        class="border border-white/10 px-4 py-4 font-mono font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white md:border-x-0 md:border-t-0 md:border-b-2 md:border-transparent md:px-6"
      >
        New Arrivals
        <span data-filter-count="new">(0)</span>
      </button>
    </div>
  `;

  const filterButtons = filterNav.querySelectorAll("[data-filter]");

  function activateFilter(activeButton) {
    filterButtons.forEach((button) => {
      button.classList.remove("text-amber-500", "border-amber-500");
      button.classList.add(
        "text-neutral-400",
        "border-white/10",
        "md:border-transparent"
      );
      button.setAttribute("aria-pressed", "false");
    });

    activeButton.classList.remove(
      "text-neutral-400",
      "border-white/10",
      "md:border-transparent"
    );
    activeButton.classList.add("text-amber-500", "border-amber-500");
    activeButton.setAttribute("aria-pressed", "true");

    onFilterChange(activeButton.dataset.filter);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateFilter(button);
    });
  });

  return filterNav;
}
