import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Creates an API key using a supplied access token.
 *
 * @param {string} token
 * @param {string} [name]
 */
export async function createApiKey(token, name) {
  return apiRequest({
    endpoint: API_ENDPOINTS.auth.apiKey,
    method: "POST",
    body: name ? { name } : undefined,
    auth: true,
    token,
  });
}
