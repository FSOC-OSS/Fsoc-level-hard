"use client";

import { useState, useEffect, useCallback } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import LoadingSpinner from "./LoadingSpinner";
import QuizSetupPage from "./QuizSetupPage";
import CountdownTimer from "./CountdownTimer";
import TimerSettings from "./TimerSettings";
import KeyboardShortcuts from "./KeyboardShortcuts";
import PauseOverlay from "./PauseOverlay";
import QuizStateManager from "../utils/QuizStateManager";
import BookmarkManager from "../utils/BookmarkManager";
import BadgeManager from "../utils/BadgeManager";

const QuizApp = () => {
    // ---------- Core Quiz State ----------
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ---------- Quiz Setup State ----------
    const [showSetup, setShowSetup] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");

    // ---------- Timer State ----------
    const [timerDuration, setTimerDuration] = useState(30);
    const [isTimerEnabled, setIsTimerEnabled] = useState(true);
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);

    // ---------- Pause State ----------
    const [isQuizPaused, setIsQuizPaused] = useState(false);
    const [quizStartTime, setQuizStartTime] = useState(null);

    // ---------- TTS / Result Announcement ----------
    const [isResultAnnouncementComplete, setIsResultAnnouncementComplete] =
        useState(false);

    // ---------- Badge System ----------
    const [quizStartTimestamp, setQuizStartTimestamp] = useState(null);

    // ---------- Helper to decode HTML entities ----------
    const decodeHtmlEntities = (text) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    };

    // ---------- Initialize Badge System ----------
    useEffect(() => {
        BadgeManager.initializeBadgeSystem();
    }, []);

    // ---------- Save / Load Quiz State ----------
    const saveQuizState = useCallback(() => {
        if (questions.length === 0) return;

        const state = QuizStateManager.createQuizState({
            questions,
            currentQuestionIndex,
            selectedAnswers,
            score,
            timeRemaining,
            timerDuration,
            isTimerEnabled,
            selectedCategory,
            quizStartTime,
        });

        QuizStateManager.saveQuizState(state);
    }, [
        questions,
        currentQuestionIndex,
        selectedAnswers,
        score,
        timeRemaining,
        timerDuration,
        isTimerEnabled,
        selectedCategory,
        quizStartTime,
    ]);

    const loadSavedQuizState = useCallback(() => {
        const savedState = QuizStateManager.loadQuizState();
        if (!savedState) return false;

        setQuestions(savedState.questions);
        setCurrentQuestionIndex(savedState.currentQuestionIndex);
        setSelectedAnswers(savedState.selectedAnswers);
        setScore(savedState.score);
        setTimeRemaining(savedState.timeRemaining);
        setTimerDuration(savedState.timerDuration);
        setIsTimerEnabled(savedState.isTimerEnabled);
        setSelectedCategory(savedState.selectedCategory);
        setQuizStartTime(savedState.quizStartTime);
        setIsQuizPaused(true);

        return true;
    }, []);

    // ---------- Handle Pause / Resume ----------
    const handlePauseToggle = useCallback(() => {
        if (quizCompleted || showSetup) return;

        if (isQuizPaused) {
            setIsQuizPaused(false);
            setIsTimerPaused(false);
            QuizStateManager.clearQuizState();
        } else {
            setIsQuizPaused(true);
            setIsTimerPaused(true);
            saveQuizState();
        }
    }, [isQuizPaused, quizCompleted, showSetup, saveQuizState]);

    // ---------- Fetch Questions ----------
    const fetchQuestions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const prefRaw = localStorage.getItem("quizPreferences");
            let prefs = null;
            if (prefRaw) {
                try {
                    prefs = JSON.parse(prefRaw);
                } catch {
                    prefs = null;
                }
            }

            const amount = prefs?.numQuestions || 10;
            const categoryId = prefs?.category?.id || null;
            const difficulty = prefs?.difficulty?.toLowerCase() || null;
            const type = prefs?.questionType || null;

            if (prefs?.category?.name) setSelectedCategory(prefs.category.name);

            const params = new URLSearchParams();
            params.append("amount", amount);
            if (categoryId) params.append("category", categoryId);
            if (difficulty) params.append("difficulty", difficulty);
            if (type) params.append("type", type);

            const url = `https://opentdb.com/api.php?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error("Failed to fetch questions");

            const data = await response.json();
            if (data.response_code !== 0)
                throw new Error("No questions available for selected options.");

            const processedQuestions = data.results.map((q) => {
                const answers = [...q.incorrect_answers, q.correct_answer];
                const shuffled = answers.sort(() => Math.random() - 0.5);
                return {
                    ...q,
                    question: decodeHtmlEntities(q.question),
                    correct_answer: decodeHtmlEntities(q.correct_answer),
                    answers: shuffled.map((a) => decodeHtmlEntities(a)),
                    id: BookmarkManager.generateQuestionId(q),
                };
            });

            setQuestions(processedQuestions);
            setCurrentQuestionIndex(0);
            setSelectedAnswers([]);
            setQuizCompleted(false);
            setScore(0);
            setTimeRemaining(isTimerEnabled ? timerDuration : null);
            setIsQuizPaused(false);
            setIsTimerPaused(false);
            setIsResultAnnouncementComplete(false);
            setQuizStartTime(Date.now());
            setQuizStartTimestamp(Date.now());
            QuizStateManager.clearQuizState();
        } catch (err) {
            setError(err.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    }, [timerDuration, isTimerEnabled]);

    // ---------- Auto-save every 5s ----------
    useEffect(() => {
        if (
            !isQuizPaused &&
            questions.length > 0 &&
            !quizCompleted &&
            !showSetup
        ) {
            const interval = setInterval(saveQuizState, 5000);
            return () => clearInterval(interval);
        }
    }, [
        isQuizPaused,
        questions.length,
        quizCompleted,
        showSetup,
        saveQuizState,
    ]);

    // ---------- Load saved state or fetch questions after setup ----------
    useEffect(() => {
        if (!showSetup) {
            const hasSavedState = loadSavedQuizState();
            if (!hasSavedState) fetchQuestions();
        }
    }, [showSetup, loadSavedQuizState, fetchQuestions]);

    // ---------- Auto-pause on visibility change ----------
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (
                document.hidden &&
                !isQuizPaused &&
                !quizCompleted &&
                !showSetup
            ) {
                handlePauseToggle();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
    }, [isQuizPaused, quizCompleted, showSetup, handlePauseToggle]);

    // ---------- Answer Selection ----------
    const handleAnswerSelect = (selectedAnswer) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion?.correct_answer;

        const answerData = {
            questionIndex: currentQuestionIndex,
            selectedAnswer,
            correctAnswer: currentQuestion?.correct_answer ?? null,
            isCorrect: Boolean(isCorrect),
        };

        setSelectedAnswers((prev) => [...prev, answerData]);
        if (isCorrect) setScore((prev) => prev + 1);

        // Pause timer until result announcement (TTS)
        setIsTimerPaused(true);
        setIsResultAnnouncementComplete(false);
    };

    // ---------- Auto-advance after TTS ----------
    useEffect(() => {
        if (
            isResultAnnouncementComplete &&
            selectedAnswers[currentQuestionIndex]
        ) {
            const moveToNext = () => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    setIsTimerPaused(false);
                    setIsResultAnnouncementComplete(false);
                } else {
                    setQuizCompleted(true);

                    // Track quiz completion for badges
                    const quizEndTime = Date.now();
                    const totalTimeSpent = quizStartTimestamp
                        ? (quizEndTime - quizStartTimestamp) / 1000
                        : 0;
                    const averageTimePerQuestion =
                        totalTimeSpent / questions.length;

                    BadgeManager.onQuizCompleted({
                        score,
                        totalQuestions: questions.length,
                        timeSpent: totalTimeSpent,
                        averageTimePerQuestion,
                    });
                }
            };
            setTimeout(moveToNext, 300);
        }
    }, [
        isResultAnnouncementComplete,
        currentQuestionIndex,
        questions.length,
        selectedAnswers,
    ]);

    // ---------- Timer callbacks ----------
    const handleTimerExpired = () => handleAnswerSelect(null);
    const handleTimerWarning = () =>
        console.log("Timer warning: 10 seconds remaining");

    const handleResultAnnounced = () => setIsResultAnnouncementComplete(true);

    // ---------- Back to Setup ----------
    const handleBackToSetup = useCallback(() => {
        QuizStateManager.clearQuizState();
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setQuizCompleted(false);
        setScore(0);
        setError(null);
        setIsQuizPaused(false);
        setIsTimerPaused(false);
        setTimeRemaining(null);
        setQuizStartTime(null);
        setShowSetup(true);
    }, []);

    // ---------- Restart Quiz ----------
    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setQuizCompleted(false);
        setScore(0);
        setIsTimerPaused(false);
        setIsResultAnnouncementComplete(false);
        fetchQuestions();
    };

    // ---------- Render ----------
    if (showSetup) return <QuizSetupPage onStart={() => setShowSetup(false)} />;
    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={fetchQuestions}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={handleBackToSetup}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                            ⚙️ Back to Setup
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (quizCompleted) {
        return (
            <>
                <KeyboardShortcuts />
                <QuizResults
                    score={score}
                    totalQuestions={questions.length}
                    onRestart={restartQuiz}
                    onBackToSetup={handleBackToSetup}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
            <KeyboardShortcuts
                onPauseToggle={handlePauseToggle}
                isPaused={isQuizPaused}
            />

            <PauseOverlay
                isVisible={isQuizPaused}
                onResume={handlePauseToggle}
                currentQuestionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                timeRemaining={timeRemaining}
                score={score}
                onBackToSetup={handleBackToSetup}
            />

            <div className="max-w-4xl mx-auto pt-4">
                {/* Header */}
                <div className="text-center mb-8 relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Quiz Challenge
                    </h1>
                    <p className="text-purple-200 text-lg">
                        Test your knowledge with{" "}
                        {selectedCategory || "this topic"} questions!
                    </p>

                    {/* Timer / Settings */}
                    <div className="absolute top-0 right-0 flex gap-2">
                        <button
                            onClick={handlePauseToggle}
                            disabled={quizCompleted}
                            className={`flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 ${
                                quizCompleted
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                            }`}
                            aria-label={
                                isQuizPaused ? "Resume quiz" : "Pause quiz"
                            }
                            title={
                                isQuizPaused
                                    ? "Resume quiz (Spacebar)"
                                    : "Pause quiz (Spacebar)"
                            }
                        >
                            <span className="text-lg">
                                {isQuizPaused ? "▶️" : "⏸️"}
                            </span>
                        </button>
                        <TimerSettings
                            currentDuration={timerDuration}
                            onDurationChange={setTimerDuration}
                            isTimerEnabled={isTimerEnabled}
                            onTimerToggle={setIsTimerEnabled}
                        />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white/20 rounded-full h-3 mb-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-pink-400 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%`,
                        }}
                    />
                </div>

                {/* Countdown Timer */}
                {isTimerEnabled && timerDuration > 0 && (
                    <div className="mb-6">
                        <CountdownTimer
                            duration={timerDuration}
                            onTimeUp={handleTimerExpired}
                            isActive={!quizCompleted}
                            isPaused={isTimerPaused || isQuizPaused}
                            onWarning={handleTimerWarning}
                            showWarningAt={10}
                            initialTimeRemaining={timeRemaining}
                            onTimeUpdate={setTimeRemaining}
                            key={`timer-${currentQuestionIndex}`}
                        />
                    </div>
                )}

                {/* Question Counter */}
                <div className="text-center mb-6">
                    <span className="bg-white/20 text-white px-4 py-2 rounded-full text-lg font-semibold">
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions.length || 0}
                    </span>
                </div>

                {/* Current Question */}
                {questions.length > 0 && !isQuizPaused && (
                    <QuizQuestion
                        question={questions[currentQuestionIndex]}
                        onAnswerSelect={handleAnswerSelect}
                        selectedAnswer={
                            selectedAnswers[currentQuestionIndex]
                                ?.selectedAnswer
                        }
                        isTimerEnabled={isTimerEnabled}
                        onResultAnnounced={handleResultAnnounced}
                    />
                )}
            </div>
        </div>
    );
};

export default QuizApp;
