import { useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import QuizApp from "./components/QuizApp";
import BookmarkedQuestions from "./components/BookmarkedQuestions";
import BadgesPage from "./components/BadgesPage";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkStatusBanner from "./components/NetworkStatusBanner";
import NotFoundPage from "./components/errors/NotFoundPage";
import ServerErrorPage from "./components/errors/ServerErrorPage";
import GenericErrorPage from "./components/errors/GenericErrorPage";
import NetworkErrorPage from "./components/errors/NetworkErrorPage";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { useToast } from "./components/ToastProvider";

const SUPPORT_URL = "https://github.com/FSOC-OSS/Fsoc-level-hard/issues/new/choose";

const StatusIndicator = () => {
    const { isOnline } = useNetworkStatus();
    return (
        <div className="pointer-events-none fixed left-4 top-4 z-[1500] flex">
            <div
                className={`pointer-events-auto rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-lg backdrop-blur-md ${isOnline ? "bg-emerald-500/90 text-white" : "bg-rose-600/90 text-white"}`}
            >
                {isOnline ? "Online" : "Offline"}
            </div>
        </div>
    );
};

const QuizRoute = () => {
    const navigate = useNavigate();
    return (
        <ErrorBoundary
            label="Quiz route"
            fallbackRender={({ resetErrorBoundary, error }) => (
                <GenericErrorPage
                    title="Quiz encountered an error"
                    description={error?.message}
                    onRetry={resetErrorBoundary}
                    onHome={() => navigate("/")}
                    supportUrl={SUPPORT_URL}
                />
            )}
        >
            <QuizApp />
        </ErrorBoundary>
    );
};

const BookmarksRoute = () => {
    const navigate = useNavigate();
    return (
        <ErrorBoundary
            label="Bookmarks route"
            fallbackRender={({ resetErrorBoundary, error }) => (
                <GenericErrorPage
                    title="Bookmarks are unavailable"
                    description={error?.message}
                    onRetry={resetErrorBoundary}
                    onHome={() => navigate("/")}
                    supportUrl={SUPPORT_URL}
                />
            )}
        >
            <BookmarkedQuestions />
        </ErrorBoundary>
    );
};

const BadgesRoute = () => {
    const navigate = useNavigate();
    return (
        <ErrorBoundary
            label="Badges route"
            fallbackRender={({ resetErrorBoundary, error }) => (
                <GenericErrorPage
                    title="Badges failed to load"
                    description={error?.message}
                    onRetry={resetErrorBoundary}
                    onHome={() => navigate("/")}
                    supportUrl={SUPPORT_URL}
                />
            )}
        >
            <BadgesPage />
        </ErrorBoundary>
    );
};

const NetworkErrorRoute = () => {
    const navigate = useNavigate();
    return (
        <NetworkErrorPage
            onRetry={() => window.location.reload()}
            onGoHome={() => navigate("/")}
        />
    );
};

function App() {
    const { showToast } = useToast();
    const handleReconnect = useCallback(() => {
        showToast({
            type: "success",
            message: "You're back online. We'll resume pending actions.",
        });
    }, [showToast]);

    return (
        <Router>
            <NetworkStatusBanner onReconnect={handleReconnect} />
            <StatusIndicator />
            <ErrorBoundary
                label="App shell"
                fallbackRender={({ resetErrorBoundary, error }) => (
                    <ServerErrorPage
                        onRetry={resetErrorBoundary}
                        supportUrl={SUPPORT_URL}
                        error={error}
                    />
                )}
            >
                <Routes>
                    <Route path="/" element={<QuizRoute />} />
                    <Route path="/bookmarks" element={<BookmarksRoute />} />
                    <Route path="/badges" element={<BadgesRoute />} />
                    <Route path="/error/network" element={<NetworkErrorRoute />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
