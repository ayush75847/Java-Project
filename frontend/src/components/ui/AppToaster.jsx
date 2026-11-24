import { Toaster } from "sonner";

// Where all notifications appear. Put ONCE at the top of the app (main.jsx).
// Anywhere else:  import { toast } from "sonner";  then
//   toast.success("Post published")   toast.error("...")   toast.info("...")   toast.warning("...")
//
// Rule of thumb in Inkly:
//   - an action finished (login, publish, delete...) -> toast.success
//   - an action failed (delete, hide, upload...)     -> toast.error with the backend's message
//   - a mistake in a form field                     -> red text under the field, NOT a toast
export default function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      offset={{ top: 76 }} // just below the 64px navbar
      mobileOffset={{ top: 72 }}
      closeButton
      visibleToasts={4}
      duration={4000}
      toastOptions={{
        // Our own colours instead of Sonner's (see .inkly-toast in index.css)
        className: "inkly-toast",
      }}
    />
  );
}
