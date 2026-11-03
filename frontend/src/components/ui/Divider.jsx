// A horizontal line with a word in the middle: ──── or ────
export default function Divider({ children = "or" }) {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-ink-subtle">
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
