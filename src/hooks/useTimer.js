import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime = 300000, onTimeUp = null) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning && !isPaused) {
      startTimeRef.current = Date.now() - (initialTime - timeRemaining);

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current - pausedTimeRef.current;
        const remaining = Math.max(0, initialTime - elapsed);

        setTimeRemaining(remaining);

        if (remaining === 0) {
          setIsRunning(false);
          if (onTimeUp) {
            onTimeUp();
          }
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, initialTime, timeRemaining, onTimeUp]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resumeTimer = () => {
    setIsPaused(false);
    setIsRunning(true);
  };

  const resetTimer = (newTime = initialTime) => {
    setTimeRemaining(newTime);
    setIsRunning(false);
    setIsPaused(false);
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime,
    isTimeUp: timeRemaining === 0
  };
};
