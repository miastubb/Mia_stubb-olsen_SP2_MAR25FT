import searchIcon from "../../assets/icons/search.svg";

/**
 * Creates the landing-page listing search.
 *
 * @param {(searchTerm: string) => void} [onSearch] - Runs when a search,
 * popular search, or search reset is submitted.
 * @returns {HTMLFormElement} The completed search form.
 * @throws {TypeError} When onSearch is not a function.
 */
export function createSearchBar(onSearch = () => {}) {
  if (typeof onSearch !== "function") {
    throw new TypeError("createSearchBar requires a valid callback function.");
  }

  const searchBar = document.createElement("form");

  searchBar.className = "mx-4 w-full max-w-[620px] sm:mx-6 lg:mx-10";
  searchBar.setAttribute("role", "search");

  searchBar.innerHTML = `
    <div class="flex w-full border border-white/10 bg-white/10">
      <div class="flex min-w-0 flex-1 items-center gap-3 px-4">
        <img
          src="${searchIcon}"
          alt=""
          aria-hidden="true"
          class="shrink-0 border-l border-white/10 px-3 sm:px-5"
        />

        <input
          id="search-input"
          name="search"
          type="search"
          placeholder="Search listings, artists, categories..."
          aria-label="Search listings"
          class="flex-1 bg-transparent py-4 text-base text-white placeholder:text-neutral-400 outline-none"
        />

        <button
          id="clear-search"
          type="button"
          aria-label="Clear search"
          class="hidden cursor-pointer px-2 text-neutral-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <button
        type="submit"
        class="cursor-pointer border-l border-white/10 px-5 font-mono tracking-wide text-neutral-400 transition-colors hover:text-white"
      >
        Search
      </button>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 pl-4 text-sm">
      <span class="text-neutral-500">Popular:</span>

      <button
        type="button"
        data-popular-search="Watches"
        class="cursor-pointer text-neutral-400 hover:text-white"
      >
        Watches
      </button>

      <button
        type="button"
        data-popular-search="Fine art"
        class="cursor-pointer text-neutral-400 hover:text-white"
      >
        Fine art
      </button>

      <button
        type="button"
        data-popular-search="Sneakers"
        class="cursor-pointer text-neutral-400 hover:text-white"
      >
        Sneakers
      </button>

      <button
        type="button"
        data-popular-search="Vintage"
        class="cursor-pointer text-neutral-400 hover:text-white"
      >
        Vintage
      </button>
    </div>
  `;

  const input = searchBar.querySelector("#search-input");
  const clearButton = searchBar.querySelector("#clear-search");
  const popularSearchButtons = searchBar.querySelectorAll(
    "[data-popular-search]"
  );

  function submitSearch(searchTerm) {
    onSearch(searchTerm.trim());
  }

  input.addEventListener("input", () => {
    clearButton.classList.toggle("hidden", input.value.length === 0);
  });

  searchBar.addEventListener("submit", (event) => {
    event.preventDefault();
    submitSearch(input.value);
  });

  clearButton.addEventListener("click", () => {
    input.value = "";
    clearButton.classList.add("hidden");
    submitSearch("");
    input.focus();
  });

  popularSearchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.popularSearch;
      clearButton.classList.remove("hidden");
      submitSearch(input.value);
    });
  });

  searchBar.addEventListener("reset", () => {
    clearButton.classList.add("hidden");
    submitSearch("");
  });

  return searchBar;
}
