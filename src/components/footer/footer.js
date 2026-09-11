export function renderFooter() {
  const footer = document.querySelector("#site-footer");

  if (!(footer instanceof window.HTMLElement)) {
    return;
  }

  footer.className =
    "border-t border-neutral-900 bg-(--color-background) px-4 py-10 sm:px-6 xl:px-10";

  footer.innerHTML = `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-lg font-bold uppercase tracking-widest text-(--color-text)">
          Provenance
        </p>

        <p class="mt-2 font-mono text-sm uppercase tracking-wider text-neutral-400">
          Curated objects. Open bidding.
        </p>
      </div>

      <div class="font-mono text-sm uppercase tracking-wider text-neutral-500 sm:text-right">
                <p>Semester Project 2 &middot; Noroff</p>
        <p class="mt-2">&copy; 2026 Provenance</p>
      </div>
    </div>
  `;
}
