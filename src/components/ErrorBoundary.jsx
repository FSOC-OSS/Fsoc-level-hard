import { Component } from "react";
import { logError } from "../utils/logger";

const compareArrays = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    return a.every((value, index) => Object.is(value, b[index]));
};

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        const { label = "Unknown boundary" } = this.props;
        logError(error, { boundary: label }, errorInfo);
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
    }

    componentDidUpdate(prevProps) {
        const { resetKeys } = this.props;
        if (this.state.error && resetKeys && !compareArrays(prevProps.resetKeys, resetKeys)) {
            this.resetErrorBoundary();
        }
    }

    resetErrorBoundary = () => {
        this.props.onReset?.();
        this.setState({ error: null, errorInfo: null });
    };

    render() {
        const { error, errorInfo } = this.state;
        if (error) {
            const { fallback, fallbackRender } = this.props;
            if (typeof fallbackRender === "function") {
                return fallbackRender({ error, errorInfo, resetErrorBoundary: this.resetErrorBoundary });
            }
            if (fallback) {
                return typeof fallback === "function"
                    ? fallback({ error, errorInfo, resetErrorBoundary: this.resetErrorBoundary })
                    : fallback;
            }
            return null;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
