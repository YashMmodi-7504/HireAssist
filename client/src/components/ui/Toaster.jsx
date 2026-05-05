import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext({
  toast: () => {},
  dismiss: () => {},
});

export const useToast = () => useContext(ToastContext);

const variantConfig = {
  success: {
    icon: FiCheckCircle,
    bg: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
  },
  error: {
    icon: FiAlertCircle,
    bg: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
  },
  info: {
    icon: FiInfo,
    bg: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (opts = {}) => {
      const id = `${Date.now()}-${Math.random()}`;
      const t = {
        id,
        variant: "success",
        duration: 3500,
        ...opts,
      };
      setToasts((prev) => [...prev, t]);
      if (t.duration > 0) {
        setTimeout(() => dismiss(id), t.duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none w-80 max-w-[calc(100vw-2rem)]"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => {
          const cfg = variantConfig[t.variant] || variantConfig.success;
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-md ${cfg.bg} animate-[toastIn_220ms_ease-out]`}
            >
              <Icon className={`w-5 h-5 ${cfg.iconColor} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {t.title}
                  </p>
                )}
                {t.message && (
                  <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="p-0.5 rounded text-gray-400 hover:text-gray-700 hover:bg-white/60 transition-colors"
                aria-label="Dismiss notification"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
