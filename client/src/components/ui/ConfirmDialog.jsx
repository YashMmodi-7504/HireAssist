import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiAlertCircle, FiHelpCircle } from "react-icons/fi";

const ConfirmContext = createContext({
  confirm: () => Promise.resolve(false),
});

export const useConfirm = () => useContext(ConfirmContext);

const variantConfig = {
  default: {
    icon: FiHelpCircle,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    confirmBtn:
      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
  },
  danger: {
    icon: FiAlertCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    confirmBtn: "bg-red-600 hover:bg-red-700",
  },
};

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({ open: false });
  const resolveRef = useRef(null);

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        open: true,
        title: opts.title || "Are you sure?",
        message: opts.message || "",
        confirmLabel: opts.confirmLabel || "Confirm",
        cancelLabel: opts.cancelLabel || "Cancel",
        variant: opts.variant || "default",
      });
    });
  }, []);

  const settle = useCallback((ok) => {
    setState((prev) => ({ ...prev, open: false }));
    if (resolveRef.current) {
      resolveRef.current(ok);
      resolveRef.current = null;
    }
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!state.open) return undefined;
    const handler = (e) => {
      if (e.key === "Escape") settle(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.open, settle]);

  const cfg = variantConfig[state.variant] || variantConfig.default;
  const Icon = cfg.icon;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.open && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_180ms_ease-out]"
            onClick={() => settle(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 animate-[fadeIn_220ms_ease-out]">
            <div className="flex items-start gap-3 mb-5">
              <div
                className={`p-2.5 rounded-xl flex-shrink-0 ${cfg.iconBg} ${cfg.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  id="confirm-dialog-title"
                  className="text-base font-semibold text-gray-900"
                >
                  {state.title}
                </h3>
                {state.message && (
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => settle(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
              >
                {state.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => settle(true)}
                autoFocus
                className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-sm active:scale-[0.98] transition-all duration-200 ${cfg.confirmBtn}`}
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
