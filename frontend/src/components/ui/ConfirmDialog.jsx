import { useEffect, useRef } from "react";
import Button from "./Button";

// "Are you sure?" popup, built on the browser's own <dialog>:
// it already traps focus, darkens the page and closes on Escape.
//
// <ConfirmDialog open={...} title="Delete post?" confirmLabel="Delete"
//   onConfirm={...} onCancel={...} loading={...}>Text</ConfirmDialog>
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Confirm",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  // Keep the real <dialog> in sync with the "open" prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      // Escape key: the browser closes it, we tell the parent (unless a request is running)
      onCancel={(e) => {
        e.preventDefault();
        if (!loading) onCancel();
      }}
      // Click on the dark area outside the box
      onClick={(e) => {
        if (e.target === dialogRef.current && !loading) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-line bg-surface-raised p-0 text-ink shadow-2xl shadow-black/60 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="space-y-4 p-6">
        <h2 className="text-lg font-bold">{title}</h2>
        {children && <div className="text-sm text-ink-muted">{children}</div>}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
