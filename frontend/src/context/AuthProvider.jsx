import { useEffect, useState } from "react";
import { tokenStorage } from "../api/client";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Only "loading" if there is a saved token to check; otherwise we already know: logged out
  const [loading, setLoading] = useState(() => !!tokenStorage.get());

  // On page load: if a token was saved, ask the backend who it belongs to
  useEffect(() => {
    if (!tokenStorage.get()) return;
    authService
      .getMe()
      .then(setUser)
      .catch(() => tokenStorage.clear()) // expired or invalid token
      .finally(() => setLoading(false));
  }, []);

  // Called after login, OTP verification, and (later) Google login
  function saveLogin(token, userData) {
    tokenStorage.set(token);
    setUser(userData);
  }

  function logout() {
    tokenStorage.clear();
    setUser(null);
  }

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === "ADMIN",
    saveLogin,
    logout,
    setUser, // e.g. after editing your profile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
