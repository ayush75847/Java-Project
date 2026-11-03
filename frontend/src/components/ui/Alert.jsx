const TYPES = {
  error: "border-danger/40 bg-danger/10 text-danger",
  success: "border-success/40 bg-success/10 text-success",
  info: "border-info/40 bg-info/10 text-info",
};

// Coloured message box. Renders nothing when there is no message.
export default function Alert({ type = "error", children }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className={`rounded-lg border px-3 py-2 text-sm ${TYPES[type]}`}
    >
      {children}
    </div>
  );
}
