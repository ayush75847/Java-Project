export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface-raised p-8 shadow-2xl shadow-black/50">
        {/* thin orange accent line on top of the card */}
        <div className="-mx-8 -mt-8 h-1 rounded-t-2xl bg-linear-to-r from-brand-600 via-brand-400 to-brand-600" />
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
        </div>
        {children}
        {footer && (
          <div className="text-center text-sm text-ink-muted">{footer}</div>
        )}
      </div>
    </div>
  );
}
