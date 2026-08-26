import "../../tailwind.css";
import "../../global.css";
import "../../variables.css";

import { renderHeader } from "../../components/header/header.js";
import { createLoginForm } from "../../components/login-form/login-form.js";

renderHeader();

const app = document.querySelector("#app");
const searchParams = new window.URLSearchParams(window.location.search);

const loginForm = createLoginForm({
  showRegistrationSuccess: searchParams.get("registration") === "success",
});

app?.append(loginForm);
loginForm.querySelector("[data-registration-success]")?.focus();
