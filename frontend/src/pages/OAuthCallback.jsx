import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { tokenStorage } from "../api/client";
import AuthCard from "../components/AuthCard";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

// The backend sends us here after Google: /oauth/callback#token=...  or  #error=...
function readFromUrl() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return { token: params.get("token"), error: params.get("error") };
}

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { saveLogin } = useAuth();
  const [{ token, error: urlError }] = useState(readFromUrl); // read once, on first render
  const [error, setError] = useState(
    urlError || (token ? "" : "Sign-in details are missing"),
  );
  const started = useRef(false); // React runs effects twice in development: only log in once

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;

    // Remove the token from the address bar (and from the browser history)
    window.history.replaceState(null, "", window.location.pathname);

    tokenStorage.set(token);
    authService
      .getMe()
      .then((user) => {
        saveLogin(token, user);
        navigate("/", { replace: true });
      })
      .catch(() => {
        tokenStorage.clear();
        setError("Google sign-in failed. Please try again");
      });
  }, [token, navigate, saveLogin]);

  if (error) {
    return (
      <AuthCard title="Sign-in didn't work">
        <Alert type="error">{error}</Alert>
        <Link
          to="/login"
          className="block text-center font-medium text-brand-400 hover:text-brand-300 hover:underline"
        >
          Back to log in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Signing you in..." subtitle="Just a moment">
      <div className="flex justify-center text-brand-500">
        <Spinner className="h-8 w-8" />
      </div>
    </AuthCard>
  );
}
