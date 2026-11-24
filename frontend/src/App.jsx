import { Route, Routes, useParams } from "react-router";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AllPosts from "./pages/AllPosts";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyPosts from "./pages/MyPosts";
import NotFound from "./pages/NotFound";
import OAuthCallback from "./pages/OAuthCallback";
import PostEditor from "./pages/PostEditor";
import PostPage from "./pages/PostPage";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";

// The map of the app: every URL and the page it shows
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public: anyone can see these */}
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts/:id" element={<PostRoute />} />
        <Route path="/users/:id" element={<ProfileRoute />} />
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
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Only for admins */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminDashboard />} />
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

// key: going from one profile to another starts fresh (no old user's data shown)
function ProfileRoute() {
  const { id } = useParams();
  return <Profile key={id} />;
}

// key: opening another post (e.g. from "More from ...") starts fresh, no old post on screen
function PostRoute() {
  const { id } = useParams();
  return <PostPage key={id} />;
}
