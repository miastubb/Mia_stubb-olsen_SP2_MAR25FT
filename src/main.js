import "./tailwind.css";
import "./global.css";
import "./variables.css";

import { Hero } from "./components/hero/hero.js";
import { renderHeader } from "./components/header/header.js";

renderHeader();

const app = document.querySelector("#app");

app.append(Hero());
