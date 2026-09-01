import "../../tailwind.css";
import "../../global.css";
import "../../variables.css";

import { renderHeader } from "../../components/header/header.js";
import { createProfile } from "../../components/profile/profile.js";
import { requireAuth } from "../../utils/auth-guard.js";

const session = requireAuth();

if (session) {
  renderHeader();

  const app = document.querySelector("#app");

  app?.append(createProfile(session));
}
