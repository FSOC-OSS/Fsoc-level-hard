import ErrorLayout from "./ErrorLayout";

const NetworkErrorPage = ({ onRetry, onGoHome }) => {
    return (
        <ErrorLayout
            tone="info"
            title="No internet connection"
            description="We can't reach the quiz servers right now. Reconnect to the internet and we'll retry automatically."
            illustration={<span role="img" aria-label="satellite">🛰️</span>}
        >
            <div className="flex flex-col gap-4 text-white/90">
                <div className="rounded-2xl bg-white/10 p-5 text-left">
                    <p className="text-sm">
                        We detected you're offline. We'll watch for a connection and try again as soon as you're back.
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-white/60">
                        Tip: If you can't wait, reconnect and hit retry below.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={onRetry}
                        className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                        Retry now
                    </button>
                    <button
                        onClick={onGoHome}
                        className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </ErrorLayout>
    );
};

export default NetworkErrorPage;
