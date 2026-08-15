import searchIcon from "../../assets/icons/search.svg";
export function createSearchBar() {
  const searchBar = document.createElement("form");

  searchBar.className = "mx-4 w-full max-w-[620px] sm:mx-6 lg:mx-10";

  searchBar.innerHTML = `
     <div class="flex w-full border border-white/10 bg-white/10">
      <div class="flex flex-1 items-center gap-3 px-4">
        <img
        src="${searchIcon}"
        alt=""
        aria-hidden="true"
        class="h-5 w-5 shrink-0"
       />

        <input
          id="search-input"
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

      <button type="button" class="cursor-pointer text-neutral-400 hover:text-white">
        Watches
      </button>

      <button type="button" class="cursor-pointer text-neutral-400 hover:text-white">
        Fine art
      </button>

      <button type="button" class="cursor-pointer text-neutral-400 hover:text-white">
        Sneakers
      </button>

      <button type="button" class="cursor-pointer text-neutral-400 hover:text-white">
        Vintage
      </button>
    </div>

  `;
  const input = searchBar.querySelector("#search-input");
  const clearButton = searchBar.querySelector("#clear-search");

  input.addEventListener("input", () => {
    clearButton.classList.toggle("hidden", input.value.length === 0);
  });

  clearButton.addEventListener("click", () => {
    input.value = "";
    clearButton.classList.add("hidden");
    input.focus();
  });
  return searchBar;
}
