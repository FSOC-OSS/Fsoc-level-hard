import { useCallback, useEffect, useRef, useState } from "react";

const now = () => new Date().toISOString();

export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(() =>
        typeof navigator !== "undefined" ? navigator.onLine : true,
    );
    const [lastChangedAt, setLastChangedAt] = useState(now);
    const offlineCallbacksRef = useRef([]);
    const onlineCallbacksRef = useRef([]);

    const runCallbacks = (callbacks) => {
        callbacks.current.forEach((cb) => {
            try {
                cb();
            } catch (error) {
                console.error("Network status callback failed", error);
            }
        });
        callbacks.current = [];
    };

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setLastChangedAt(now());
            runCallbacks(onlineCallbacksRef);
        };
        const handleOffline = () => {
            setIsOnline(false);
            setLastChangedAt(now());
            runCallbacks(offlineCallbacksRef);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const whenOnline = useCallback((callback) => {
        if (typeof callback !== "function") return () => { };
        if (isOnline) {
            callback();
            return () => { };
        }
        onlineCallbacksRef.current.push(callback);
        return () => {
            onlineCallbacksRef.current = onlineCallbacksRef.current.filter(
                (cb) => cb !== callback,
            );
        };
    }, [isOnline]);

    const whenOffline = useCallback((callback) => {
        if (typeof callback !== "function") return () => { };
        if (!isOnline) {
            callback();
            return () => { };
        }
        offlineCallbacksRef.current.push(callback);
        return () => {
            offlineCallbacksRef.current = offlineCallbacksRef.current.filter(
                (cb) => cb !== callback,
            );
        };
    }, [isOnline]);

    return {
        isOnline,
        lastChangedAt,
        whenOnline,
        whenOffline,
    };
};
