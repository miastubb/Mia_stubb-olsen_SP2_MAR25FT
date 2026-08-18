import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * @typedef {object} RegistrationDetails
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * Sends a registration request.
 * @param {RegistrationDetails} userDetails
 */
export async function registerUser(userDetails) {
  return apiRequest({
    endpoint: API_ENDPOINTS.auth.register,
    method: "POST",
    body: userDetails,
  });
}
