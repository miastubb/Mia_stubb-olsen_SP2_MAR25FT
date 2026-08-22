import "../../tailwind.css";
import "../../global.css";
import "../../variables.css";

import { renderHeader } from "../../components/header/header.js";
import { createRegistrationForm } from "../../components/registration-form/registration-form.js";

renderHeader();

const app = document.querySelector("#app");

app.append(createRegistrationForm());
