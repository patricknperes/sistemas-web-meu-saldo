import axios from "axios";

export const TOKEN_KEY =
  "finance_manager_token";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "http://localhost:3000/api",

  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        TOKEN_KEY
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status =
      error.response?.status;

    const requestUrl =
      error.config?.url ?? "";

    const isAuthenticationRequest =
      requestUrl.includes(
        "/auth/login"
      ) ||
      requestUrl.includes(
        "/auth/register"
      ) ||
      requestUrl.includes(
        "/auth/google"
      );

    if (
      status === 401 &&
      !isAuthenticationRequest
    ) {
      localStorage.removeItem(
        TOKEN_KEY
      );

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);