import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Mia_stubb-olsen_SP2_MAR25FT/",
  plugins: [tailwindcss()],
  input: {
    main: resolve(import.meta.dirname, "index.html"),
    login: resolve(import.meta.dirname, "login/index.html"),
    register: resolve(import.meta.dirname, "register/index.html"),
  },
});
