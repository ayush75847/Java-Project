import api from "../api/client";

// MODEL layer: every call to /api/users lives here, nowhere else.
// Each function returns the "data" part of our { success, message, data } response.

export const userService = {
  // Public profile: { id, username, bio, joinedAt } (no email, no role)
  async getProfile(id) {
    const res = await api.get(`/api/users/${id}`);
    return res.data.data;
  },

  // Someone's PUBLISHED posts, newest first
  async getUserPosts(id) {
    const res = await api.get(`/api/users/${id}/posts`);
    return res.data.data;
  },

  // Your own profile. Send only what changes: { username?, bio? }. bio "" clears it.
  // Returns the full logged-in user (same shape as /api/auth/me)
  async updateMe(changes) {
    const res = await api.put("/api/users/me", changes);
    return res.data.data;
  },
};
