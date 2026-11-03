import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/client";
import { useAuth } from "../hooks/useAuth";

// Temporary home page: proves the frontend can talk to the backend (the real feed comes in 9.5)
export default function Home() {
  const { user } = useAuth();
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    api
      .get("/api/posts")
      .then((res) =>
        setStatus(
          `✅ Backend connected: ${res.data.data.length} post(s) in the feed`,
        ),
      )
      .catch((err) => setStatus(`❌ ${getErrorMessage(err)}`));
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-ink">
        {user ? `Welcome, ${user.username} 👋` : "Welcome to Inkly"}
      </h1>
      <p className="text-ink-muted">{status}</p>
    </div>
  );
}
