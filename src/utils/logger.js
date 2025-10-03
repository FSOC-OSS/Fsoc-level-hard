const redactedKeys = ["password", "token", "authorization", "authToken"];

const sanitizeContext = (context = {}) => {
    const clone = {};
    Object.entries(context).forEach(([key, value]) => {
        if (redactedKeys.includes(key.toLowerCase())) {
            clone[key] = "[redacted]";
        } else if (typeof value === "object" && value !== null) {
            clone[key] = sanitizeContext(value);
        } else {
            clone[key] = value;
        }
    });
    return clone;
};

export class LoggedError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = options.name || "LoggedError";
        this.stack = options.stack || this.stack;
        this.context = options.context || {};
    }
}

export const logError = (error, context = {}, info) => {
    const timestamp = new Date().toISOString();
    const sanitizedContext = sanitizeContext(context);
    const payload = {
        message: error?.message || "Unknown error",
        stack: error?.stack,
        context: sanitizedContext,
        info,
        timestamp,
    };

    /*
     * TODO: Integrate with remote logging/telemetry service
     * e.g., Sentry, LogRocket, Datadog. The payload above is structured
     * tomake that drop-in straightforward.
     */
    console.error(`[${timestamp}] Application error`, payload);
    return new LoggedError(payload.message, {
        stack: payload.stack,
        context: payload.context,
    });
};

export const logWarning = (message, context = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] Warning`, sanitizeContext({ message, ...context }));
};

export const logInfo = (message, context = {}) => {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] Info`, sanitizeContext({ message, ...context }));
};
