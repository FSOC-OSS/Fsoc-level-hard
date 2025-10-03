import { useNavigate } from "react-router-dom";
import ErrorLayout from "./ErrorLayout";

const QuizLoadFailed = ({ onRetry, onBackToSetup, details, onReport }) => {
    const navigate = useNavigate();

    return (
        <ErrorLayout
            tone="danger"
            title="Quiz failed to load"
            description="We couldn't prepare your quiz. Let's try again or adjust your settings."
            illustration={<span role="img" aria-label="confused fox">🦊</span>}
        >
            <div className="flex flex-col gap-5 text-white/90">
                {details && (
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left text-sm">
                        <p className="font-semibold uppercase tracking-wide text-white/70">
                            What happened
                        </p>
                        <p className="mt-2 leading-relaxed text-white/80">{details}</p>
                    </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                    <button
                        onClick={onRetry}
                        className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
                    >
                        Retry quiz load
                    </button>
                    <button
                        onClick={onBackToSetup}
                        className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                        Back to setup
                    </button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
                    >
                        Go Home
                    </button>
                    <button
                        onClick={onReport}
                        className="rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
                    >
                        Report this error
                    </button>
                    <button
                        onClick={() => {
                            if (navigator?.clipboard) {
                                navigator.clipboard.writeText(
                                    details || "Quiz load failed",
                                );
                            }
                        }}
                        className="rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
                    >
                        Copy error details
                    </button>
                </div>
            </div>
        </ErrorLayout>
    );
};

export default QuizLoadFailed;
