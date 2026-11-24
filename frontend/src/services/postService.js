import api from "../api/client";

// MODEL layer: every call to /api/posts lives here, nowhere else.
// Each function returns the "data" part of our { success, message, data } response.
// Errors are NOT caught here: the page that called it decides what to show.

export const postService = {
  // Public feed: ACTIVE posts, newest first
  async getFeed() {
    const res = await api.get("/api/posts");
    return res.data.data;
  },

  // One post (the owner and admins can also see INACTIVE ones)
  async getPost(id) {
    const res = await api.get(`/api/posts/${id}`);
    return res.data.data;
  },

  // All of the logged-in user's posts, ACTIVE and INACTIVE
  async getMyPosts() {
    const res = await api.get("/api/posts/my");
    return res.data.data;
  },

  // { title, content, status? } -> the new post
  async create(post) {
    const res = await api.post("/api/posts", post);
    return res.data.data;
  },

  async update(id, post) {
    const res = await api.put(`/api/posts/${id}`, post);
    return res.data.data;
  },

  async remove(id) {
    await api.delete(`/api/posts/${id}`);
  },

  // The backend expects form-data with a field called "image"
  async uploadImage(id, file) {
    const form = new FormData();
    form.append("image", file);
    const res = await api.post(`/api/posts/${id}/image`, form);
    return res.data.data;
  },

  async removeImage(id) {
    const res = await api.delete(`/api/posts/${id}/image`);
    return res.data.data;
  },
};
