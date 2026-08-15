export function Hero() {
  const hero = document.createElement("section");

  hero.className = "mx-auto max-w-7xl px-5 pt-32 pb-14 md:px-8";

  hero.innerHTML = `
    <div class="max-w-4xl">
      <div class="mb-5 flex items-center gap-2.5">
        <span
          class="h-2 w-2 animate-pulse rounded-full bg-red-500"
          aria-hidden="true"
        ></span>
        <p
          class="font-mono text-base tracking-widest uppercase text-(--color-primary)"
        >
          Live — <span data-current-date></span>
        </p>
      </div>

      <h1 class="text-5xl leading-[1.04] sm:text-6xl md:text-7xl">
        Bid on the
        <span class="italic text-(--color-primary)">extraordinary.</span>
      </h1>
    </div>
  `;

  const dateElement = hero.querySelector("[data-current-date]");

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  dateElement.textContent = formattedDate;

  return hero;
}
