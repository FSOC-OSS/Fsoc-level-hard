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
import AchievementManager from "../utils/AchievementManager";
import AchievementNotification from "./AchievementNotification";

const QuizApp = () => {
    // core quiz state
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);

    // setup state
    const [showSetup, setShowSetup] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");

    // timer state
    const [timerDuration, setTimerDuration] = useState(30);
    const [isTimerEnabled, setIsTimerEnabled] = useState(true);
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);

    // pause/resume state
    const [isQuizPaused, setIsQuizPaused] = useState(false);
    const [quizStartTime, setQuizStartTime] = useState(null);

    // achievement state
    const [newAchievements, setNewAchievements] = useState([]);
    const [currentStreak, setCurrentStreak] = useState(0);

    const decodeHtmlEntities = (text) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    };

    // Save quiz state to localStorage
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

    // Load quiz state from localStorage
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

    // Handle pause/resume toggle
    const handlePauseToggle = useCallback(() => {
        if (quizCompleted || showSetup) return;

        if (isQuizPaused) {
            // Resume quiz
            setIsQuizPaused(false);
            setIsTimerPaused(false);
            QuizStateManager.clearQuizState();
        } else {
            // Pause quiz
            setIsQuizPaused(true);
            setIsTimerPaused(true);
            saveQuizState();
        }
    }, [isQuizPaused, quizCompleted, showSetup, saveQuizState]);

    // Handle timer updates
    const handleTimerUpdate = useCallback((newTimeRemaining) => {
        setTimeRemaining(newTimeRemaining);
    }, []);

    const fetchQuestions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // read preferences from localStorage (if any)
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
            if (data.response_code !== 0) {
                throw new Error(
                    "No questions available for the selected options. Try changing the number/category/difficulty/type.",
                );
            }

            // prepare questions: decode HTML and shuffle answers
            const processedQuestions = data.results.map((question) => {
                const answers = [
                    ...question.incorrect_answers,
                    question.correct_answer,
                ];
                const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

                const processedQuestion = {
                    ...question,
                    question: decodeHtmlEntities(question.question),
                    correct_answer: decodeHtmlEntities(question.correct_answer),
                    answers: shuffledAnswers.map((a) => decodeHtmlEntities(a)),
                };

                // Generate unique ID for the question
                processedQuestion.id =
                    BookmarkManager.generateQuestionId(processedQuestion);

                return processedQuestion;
            });

            setQuestions(processedQuestions);
            setCurrentQuestionIndex(0);
            setSelectedAnswers([]);
            setQuizCompleted(false);
            setScore(0);
            setQuizStartTime(Date.now());
            setTimeRemaining(isTimerEnabled ? timerDuration : null);
            setIsQuizPaused(false);
            setIsTimerPaused(false);
            setCurrentStreak(0);

            // Clear any previously saved state
            QuizStateManager.clearQuizState();
        } catch (err) {
            setError(err.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    }, [isTimerEnabled, timerDuration]);

    // Function to handle going back to setup with proper cleanup
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

    // load questions after user finishes setup
    useEffect(() => {
        if (!showSetup) {
            // Try to load saved state first
            const hasSavedState = loadSavedQuizState();
            if (!hasSavedState) {
                fetchQuestions();
            }
        }
    }, [showSetup, fetchQuestions, loadSavedQuizState]);

    // Auto-save state periodically when quiz is active and not paused
    useEffect(() => {
        if (
            !isQuizPaused &&
            questions.length > 0 &&
            !quizCompleted &&
            !showSetup
        ) {
            const interval = setInterval(saveQuizState, 5000); // Save every 5 seconds
            return () => clearInterval(interval);
        }
    }, [
        isQuizPaused,
        questions.length,
        quizCompleted,
        showSetup,
        saveQuizState,
    ]);

    // Handle page visibility change to auto-pause
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
        const timeSpent =
            isTimerEnabled && timeRemaining !== null
                ? timerDuration - timeRemaining
                : null;

        const answerData = {
            questionIndex: currentQuestionIndex,
            selectedAnswer,
            correctAnswer: currentQuestion?.correct_answer ?? null,
            isCorrect: Boolean(isCorrect),
            timeSpent,
        };

        setSelectedAnswers((prev) => [...prev, answerData]);
        if (isCorrect) setScore((prev) => prev + 1);

        // Update streak
        if (isCorrect) {
            setCurrentStreak((prev) => prev + 1);
        } else {
            setCurrentStreak(0);
        }

        // Check for immediate speed achievements
        if (isCorrect && timeSpent) {
            let speedAchievements = [];
            if (timeSpent <= 15) {
                const speedDemonBadge =
                    AchievementManager.unlockAchievement("speed-demon");
                if (speedDemonBadge) speedAchievements.push(speedDemonBadge);
            }
            if (timeSpent <= 30) {
                const speedReaderBadge =
                    AchievementManager.unlockAchievement("speed-reader");
                if (speedReaderBadge) speedAchievements.push(speedReaderBadge);
            }
            if (speedAchievements.length > 0) {
                setNewAchievements((prev) => [...prev, ...speedAchievements]);
            }
        }

        // Update streak achievements immediately
        const newStreak = isCorrect ? currentStreak + 1 : 0;
        let streakAchievements = [];
        if (isCorrect && newStreak >= 5) {
            if (newStreak === 5) {
                const badge =
                    AchievementManager.unlockAchievement("streak-starter");
                if (badge) streakAchievements.push(badge);
            } else if (newStreak === 10) {
                const badge = AchievementManager.unlockAchievement("on-fire");
                if (badge) streakAchievements.push(badge);
            } else if (newStreak === 25) {
                const badge =
                    AchievementManager.unlockAchievement("hot-streak");
                if (badge) streakAchievements.push(badge);
            } else if (newStreak === 50) {
                const badge =
                    AchievementManager.unlockAchievement("unstoppable");
                if (badge) streakAchievements.push(badge);
            } else if (newStreak === 100) {
                const badge =
                    AchievementManager.unlockAchievement("legendary-streak");
                if (badge) streakAchievements.push(badge);
            }
        }
        if (streakAchievements.length > 0) {
            setNewAchievements((prev) => [...prev, ...streakAchievements]);
        }

        // pause timer while moving to next
        setIsTimerPaused(true);

        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex((prev) => prev + 1);
                setTimeRemaining(isTimerEnabled ? timerDuration : null);
                setIsTimerPaused(false);
            }, 1000);
        } else {
            setTimeout(() => {
                // Complete quiz and check all achievements
                const finalScore = score + (isCorrect ? 1 : 0);
                const totalQuestions = questions.length;
                const percentage = (finalScore / totalQuestions) * 100;

                let completionAchievements = [];

                // Check score-based achievements
                if (percentage === 100) {
                    const perfectBadge =
                        AchievementManager.unlockAchievement("perfect-score");
                    if (perfectBadge) completionAchievements.push(perfectBadge);
                }
                if (percentage >= 95) {
                    const perfectionistBadge =
                        AchievementManager.unlockAchievement("perfectionist");
                    if (perfectionistBadge)
                        completionAchievements.push(perfectionistBadge);
                }
                if (percentage >= 90) {
                    const excellentBadge =
                        AchievementManager.unlockAchievement("excellent");
                    if (excellentBadge)
                        completionAchievements.push(excellentBadge);
                }
                if (percentage >= 80) {
                    const goodJobBadge =
                        AchievementManager.unlockAchievement("good-job");
                    if (goodJobBadge) completionAchievements.push(goodJobBadge);
                }

                // Update quiz completion stats and check participation achievements
                const participationAchievements =
                    AchievementManager.updateQuizStats({
                        score: finalScore,
                        totalQuestions: totalQuestions,
                        timePerQuestion: null,
                        wasCorrect: isCorrect,
                    });

                const allAchievements = [
                    ...completionAchievements,
                    ...participationAchievements,
                ];
                if (allAchievements.length > 0) {
                    setNewAchievements((prev) => [...prev, ...allAchievements]);
                }

                setQuizCompleted(true);
            }, 1000);
        }
    };

    const handleTimerExpired = () => {
        // treat expiration like selecting no answer
        handleAnswerSelect(null);
    };

    const handleTimerWarning = () => {
        // optional: sound or visual warning
        console.log("Timer warning: 10 seconds remaining");
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setQuizCompleted(false);
        setScore(0);
        setIsTimerPaused(false);
        setIsQuizPaused(false);
        setTimeRemaining(null);
        setCurrentStreak(0);
        setNewAchievements([]);
        QuizStateManager.clearQuizState();
        fetchQuestions();
    };

    // show setup page until user starts quiz
    if (showSetup) {
        return <QuizSetupPage onStart={() => setShowSetup(false)} />;
    }

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
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
                <AchievementNotification
                    achievements={newAchievements}
                    onClose={() => setNewAchievements([])}
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
                <div className="text-center mb-8 relative">
                    <div className="absolute top-0 left-0">
                        <button
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Are you sure you want to go back to setup? Your current progress will be lost.",
                                    )
                                ) {
                                    handleBackToSetup();
                                }
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors flex items-center gap-2 border border-white/30"
                            title="Back to Setup"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Setup
                        </button>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Quiz Challenge
                    </h1>
                    <p className="text-purple-200 text-lg">
                        Test your knowledge with{" "}
                        {selectedCategory || "this topic"} questions!
                    </p>

                    <div className="absolute top-0 right-0 flex gap-2">
                        <button
                            onClick={handlePauseToggle}
                            disabled={quizCompleted}
                            className={`
                                flex items-center justify-center
                                w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg
                                transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40
                                ${quizCompleted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                touch-manipulation
                            `}
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

                <div className="bg-white/20 rounded-full h-3 mb-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-pink-400 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${
                                questions.length
                                    ? ((currentQuestionIndex + 1) /
                                          questions.length) *
                                      100
                                    : 0
                            }%`,
                        }}
                    ></div>
                </div>

                <div className="mb-6">
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
                                onTimeUpdate={handleTimerUpdate}
                                key={`timer-${currentQuestionIndex}`}
                            />
                        </div>
                    )}

                    <div className="text-center">
                        <span className="bg-white/20 text-white px-4 py-2 rounded-full text-lg font-semibold">
                            Question {currentQuestionIndex + 1} of{" "}
                            {questions.length || 0}
                        </span>
                    </div>
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
                    />
                )}

                {isQuizPaused && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20 shadow-xl">
                        <div className="text-white text-lg">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-300/30">
                                <div className="text-4xl">⏸️</div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Quiz Paused
                            </h3>
                            <p className="text-white/80">
                                Click the resume button or press spacebar to
                                continue.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <AchievementNotification
                achievements={newAchievements}
                onClose={() => setNewAchievements([])}
            />
        </div>
    );
};

export default QuizApp;
