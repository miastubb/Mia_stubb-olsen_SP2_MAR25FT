// src/utils/routes.js

const baseUrl = import.meta.env.BASE_URL;

export const routes = {
  home: baseUrl,
  login: `${baseUrl}login/`,
  register: `${baseUrl}register/`,
  profile: `${baseUrl}profile/`,
  listing: `${baseUrl}listing/`,
};
