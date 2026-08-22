const baseUrl = import.meta.env.BASE_URL;

export const routes = {
  home: baseUrl,
  login: `${baseUrl}login/`,
  register: `${baseUrl}register/`,
};
