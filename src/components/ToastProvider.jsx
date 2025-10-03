/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);
const TOAST_DURATION = 6000;

const getId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const portalRef = useRef(null);

    useEffect(() => {
        const portal = document.createElement("div");
        portal.setAttribute("id", "toast-root");
        portal.className = "fixed inset-0 pointer-events-none";
        document.body.appendChild(portal);
        portalRef.current = portal;
        return () => {
            portal.remove();
            portalRef.current = null;
        };
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        ({
            type = "info",
            title,
            message,
            actionLabel,
            onAction,
            duration = TOAST_DURATION,
        }) => {
            const id = getId();
            const expiresAt = Date.now() + duration;
            const toast = {
                id,
                type,
                title,
                message,
                actionLabel,
                onAction,
                expiresAt,
            };
            setToasts((current) => [...current, toast]);

            if (duration > 0) {
                setTimeout(() => removeToast(id), duration);
            }

            return id;
        },
        [removeToast],
    );

    const contextValue = useMemo(
        () => ({
            showToast,
            dismissToast: removeToast,
        }),
        [showToast, removeToast],
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {portalRef.current &&
                createPortal(
                    <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-3">
                        {toasts.map((toast) => (
                            <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
                        ))}
                    </div>,
                    portalRef.current,
                )}
        </ToastContext.Provider>
    );
};

const toastStyles = {
    info: "bg-blue-600/95 border-blue-400",
    success: "bg-emerald-600/95 border-emerald-400",
    warning: "bg-amber-600/95 border-amber-400",
    error: "bg-rose-600/95 border-rose-400",
};

const iconMap = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "🚨",
};

const Toast = ({ toast, onDismiss }) => {
    return (
        <div
            className={`pointer-events-auto overflow-hidden rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md transition hover:translate-y-[-1px] ${toastStyles[toast.type] || toastStyles.info}`}
        >
            <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden>
                    {iconMap[toast.type] || iconMap.info}
                </span>
                <div className="flex-1 text-white">
                    {toast.title && (
                        <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                            {toast.title}
                        </p>
                    )}
                    {toast.message && (
                        <p className="text-sm font-medium leading-snug">
                            {toast.message}
                        </p>
                    )}
                    {toast.actionLabel && toast.onAction && (
                        <button
                            onClick={() => {
                                toast.onAction();
                                onDismiss(toast.id);
                            }}
                            className="mt-3 inline-flex items-center rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
                        >
                            {toast.actionLabel}
                        </button>
                    )}
                </div>
                <button
                    onClick={() => onDismiss(toast.id)}
                    className="ml-2 text-lg font-semibold text-white/70 transition hover:text-white"
                    aria-label="Dismiss notification"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
