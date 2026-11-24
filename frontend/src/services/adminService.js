import api from "../api/client";

// MODEL layer: every call to /api/admin lives here (the backend only lets ADMINs in).
// Deleting a post uses the normal postService.remove: admins are allowed to delete any post.

export const adminService = {
  // Every user, newest first: { id, username, email, role, provider, verified, createdAt }
  async getUsers() {
    const res = await api.get("/api/admin/users");
    return res.data.data;
  },

  // Every post, published AND hidden, newest first
  async getPosts() {
    const res = await api.get("/api/admin/posts");
    return res.data.data;
  },

  // role: "ADMIN" or "USER". You can't change your own role (the backend refuses).
  async changeRole(userId, role) {
    const res = await api.put(`/api/admin/users/${userId}/role`, { role });
    return res.data.data;
  },
};
