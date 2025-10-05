"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import QuizReviewWrapper from "./QuizReviewWrapper";
import LoadingSpinner from "./LoadingSpinner";
import QuizSetupPage from "./QuizSetupPage";
import CountdownTimer from "./CountdownTimer";
import TimerSettings from "./TimerSettings";
import KeyboardShortcuts from "./KeyboardShortcuts";
import PauseOverlay from "./PauseOverlay";
import ThemeToggle from "./ThemeToggle";
import CelebrationSettings from "./CelebrationSettings";
import QuizStateManager from "../utils/QuizStateManager";
import BookmarkManager from "../utils/BookmarkManager";
import BadgeManager from "../utils/BadgeManager";
import ConsentManager from "../utils/ConsentManager";
import BonusManager from "../utils/BonusManager";

const QuizApp = ({
    startImmediately = false,
    initialPreferences = null,
    sessionId = null,
    currentQuestionNumber,
    onQuestionChange,
    onComplete,
}) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [reviewMode, setReviewMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSetup, setShowSetup] = useState(!startImmediately);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [timerDuration, setTimerDuration] = useState(30);
    const [isTimerEnabled, setIsTimerEnabled] = useState(true);
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [isQuizPaused, setIsQuizPaused] = useState(false);
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [hintsLimit, setHintsLimit] = useState(3);
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [totalHintsUsed, setTotalHintsUsed] = useState(0);
    const [isResultAnnouncementComplete, setIsResultAnnouncementComplete] =
        useState(false);
    const [quizStartTimestamp, setQuizStartTimestamp] = useState(null);
    const [showCelebrationSettings, setShowCelebrationSettings] =
        useState(false);

    const decodeHtmlEntities = (text) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    };

    useEffect(() => {
        BadgeManager.initializeBadgeSystem &&
            BadgeManager.initializeBadgeSystem();
    }, []);

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
            hintsRemaining,
            totalHintsUsed,
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
        hintsRemaining,
        totalHintsUsed,
    ]);

    const loadSavedQuizState = useCallback(() => {
        const savedState = QuizStateManager.loadQuizState();
        if (!savedState) return false;

        setQuestions(savedState.questions || []);
        setCurrentQuestionIndex(savedState.currentQuestionIndex || 0);
        setSelectedAnswers(savedState.selectedAnswers || []);
        setScore(savedState.score || 0);
        setTimeRemaining(
            typeof savedState.timeRemaining !== "undefined"
                ? savedState.timeRemaining
                : null,
        );
        setTimerDuration(savedState.timerDuration || timerDuration);
        setIsTimerEnabled(
            typeof savedState.isTimerEnabled !== "undefined"
                ? savedState.isTimerEnabled
                : isTimerEnabled,
        );
        setSelectedCategory(savedState.selectedCategory || "");
        setQuizStartTime(savedState.quizStartTime || null);
        setHintsRemaining(
            typeof savedState.hintsRemaining === "number"
                ? savedState.hintsRemaining
                : hintsLimit,
        );
        setTotalHintsUsed(savedState.totalHintsUsed || 0);
        setIsQuizPaused(true);

        return true;
    }, [timerDuration, isTimerEnabled, hintsLimit]);

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

    const fetchQuestions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const prefRaw =
                (ConsentManager &&
                    ConsentManager.getItem &&
                    ConsentManager.getItem("quizPreferences")) ||
                localStorage.getItem("quizPreferences");
            let stored = null;
            if (prefRaw) {
                try {
                    stored = JSON.parse(prefRaw);
                } catch {
                    stored = null;
                }
            }

            // Merge URL-provided preferences into stored preferences
            let prefs = stored || {};
            if (initialPreferences) {
                prefs = {
                    ...prefs,
                    numQuestions: initialPreferences.numQuestions ?? prefs.numQuestions,
                    category: {
                        id: initialPreferences.categoryId ?? prefs?.category?.id,
                        name: initialPreferences.categoryName ?? prefs?.category?.name,
                    },
                    difficulty: initialPreferences.difficulty ?? prefs.difficulty,
                    questionType: initialPreferences.type ?? prefs.questionType,
                };
            }

            const amount = prefs?.numQuestions || 10;
            const categoryId = prefs?.category?.id || null;
            const difficulty = prefs?.difficulty
                ? String(prefs.difficulty).toLowerCase()
                : null;
            const type = prefs?.questionType || null;

            if (prefs?.category?.name) setSelectedCategory(prefs.category.name);
            else if (initialPreferences?.categoryName) setSelectedCategory(initialPreferences.categoryName);

            const buildUrl = (p) =>
                `https://opentdb.com/api.php?${p.toString()}`;
            const makeParams = (opts) => {
                const p = new URLSearchParams();
                p.append("amount", String(opts.amount ?? amount ?? 10));
                if (opts.categoryId)
                    p.append("category", String(opts.categoryId));
                if (opts.difficulty)
                    p.append("difficulty", String(opts.difficulty));
                if (opts.type) p.append("type", String(opts.type));
                return p;
            };

            const attempts = [
                makeParams({ amount, categoryId, difficulty, type }),
                makeParams({ amount, categoryId, difficulty }),
                makeParams({ amount, difficulty }),
                makeParams({ amount }),
            ];

            let data = null;
            let lastErr = null;

            for (const params of attempts) {
                const url = buildUrl(params);
                try {
                    const ctl = new AbortController();
                    const to = setTimeout(() => ctl.abort(), 10000);
                    const res = await fetch(url, {
                        signal: ctl.signal,
                        mode: "cors",
                    });
                    clearTimeout(to);
                    if (!res.ok) {
                        lastErr = new Error(`API error ${res.status}`);
                        continue;
                    }
                    const json = await res.json();
                    if (
                        json?.response_code === 0 &&
                        Array.isArray(json.results) &&
                        json.results.length > 0
                    ) {
                        data = json;
                        break;
                    } else {
                        lastErr = new Error("No questions for current filters");
                    }
                } catch (e) {
                    lastErr = e;
                    continue;
                }
            }

            if (!data) throw lastErr || new Error("Failed to fetch questions");

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

            const limitFromPrefs =
                typeof prefs?.hintsPerQuiz === "number"
                    ? prefs.hintsPerQuiz
                    : 3;
            setHintsLimit(limitFromPrefs);
            setHintsRemaining(limitFromPrefs);
            setTotalHintsUsed(0);
            if (!prefs || typeof prefs.hintsPerQuiz !== "number") {
                const nextPrefs = {
                    ...(prefs || {}),
                    hintsPerQuiz: limitFromPrefs,
                };
                try {
                    localStorage.setItem(
                        "quizPreferences",
                        JSON.stringify(nextPrefs),
                    );
                } catch {
                    // Ignore localStorage errors
                }
            }

            QuizStateManager.clearQuizState();
        } catch (err) {
            setError(
                `Failed to load questions: ${err?.message || "Unknown error"}`,
            );
        } finally {
            setIsLoading(false);
        }
    }, [timerDuration, isTimerEnabled]);

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

    useEffect(() => {
        if (!showSetup) {
            const hasSavedState = loadSavedQuizState();
            if (!hasSavedState) fetchQuestions();
        }
    }, [showSetup, loadSavedQuizState, fetchQuestions]);

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

        setIsTimerPaused(true);
        setIsResultAnnouncementComplete(false);
    };

    useEffect(() => {
        if (
            isResultAnnouncementComplete &&
            selectedAnswers[currentQuestionIndex]
        ) {
            const moveToNext = () => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    setTimeRemaining(isTimerEnabled ? timerDuration : null);
                    setIsTimerPaused(false);
                    setIsResultAnnouncementComplete(false);
                } else {
                    setQuizCompleted(true);

                    const quizEndTime = Date.now();
                    const totalTimeSpent = quizStartTimestamp
                        ? (quizEndTime - quizStartTimestamp) / 1000
                        : 0;
                    const averageTimePerQuestion = questions.length
                        ? totalTimeSpent / questions.length
                        : 0;

                    BadgeManager.onQuizCompleted &&
                        BadgeManager.onQuizCompleted({
                            score,
                            totalQuestions: questions.length,
                            timeSpent: totalTimeSpent,
                            averageTimePerQuestion,
                        });

                    try {
                        const prev = JSON.parse(
                            localStorage.getItem("quizStats") || "{}",
                        );
                        localStorage.setItem(
                            "quizStats",
                            JSON.stringify({
                                ...prev,
                                lastQuiz: {
                                    score,
                                    totalQuestions: questions.length,
                                    hintsUsed: totalHintsUsed,
                                    timeSpent: totalTimeSpent,
                                },
                            }),
                        );
                    } catch (error) {
                        console.warn("Failed to save quiz stats:", error);
                    }
                }
            };
            setTimeout(moveToNext, 300);
        }
    }, [
        isResultAnnouncementComplete,
        currentQuestionIndex,
        questions.length,
        selectedAnswers,
        score,
        quizStartTimestamp,
        totalHintsUsed,
        isTimerEnabled,
        timerDuration,
    ]);

    const handleTimerExpired = () => handleAnswerSelect(null);
    const handleTimerWarning = () =>
        console.log("Timer warning: 10 seconds remaining");
    const handleResultAnnounced = () => setIsResultAnnouncementComplete(true);

    // Sync external currentQuestionNumber to internal state when provided
    useEffect(() => {
        if (typeof currentQuestionNumber !== "number") return;
        if (questions.length === 0) return;
        const idx = Math.max(0, Math.min(questions.length - 1, currentQuestionNumber - 1));
        if (idx !== currentQuestionIndex) {
            setCurrentQuestionIndex(idx);
        }
    }, [currentQuestionNumber, questions.length]);

    // Notify caller of question changes
    useEffect(() => {
        if (typeof onQuestionChange === "function" && questions.length > 0) {
            onQuestionChange(currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, questions.length, onQuestionChange]);

    // Notify completion to caller once
    const completionSentRef = useRef(false);
    useEffect(() => {
        if (!quizCompleted) return;
        if (completionSentRef.current) return;
        if (typeof onComplete !== "function") return;
        completionSentRef.current = true;
        const timeSpent = quizStartTimestamp
            ? (Date.now() - quizStartTimestamp) / 1000
            : 0;
        const avgTime = questions.length ? timeSpent / questions.length : 0;
        try {
            onComplete({
                score,
                totalQuestions: questions.length,
                questions,
                userAnswers: selectedAnswers.map((a) => a.selectedAnswer),
                quizData: {
                    timeSpent,
                    averageTimePerQuestion: avgTime,
                    hintsUsed: totalHintsUsed,
                },
            });
        } catch (e) {
            // ignore
        }
    }, [quizCompleted]);

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
        setHintsRemaining(0);
        setTotalHintsUsed(0);
    }, []);

    const restartQuiz = () => {
        BonusManager.resetWheelState();
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setQuizCompleted(false);
        setScore(0);
        setIsTimerPaused(false);
        setIsResultAnnouncementComplete(false);
        setHintsRemaining(hintsLimit);
        setTotalHintsUsed(0);
        fetchQuestions();
    };

    const requestHint = useCallback(() => {
        if (quizCompleted || isQuizPaused || showSetup) return false;
        if (hintsRemaining <= 0) return false;
        setHintsRemaining((r) => r - 1);
        setTotalHintsUsed((c) => c + 1);
        return true;
    }, [quizCompleted, isQuizPaused, showSetup, hintsRemaining]);

    useEffect(() => {
        if (
            ConsentManager &&
            ConsentManager.hasConsent &&
            ConsentManager.hasConsent(ConsentManager.categories?.analytics)
        ) {
            console.debug("[analytics] pageview", {
                path: window.location.pathname,
            });
        }
    }, []);

    if (showSetup) return <QuizSetupPage onStart={() => setShowSetup(false)} />;
    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="h-screen theme-screen flex items-center justify-center p-4">
                <div className="app-card rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-4">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {error}
                    </p>
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

    if (quizCompleted && reviewMode) {
        return (
            <QuizReviewWrapper
                questions={questions}
                userAnswers={selectedAnswers.map((a) => a.selectedAnswer)}
                onBack={() => setReviewMode(false)}
            />
        );
    }

    if (quizCompleted) {
        const timeSpent = quizStartTimestamp
            ? (Date.now() - quizStartTimestamp) / 1000
            : 0;
        const avgTime = questions.length ? timeSpent / questions.length : 0;

        // If consumer provided onComplete, delegate navigation/results to caller
        if (typeof onComplete === "function") {
            return null;
        }

        return (
            <>
                <KeyboardShortcuts />
                <QuizResults
                    score={score}
                    totalQuestions={questions.length}
                    onRestart={restartQuiz}
                    onBackToSetup={handleBackToSetup}
                    questions={questions}
                    userAnswers={selectedAnswers}
                    quizData={{
                        timeSpent,
                        averageTimePerQuestion: avgTime,
                        hintsUsed: totalHintsUsed,
                    }}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen theme-screen p-4">
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
                <div className="text-center mb-8 relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Quiz Challenge
                    </h1>
                    <p className="text-purple-200 text-lg">
                        Test your knowledge with{" "}
                        {selectedCategory || "this topic"} questions!
                    </p>

                    <div className="absolute top-0 right-0 flex gap-2 items-center">
                        <button
                            onClick={handlePauseToggle}
                            disabled={quizCompleted}
                            className={`flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 ${quizCompleted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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

                        <ThemeToggle className="bg-white/20 text-white hover:bg-white/30" />

                        <TimerSettings
                            currentDuration={timerDuration}
                            onDurationChange={setTimerDuration}
                            isTimerEnabled={isTimerEnabled}
                            onTimerToggle={setIsTimerEnabled}
                        />

                        <button
                            onClick={() => setShowCelebrationSettings(true)}
                            className="bg-white/20 text-white hover:bg-white/30 p-2 rounded-lg transition-all duration-300 hover:scale-110 border border-white/30"
                            title="Celebration Settings"
                        >
                            <span className="text-lg">🎉</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white/20 rounded-full h-3 mb-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-pink-400 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%`,
                        }}
                    />
                </div>

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

                <div className="text-center mb-6">
                    <span className="bg-white/20 text-white px-4 py-2 rounded-full text-lg font-semibold">
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions.length || 0}
                    </span>
                </div>

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
                        hintsRemaining={hintsRemaining}
                        onRequestHint={requestHint}
                        timeRemaining={timeRemaining}
                        isTimerPaused={isTimerPaused || isQuizPaused}
                    />
                )}
            </div>

            <CelebrationSettings
                isOpen={showCelebrationSettings}
                onClose={() => setShowCelebrationSettings(false)}
            />
        </div>
    );
};

export default QuizApp;
