import Spinner from "./Spinner";

const VARIANTS = {
  primary:
    "bg-brand-500 text-ink-inverse hover:bg-brand-400 active:bg-brand-600",
  secondary:
    "border border-line-strong bg-surface-overlay text-ink hover:border-brand-500 hover:text-brand-400",
  danger: "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
  link: "text-brand-400 hover:text-brand-300 hover:underline",
};

// One button for the whole app. "loading" shows a spinner and blocks double clicks.
export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  ...props
}) {
  const padding = variant === "link" ? "" : "px-4 py-2.5";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${padding} ${VARIANTS[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
