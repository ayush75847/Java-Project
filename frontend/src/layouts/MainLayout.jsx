import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ScrollToTop from "../components/ScrollToTop";

// Shared frame for every page: navbar on top, the current page, the footer at the bottom
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
