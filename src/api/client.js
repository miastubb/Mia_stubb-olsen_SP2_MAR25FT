import { API_BASE_URL } from "./config.js";
import { getSession } from "../utils/session-storage.js";

/**
 * @typedef {object} ApiResponse
 * @property {unknown} [data]
 * @property {Array<{message?: string}>} [errors]
 * @property {Record<string, unknown>} [meta]
 */

/**
 * @typedef {object} ApiRequestOptions
 * @property {string} endpoint
 * @property {string} [method]
 * @property {unknown} [body]
 * @property {boolean} [auth]
 * @property {string} [token]
 * @property {string} [apiKey]
 */

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {unknown} [details]
   */
  constructor(message, status, details = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Returns authentication headers from supplied credentials or the current session.
 *
 * @param {string} [token]
 * @param {string} [apiKey]
 * @returns {Record<string, string>}
 */
function getAuthHeaders(token, apiKey) {
  const session =
    token === undefined && apiKey === undefined ? getSession() : null;

  const authToken = token ?? session?.token;
  const authApiKey = apiKey ?? session?.apiKey;

  /** @type {Record<string, string>} */
  const headers = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (authApiKey) {
    headers["X-Noroff-API-Key"] = authApiKey;
  }

  return headers;
}

/**
 * Safely parses a JSON response.
 *
 * @param {Response} response
 * @returns {Promise<ApiResponse|null>}
 */
async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Sends a request to the Noroff API.
 *
 * @param {ApiRequestOptions} options
 * @returns {Promise<ApiResponse|null>}
 */
export async function apiRequest({
  endpoint,
  method = "GET",
  body,
  auth = false,
  token,
  apiKey,
}) {
  /** @type {Record<string, string>} */
  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    Object.assign(headers, getAuthHeaders(token, apiKey));
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      ...(body !== undefined && {
        body: JSON.stringify(body),
      }),
    });
  } catch (error) {
    throw new ApiError("Unable to connect to the API.", 0, error);
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message ??
      `API request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, data);
  }

  return data;
}
