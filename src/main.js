import "./tailwind.css";
import "./global.css";
import "./variables.css";

import { Hero } from "./components/hero/hero.js";
import { renderHeader } from "./components/header/header.js";
import { createSearchBar } from "./components/search-bar/search-bar.js";

renderHeader();

const app = document.querySelector("#app");

app.append(Hero());
app.append(createSearchBar());
