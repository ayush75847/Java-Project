export default function FormField({ id, label, error, hint, ...inputProps }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-surface-overlay px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${
          error ? "border-danger" : "border-line-strong"
        }`}
        {...inputProps}
      />
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        hint && <p className="text-xs text-ink-subtle">{hint}</p>
      )}
    </div>
  );
}
