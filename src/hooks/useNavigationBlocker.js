import { useEffect, useRef, useState } from "react";

// Lightweight navigation blocker for back/forward buttons and page unload
export default function useNavigationBlocker(when) {
  const [blocked, setBlocked] = useState(false);
  const allowNextBackRef = useRef(false);
  const lastUrlRef = useRef(typeof window !== "undefined" ? window.location.href : "");

  // Warn on refresh/close
  useEffect(() => {
    const handler = (e) => {
      if (when) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when]);

  // Intercept back/forward
  useEffect(() => {
    const onPop = () => {
      if (!when) return;
      if (allowNextBackRef.current) {
        allowNextBackRef.current = false;
        return; // allow one back to proceed
      }
      // Cancel by restoring current URL
      const current = lastUrlRef.current;
      window.history.pushState(null, "", current);
      setBlocked(true);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [when]);

  useEffect(() => {
    lastUrlRef.current = window.location.href;
  });

  const confirm = () => {
    // Allow one back navigation and trigger it
    allowNextBackRef.current = true;
    setBlocked(false);
    window.history.back();
  };

  const cancel = () => setBlocked(false);

  return { isBlocked: blocked, confirm, cancel };
}
