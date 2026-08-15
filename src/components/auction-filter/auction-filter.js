export function createAuctionFilter() {
  const filterNav = document.createElement("nav");

  filterNav.className = "mx-4 mt-16 sm:mx-6 lg:mx-10";

  filterNav.innerHTML = `
    <div class="grid w-full grid-cols-2 gap-2 md:flex md:gap-0 md:border-b md:border-white/10">
      <button
  type="button"
  data-filter="all"
  class="border border-amber-500 px-4 py-4 font-mono font-medium uppercase tracking-wider text-amber-500 md:border-x-0 md:border-t-0 md:border-b-2 md:px-6"
>
  All Lots <span>(8)</span>
</button>

      <button
  type="button"
  data-filter="ending"
  class="border border-white/10 px-4 py-4 font-mono font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white md:border-x-0 md:border-t-0 md:border-b-2 md:border-transparent md:px-6"
>
  Ending Soon <span>(3)</span>
</button>

      <button
  type="button"
  data-filter="hot"
class="border border-white/10 px-4 py-4 font-mono font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white md:border-x-0 md:border-t-0 md:border-b-2 md:border-transparent md:px-6"
>
  Hot <span>(4)</span>
</button>

      <button
  type="button"
  data-filter="new"
  class="border border-white/10 px-4 py-4 font-mono font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white md:border-x-0 md:border-t-0 md:border-b-2 md:border-transparent md:px-6"
>
  New Arrivals <span>(8)</span>
</button>
    </div>
  `;
  const filterButtons = filterNav.querySelectorAll("[data-filter]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.remove("text-amber-500", "border-amber-500");
        item.classList.add("text-neutral-400", "border-transparent");
      });

      button.classList.remove("text-neutral-400", "border-transparent");
      button.classList.add("text-amber-500", "border-amber-500");
    });
  });

  return filterNav;
}
