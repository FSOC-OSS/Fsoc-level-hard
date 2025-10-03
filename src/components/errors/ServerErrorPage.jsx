import { useNavigate } from "react-router-dom";
import ErrorLayout from "./ErrorLayout";

const ServerErrorPage = ({ onRetry, supportUrl, error }) => {
    const navigate = useNavigate();
    const copyDetails = () => {
        const baseDetails = `Path: ${window.location.pathname}\nTime: ${new Date().toISOString()}`;
        const errorDetails = error
            ? `${baseDetails}\nMessage: ${error.message}\nStack: ${error.stack || "<no stack>"}`
            : baseDetails;
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(errorDetails);
        }
    };

    return (
        <ErrorLayout
            title="Something snapped on our side"
            description="Our quiz hamsters are on it! In the meantime you can try again, head to safety, or let us know what happened."
            illustration={<span role="img" aria-label="broken robot">🤖</span>}
        >
            <div className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <button
                        onClick={() => onRetry?.()}
                        className="rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-purple-600 transition hover:-translate-y-[2px] hover:bg-purple-50"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="rounded-2xl border border-white/40 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-[2px] hover:bg-white/20"
                    >
                        Go Home
                    </button>
                </div>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 text-left text-sm text-white/80">
                    <p>
                        If this keeps happening, please send us the details so we can fix it fast.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={copyDetails}
                            className="rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
                        >
                            Copy error details
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
                        >
                            Clear cache & reload
                        </button>
                        {supportUrl && (
                            <button
                                onClick={() => window.open(supportUrl, "_blank")}
                                className="rounded-xl bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-purple-600 transition hover:bg-purple-50"
                            >
                                Report this error
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </ErrorLayout>
    );
};

export default ServerErrorPage;
