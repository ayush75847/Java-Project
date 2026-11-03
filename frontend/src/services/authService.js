import api from "../api/client";

// MODEL layer: every call to /api/auth lives here, nowhere else.
// Each function returns the "data" part of our { success, message, data } response.
// Errors are NOT caught here: the page that called it decides what to show.

export const authService = {
  async register({ username, email, password }) {
    const res = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return res.data.data; // the new user
  },

  async verifyOtp(email, otp) {
    const res = await api.post("/api/auth/verify-otp", { email, otp });
    return res.data.data; // { token, user }
  },

  async resendOtp(email) {
    await api.post("/api/auth/resend-otp", { email });
  },

  async login(email, password) {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data.data; // { token, user }
  },

  async getMe() {
    const res = await api.get("/api/auth/me");
    return res.data.data; // the logged-in user
  },

  googleLoginUrl: `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`,
};
