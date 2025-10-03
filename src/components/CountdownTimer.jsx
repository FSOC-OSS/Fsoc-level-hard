import { useState, useEffect, useRef } from "react";

const CountdownTimer = ({
    duration = 30,
    onTimeUp,
    isActive = true,
    isPaused = false,
    showWarningAt = 10,
    onWarning,
    className = "",
    initialTimeRemaining = null,
    onTimeUpdate = null,
}) => {
    const [timeRemaining, setTimeRemaining] = useState(
        initialTimeRemaining || duration,
    );
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const hasWarningFired = useRef(false);
    const hasTimeUpFired = useRef(false);

    useEffect(() => {
        const newTime =
            initialTimeRemaining !== null ? initialTimeRemaining : duration;
        setTimeRemaining(newTime);
        hasWarningFired.current = false;
        hasTimeUpFired.current = false;
        if (isActive && !isPaused && newTime > 0) {
            setIsRunning(true);
        } else {
            setIsRunning(false);
        }
    }, [duration, initialTimeRemaining, isActive, isPaused]);

    useEffect(() => {
        if (isPaused) {
            setIsRunning(false);
        } else if (isActive && timeRemaining > 0 && !hasTimeUpFired.current) {
            setIsRunning(true);
        }
    }, [isPaused, isActive, timeRemaining]);

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    const newTime = prev - 1;

                    if (onTimeUpdate) {
                        setTimeout(() => onTimeUpdate(newTime), 0);
                    }

                    if (
                        newTime === showWarningAt &&
                        !hasWarningFired.current &&
                        onWarning
                    ) {
                        hasWarningFired.current = true;
                        onWarning();
                    }

                    if (newTime <= 0) {
                        setIsRunning(false);

                        if (!hasTimeUpFired.current) {
                            hasTimeUpFired.current = true;

                            if (
                                typeof window !== "undefined" &&
                                window.quizQuestionHandleTimeOut
                            ) {
                                window.quizQuestionHandleTimeOut();
                            }

                            if (onTimeUp) onTimeUp();
                        }

                        return 0;
                    }

                    return newTime;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [
        isRunning,
        timeRemaining,
        onTimeUp,
        showWarningAt,
        onWarning,
        onTimeUpdate,
    ]);

    const progressPercentage = (timeRemaining / duration) * 100;

    const getTimerColor = () => {
        const percentage = (timeRemaining / duration) * 100;
        if (percentage <= 20) return "text-red-500";
        if (percentage <= 40) return "text-yellow-500";
        return "text-green-500";
    };

    const getProgressBarColor = () => {
        const percentage = (timeRemaining / duration) * 100;
        if (percentage <= 20) return "bg-red-500";
        if (percentage <= 40) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getProgressBarGlow = () => {
        const percentage = (timeRemaining / duration) * 100;
        if (percentage <= 20) return "shadow-red-500/50";
        if (percentage <= 40) return "shadow-yellow-500/50";
        return "shadow-green-500/50";
    };

    const formatTime = (seconds) => {
        if (seconds >= 60) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
    };

    if (!isActive) return null;

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-center gap-3 mb-4">
                <div
                    className={`text-2xl transition-colors duration-300 ${getTimerColor()}`}
                >
                    {isPaused ? "⏸️" : "⏱️"}
                </div>
                <span
                    className={`text-xl font-bold transition-colors duration-300 ${getTimerColor()}`}
                >
                    {isPaused ? "Timer Paused: " : "Time Remaining: "}
                    {formatTime(timeRemaining)}
                </span>
            </div>

            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gray-300 rounded-full"></div>

                <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-linear ${getProgressBarColor()} ${getProgressBarGlow()} shadow-lg ${isPaused ? "opacity-70" : ""}`}
                    style={{
                        width: `${progressPercentage}%`,
                        transition: isPaused
                            ? "opacity 0.3s ease, background-color 0.3s ease"
                            : "width 1s linear, background-color 0.3s ease",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                </div>

                {timeRemaining <= showWarningAt && !isPaused && (
                    <div
                        className={`absolute inset-0 rounded-full animate-pulse ${getProgressBarColor()} opacity-30`}
                    ></div>
                )}

                {isPaused && (
                    <div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 animate-pulse"></div>
                )}
            </div>

            {timeRemaining === 0 && (
                <div className="mt-4 text-center">
                    <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                        ⏱️ TIME'S UP!
                    </span>
                </div>
            )}
        </div>
    );
};

export default CountdownTimer;
