import { Route, Routes, useParams } from "react-router";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import ComingSoon from "./pages/ComingSoon";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OAuthCallback from "./pages/OAuthCallback";
import PostEditor from "./pages/PostEditor";
import PostPage from "./pages/PostPage";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";

// The map of the app: every URL and the page it shows
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public: anyone can see these */}
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/users/:id" element={<ComingSoon title="Profile" />} />
        {/* Google sends the user back here (for anyone, logged in or not) */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Only for logged-OUT users */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyOtp />} />
        </Route>

        {/* Only for logged-IN users (not logged in -> sent to /login, then back here) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/write" element={<PostEditor />} />
          {/* key: a fresh editor per post, so its form never shows another post's data */}
          <Route path="/posts/:id/edit" element={<EditRoute />} />
          <Route path="/my-posts" element={<ComingSoon title="My posts" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
        </Route>

        {/* Only for admins */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<ComingSoon title="Admin dashboard" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function EditRoute() {
  const { id } = useParams();
  return <PostEditor key={id} />;
}
