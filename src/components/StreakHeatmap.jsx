import StreakManager from "../utils/StreakManager";

export default function StreakHeatmap({
    numQuestions = 0,
    selectedAnswers = [],
    currentStreak = 0,
    bonusScore = 0,
}) {
    const nextMilestone = StreakManager.getNextMilestone(currentStreak);
    const multiplier = StreakManager.getMultiplierForStreak(currentStreak);

    const boxes = Array.from({ length: Math.max(0, numQuestions) }, (_, i) => {
        const ans = selectedAnswers[i];
        if (!ans) return "unanswered";
        return ans.isCorrect ? "correct" : "incorrect";
    });

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${currentStreak > 0 ? "bg-orange-500" : "bg-white/20"}`}>
                        <span className={`text-2xl ${currentStreak > 0 ? "animate-pulse" : ""}`}>🔥</span>
                        {currentStreak > 0 && (
                            <span className="absolute -right-2 -bottom-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                {currentStreak}x
                            </span>
                        )}
                    </div>
                    <div className="text-white">
                        <div className="font-bold">Current Streak: {currentStreak}</div>
                        <div className="text-sm text-purple-200">Multiplier {multiplier.toFixed(1)}x{nextMilestone ? ` • Next at ${nextMilestone}` : ""}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-white/20 text-white font-semibold">Bonus {bonusScore}</div>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 py-1">
                {boxes.map((state, idx) => (
                    <div key={idx} className="w-3 h-3 rounded-sm border border-white/10"
                        title={`Q${idx + 1}: ${state}`} 
                        style={{
                            backgroundColor:
                                state === "correct"
                                    ? "#22c55e" // green-500
                                    : state === "incorrect"
                                    ? "rgba(255,255,255,0.15)"
                                    : "rgba(255,255,255,0.08)",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}


