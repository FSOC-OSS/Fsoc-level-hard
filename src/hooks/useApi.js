import { useCallback } from "react";
import { logError, logInfo } from "../utils/logger";
import { useToast } from "../components/ToastProvider";

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRIES = 3;
const RETRY_DELAY = 1200;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCacheKey = (key) => `fsoc-cache:${key}`;

const readCache = (cacheKey) => {
    if (!cacheKey) return null;
    try {
        const raw = localStorage.getItem(getCacheKey(cacheKey));
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (error) {
        console.warn("Failed to read cache", error);
        return null;
    }
};

const writeCache = (cacheKey, payload) => {
    if (!cacheKey) return;
    try {
        const data = JSON.stringify({ payload, savedAt: Date.now() });
        localStorage.setItem(getCacheKey(cacheKey), data);
    } catch (error) {
        console.warn("Failed to write cache", error);
    }
};

const formatHttpError = (status) => {
    if (status >= 500) return "The server is having trouble right now. Please try again shortly.";
    if (status === 404) return "We couldn't find what you were looking for.";
    if (status === 401 || status === 403) return "You don't have permission to do that.";
    if (status === 429) return "Too many requests. Let's slow down for a moment.";
    return "Something went wrong with the request.";
};

class ApiError extends Error {
    constructor(message, { status, code, details } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export const useApi = () => {
    const { showToast } = useToast();

    const request = useCallback(
        async (
            url,
            fetchOptions = {},
            {
                retries = DEFAULT_RETRIES,
                retryDelay = RETRY_DELAY,
                timeout = DEFAULT_TIMEOUT,
                parseJson = true,
                cacheKey,
                cacheStrategy = "network-first",
                description,
                toastOnSuccess,
                autoRetryLabel = "Retry",
            } = {},
        ) => {
            const context = { url, description };
            const execute = async () => {
                let attempt = 0;
                let lastError;

                const cached = cacheKey ? readCache(cacheKey) : null;
                const shouldUseCacheFirst = cacheStrategy === "cache-first" && cached;

                if (shouldUseCacheFirst) {
                    logInfo("Serving response from cache", { cacheKey });
                    return { data: cached.payload, status: 200, fromCache: true };
                }

                while (attempt <= retries) {
                    const controller = new AbortController();
                    const id = setTimeout(() => controller.abort(), timeout);
                    try {
                        if (attempt > 0) {
                            await sleep(retryDelay * Math.pow(2, attempt - 1));
                        }

                        if (typeof navigator !== "undefined" && !navigator.onLine) {
                            throw new ApiError("You appear to be offline.", { code: "NETWORK" });
                        }

                        const response = await fetch(url, {
                            ...fetchOptions,
                            signal: controller.signal,
                        });
                        clearTimeout(id);

                        if (!response.ok) {
                            const message = formatHttpError(response.status);
                            throw new ApiError(message, {
                                status: response.status,
                                code: "HTTP_ERROR",
                                details: { statusText: response.statusText },
                            });
                        }

                        const data = parseJson ? await response.json() : await response.text();

                        if (cacheKey) {
                            writeCache(cacheKey, data);
                        }

                        if (toastOnSuccess) {
                            showToast({ type: "success", message: toastOnSuccess });
                        }

                        return {
                            data,
                            status: response.status,
                            fromCache: false,
                        };
                    } catch (error) {
                        clearTimeout(id);
                        lastError = error;
                        const isAbort = error?.name === "AbortError";

                        if (isAbort) {
                            lastError = new ApiError("The request timed out. Please try again.", {
                                code: "TIMEOUT",
                            });
                        } else if (error?.code === "NETWORK") {
                            if (cacheKey && cached?.payload) {
                                logInfo("Using cached response due to offline mode", { cacheKey });
                                showToast({
                                    type: "warning",
                                    message: "You're offline. Showing the latest saved data.",
                                });
                                return {
                                    data: cached.payload,
                                    status: 200,
                                    fromCache: true,
                                };
                            }
                        }

                        const isRetriable =
                            error?.code === "NETWORK" ||
                            error?.code === "TIMEOUT" ||
                            (error?.code === "HTTP_ERROR" && error?.status >= 500);

                        if (!isRetriable || attempt === retries) {
                            const logged = logError(error, { ...context, attempt });
                            showToast({
                                type: "error",
                                message: error?.message || "We hit a snag. Please try again.",
                                actionLabel: autoRetryLabel,
                                onAction: () => {
                                    execute().catch(() => {
                                        /* Swallow retry errors, primary call will surface them */
                                    });
                                },
                            });
                            throw new ApiError(logged.message, {
                                status: error?.status,
                                code: error?.code,
                                details: error,
                            });
                        }
                    }
                    attempt += 1;
                }

                throw lastError || new ApiError("Unknown request error", { details: context });
            };

            return execute();
        },
        [showToast],
    );

    return {
        request,
    };
};

export { ApiError };
