import { useState, useEffect, useRef } from "react";

const playSound = (audioRef) => {
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
};

const STROKE_WIDTH = 10;
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
    startSoundSrc = null,
    warningSoundSrc = null,
    timeUpSoundSrc = null,
    finalCountdownSoundSrc = null,
    isMuted = false,
}) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining ?? duration);
    const intervalRef = useRef(null);
    const hasWarningFired = useRef(false);
    const hasTimeUpFired = useRef(false);
    const hasStartedFired = useRef(false);
    const lastCountdownSoundTime = useRef(0);

    const startAudioRef = useRef(null);
    const warningAudioRef = useRef(null);
    const timeUpAudioRef = useRef(null);
    const finalCountdownAudioRef = useRef(null);

    useEffect(() => {
        if (!isMuted) {
            if (startSoundSrc) startAudioRef.current = new Audio(startSoundSrc);
            if (warningSoundSrc) warningAudioRef.current = new Audio(warningSoundSrc);
            if (timeUpSoundSrc) timeUpAudioRef.current = new Audio(timeUpSoundSrc);
            if (finalCountdownSoundSrc) finalCountdownAudioRef.current = new Audio(finalCountdownSoundSrc);
        }

        return () => {
            [startAudioRef, warningAudioRef, timeUpAudioRef, finalCountdownAudioRef].forEach(ref => {
                if (ref.current) {
                    ref.current.pause();
                    ref.current = null;
                }
            });
        };
    }, [isMuted, startSoundSrc, warningSoundSrc, timeUpSoundSrc, finalCountdownSoundSrc]);

    useEffect(() => {
        setTimeRemaining(initialTimeRemaining ?? duration);
        hasWarningFired.current = false;
        hasTimeUpFired.current = false;
        hasStartedFired.current = false;
        lastCountdownSoundTime.current = 0;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [duration, initialTimeRemaining]);

    useEffect(() => {
        if (isActive && !isPaused && !hasStartedFired.current) {
            if (initialTimeRemaining === null || initialTimeRemaining !== duration) {
                if (!isMuted) playSound(startAudioRef);
                hasStartedFired.current = true;
            }
        }
    }, [isActive, isPaused, duration, initialTimeRemaining, isMuted]);

    useEffect(() => {
        if (!isActive || isPaused || timeRemaining <= 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                const next = Math.max(prev - 1, 0);

                if (onTimeUpdate) {
                    Promise.resolve().then(() => onTimeUpdate(next));
                }

                if (next > 0 && next <= 5 && next !== lastCountdownSoundTime.current) {
                    if (!isMuted) playSound(finalCountdownAudioRef);
                    lastCountdownSoundTime.current = next;
                }

                if (next === showWarningAt && !hasWarningFired.current && onWarning) {
                    hasWarningFired.current = true;
                    if (!isMuted) playSound(warningAudioRef);
                    onWarning();
                }

                if (next === 0) {
                    if (!hasTimeUpFired.current) {
                        hasTimeUpFired.current = true;
                        if (!isMuted) playSound(timeUpAudioRef);

                        if (typeof window !== "undefined" && window.quizQuestionHandleTimeOut) {
                            window.quizQuestionHandleTimeOut();
                        }

                        if (onTimeUp) {
                            onTimeUp();
                        }
                    }
                }

                return next;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, isPaused, timeRemaining, onTimeUp, onTimeUpdate, onWarning, showWarningAt, isMuted]);

    const progressPercentage = Math.max(0, Math.min(100, (timeRemaining / duration) * 100));
    const isWarning = timeRemaining > 0 && timeRemaining <= showWarningAt && !isPaused;
    const isDanger = timeRemaining > 0 && timeRemaining <= 5 && !isPaused;
    const isTimeUp = timeRemaining === 0;

    const progressOffset = CIRCUMFERENCE - (progressPercentage / 100) * CIRCUMFERENCE;
    const center = RADIUS + STROKE_WIDTH;
    const size = center * 2;

    const getRingColorClass = () => {
        if (isTimeUp || progressPercentage <= (showWarningAt / duration) * 100) return "stroke-red-500";
        if (progressPercentage <= 40) return "stroke-yellow-500";
        return "stroke-green-500";
    };

    const getTimerTextColor = () => {
        if (isTimeUp || progressPercentage <= (showWarningAt / duration) * 100) return "text-red-500";
        if (progressPercentage <= 40) return "text-yellow-500";
        return "text-green-500";
    };

    const formatTime = (seconds) => {
        const totalMinutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        if (totalMinutes > 0) {
            return `${totalMinutes}m ${formattedSeconds}s`;
        }
        return `${seconds}s`;
    };

    if (!isActive) return null;

    return (
        <div className={`flex flex-col items-center justify-center w-full ${className}`}>
            
            <div className={`relative flex items-center justify-center ${isDanger && 'animate-shake'}`}>
                <svg
                    className={`transform -rotate-90 ${isPaused ? 'opacity-70' : ''}`}
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                >
                    <circle
                        cx={center}
                        cy={center}
                        r={RADIUS}
                        strokeWidth={STROKE_WIDTH}
                        className="stroke-gray-300 fill-transparent"
                    />
                    
                    <circle
                        cx={center}
                        cy={center}
                        r={RADIUS}
                        strokeWidth={STROKE_WIDTH}
                        className={`${getRingColorClass()} fill-transparent transition-all duration-1000 ${isPaused ? 'ease-out' : 'ease-linear'}`}
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                        style={{
                            transition: isPaused 
                                ? "opacity 0.3s ease, stroke 0.3s ease" 
                                : "stroke-dashoffset 1s linear, stroke 0.3s ease",
                        }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span 
                        className={`text-3xl font-extrabold transition-colors duration-300 ${getTimerTextColor()} ${isDanger ? 'animate-pulse' : ''}`}
                    >
                        {formatTime(timeRemaining)}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                        {isPaused ? "Paused" : (isTimeUp ? "TIME UP" : "Remaining")}
                    </span>
                </div>
                
                {isWarning && !isPaused && (
                    <div
                        className={`absolute inset-0 rounded-full animate-pulse opacity-20 ${getRingColorClass().replace('stroke-', 'bg-')}`}
                        style={{ width: size, height: size }}
                    ></div>
                )}
            </div>

            {isTimeUp && (
                <div className="mt-6 text-center">
                    <span className="inline-block bg-red-500 text-white px-5 py-2 rounded-full font-bold text-lg animate-pulse shadow-lg shadow-red-500/50">
                        🛑 TIME'S UP! 🛑
                    </span>
                </div>
            )}
            
            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-3px); }
                    40%, 80% { transform: translateX(3px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default CountdownTimer;