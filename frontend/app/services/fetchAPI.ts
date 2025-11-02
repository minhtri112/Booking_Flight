const API_URL = "http://172.20.41.110:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

const buildQueryString = (params?: Record<string, any>) => {
  if (!params) return "";
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
};

const fetchApi = async (url: string, method: HttpMethod, options: FetchOptions = {}) => {
  const { params, body, headers } = options;

  const fullUrl = `${API_URL}/${url}${buildQueryString(params)}`;

  const config : RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || "API request failed",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const apiService = {
  get: (url: string, params?: any, headers?: any) =>
    fetchApi(url, "GET", { params, headers }),

  post: (url: string, body?: any, headers?: any) =>
    fetchApi(url, "POST", { body, headers }),

  put: (url: string, body?: any, headers?: any) =>
    fetchApi(url, "PUT", { body, headers }),

  patch: (url: string, body?: any, headers?: any) =>
    fetchApi(url, "PATCH", { body, headers }),

  delete: (url: string, headers?: any) =>
    fetchApi(url, "DELETE", { headers }),
};

export default apiService;
