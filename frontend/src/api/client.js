import axios from "axios";

const TOKEN_KEY = "inkly_token";

// The token lives in localStorage so the user stays logged in after a refresh
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// One axios instance for the whole app: base URL comes from frontend/.env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Before EVERY request: attach "Authorization: Bearer <token>" if we have one
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Our backend always answers { success, message, data }.
// This turns any failed request into a message we can show the user.
export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.request) return "Cannot reach the server. Is the backend running?";
  return "Something went wrong";
}

export default api;

// The HTTP status of a failed request (e.g. 403, 429), or null if the server never answered
export function getErrorStatus(error) {
  return error.response?.status ?? null;
}
