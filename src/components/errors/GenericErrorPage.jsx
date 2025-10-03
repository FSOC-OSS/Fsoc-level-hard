import ErrorLayout from "./ErrorLayout";

const GenericErrorPage = ({ title = "Something went wrong", description, onRetry, onHome, supportUrl }) => {
    return (
        <ErrorLayout
            tone="danger"
            title={title}
            description={description || "We're on it. You can retry the action or head back to a safe screen."}
            illustration={<span role="img" aria-label="spark">✨</span>}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                            Retry
                        </button>
                    )}
                    {onHome && (
                        <button
                            onClick={onHome}
                            className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            Go Home
                        </button>
                    )}
                    {supportUrl && (
                        <button
                            onClick={() => window.open(supportUrl, "_blank")}
                            className="rounded-2xl bg-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/30"
                        >
                            Report this error
                        </button>
                    )}
                </div>
            </div>
        </ErrorLayout>
    );
};

export default GenericErrorPage;
