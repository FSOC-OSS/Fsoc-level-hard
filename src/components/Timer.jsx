import { useEffect, useState } from 'react';

const Timer = ({ timeRemaining, formatTime, isRunning, isPaused, onTimeUp }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Blink when time is running low (less than 30 seconds)
  useEffect(() => {
    if (timeRemaining <= 30000 && timeRemaining > 0 && isRunning && !isPaused) {
      const blinkInterval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    } else {
      setIsBlinking(false);
    }
  }, [timeRemaining, isRunning, isPaused]);

  const getTimerColor = () => {
    if (timeRemaining <= 30000) return 'text-red-500';
    if (timeRemaining <= 60000) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressWidth = () => {
    const totalTime = 300000; // 5 minutes in milliseconds
    return Math.max(0, (timeRemaining / totalTime) * 100);
  };

  const getProgressColor = () => {
    if (timeRemaining <= 30000) return 'from-red-500 to-red-600';
    if (timeRemaining <= 60000) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-white text-sm font-medium">
            {isPaused ? 'Paused' : isRunning ? 'Time Remaining' : 'Ready to Start'}
          </span>
        </div>

        <div className={`text-2xl font-bold ${getTimerColor()} ${isBlinking ? 'animate-pulse' : ''}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-300 ease-out`}
          style={{ width: `${getProgressWidth()}%` }}
        />
      </div>

      {/* Warning Messages */}
      {timeRemaining <= 30000 && timeRemaining > 0 && !isPaused && (
        <div className="mt-2 text-red-200 text-sm font-medium animate-pulse">
          ⚠️ Hurry up! Only {Math.ceil(timeRemaining / 1000)} seconds left!
        </div>
      )}

      {timeRemaining === 0 && (
        <div className="mt-2 text-red-200 text-sm font-medium">
          ⏰ Time's up!
        </div>
      )}

      {isPaused && (
        <div className="mt-2 text-yellow-200 text-sm font-medium">
          ⏸️ Timer paused - Click resume to continue
        </div>
      )}
    </div>
  );
};

export default Timer;
