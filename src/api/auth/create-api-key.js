import { apiRequest } from "../client.js";
import { API_ENDPOINTS } from "../config.js";

/**
 * Creates an API key for authenticated requests.
 * @param {string} [name]
 */
export async function createApiKey(name) {
  return apiRequest({
    endpoint: API_ENDPOINTS.auth.apiKey,
    method: "POST",
    body: name ? { name } : undefined,
    auth: true,
  });
}
