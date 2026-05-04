import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

/**
 * Lightweight, accessible modal — no portal lib needed, no dep additions.
 *   - Click outside or press Esc to close
 *   - Body scroll is locked while open
 *   - Smooth fade + slide-in via the existing chat-bubble-in keyframe
 *
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="Details">
 *     ...content...
 *   </Modal>
 */
const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-lg",
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`chat-bubble-in relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden`}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
            <div className="min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 truncate"
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
