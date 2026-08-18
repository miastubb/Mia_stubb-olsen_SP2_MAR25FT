import { API_BASE_URL } from "./config.js";

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
 * Returns authentication headers from local storage.
 * @returns {Record<string, string>}
 */
function getAuthHeaders() {
  const accessToken = globalThis.localStorage.getItem("accessToken");
  const apiKey = globalThis.localStorage.getItem("apiKey");

  /** @type {Record<string, string>} */
  const headers = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (apiKey) {
    headers["X-Noroff-API-Key"] = apiKey;
  }

  return headers;
}

/**
 * Safely parses a JSON response.
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
 * @param {ApiRequestOptions} options
 * @returns {Promise<ApiResponse|null>}
 */
export async function apiRequest({
  endpoint,
  method = "GET",
  body,
  auth = false,
}) {
  /** @type {Record<string, string>} */
  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    Object.assign(headers, getAuthHeaders());
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
