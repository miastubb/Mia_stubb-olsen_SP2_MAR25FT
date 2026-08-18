import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * @typedef {object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * Sends a login request.
 * @param {LoginCredentials} credentials
 */
export async function loginUser(credentials) {
  return apiRequest({
    endpoint: API_ENDPOINTS.auth.login,
    method: "POST",
    body: credentials,
  });
}
