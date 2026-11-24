import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

// Shared frame for every page: the navbar + the current page below it
export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
