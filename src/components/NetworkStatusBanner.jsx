import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const NetworkStatusBanner = ({ onReconnect }) => {
    const { isOnline, lastChangedAt } = useNetworkStatus();
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOnline) {
            setVisible(true);
        } else if (visible) {
            const timeout = setTimeout(() => setVisible(false), 2500);
            if (typeof onReconnect === "function") {
                onReconnect();
            }
            return () => clearTimeout(timeout);
        }
    }, [isOnline, visible, onReconnect]);

    if (!visible) return null;

    return (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[2000] flex justify-center p-4">
            <div
                className={`pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-lg transition ${isOnline ? "border-emerald-400 bg-emerald-500/90" : "border-rose-400 bg-rose-600/90"}`}
            >
                <div className="flex items-center gap-3 text-white">
                    <span className="text-xl" aria-hidden>
                        {isOnline ? "🛜" : "📡"}
                    </span>
                    <div className="flex flex-col">
                        <strong className="text-sm uppercase tracking-wide">
                            {isOnline ? "Connection restored" : "No internet connection"}
                        </strong>
                        <span className="text-xs opacity-80">
                            {isOnline
                                ? `Back online at ${new Date(lastChangedAt).toLocaleTimeString()}`
                                : "We’ll keep trying automatically. Reconnect to resume."}
                        </span>
                    </div>
                </div>
                {!isOnline && (
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                            Offline
                        </span>
                        <button
                            onClick={() => navigate("/error/network")}
                            className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
                        >
                            View details
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkStatusBanner;
