import { useState, useEffect, useCallback } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import LoadingSpinner from "./LoadingSpinner";
import PauseOverlay from "./PauseOverlay";
import Timer from "./Timer";
import { useTimer } from "../hooks/useTimer";
import {
    saveQuizState,
    loadQuizState,
    clearQuizState,
    hasSavedSession,
    createQuizSnapshot,
    restoreQuizFromSnapshot,
} from "../utils/quizStorage";

const QuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [originalQuestions, setOriginalQuestions] = useState([]);

    // Timer hook with 5 minutes (300000ms)
    const {
        timeRemaining,
        isRunning,
        isPaused,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        formatTime,
        isTimeUp,
    } = useTimer(300000, handleTimeUp);

    useEffect(() => {
        checkForSavedSession();
    }, []);

    // Handle quiz completion when time is up
    function handleTimeUp() {
        if (!quizCompleted) {
            setQuizCompleted(true);
            clearQuizState();
        }
    }

    // Check for saved session on mount
    const checkForSavedSession = () => {
        if (hasSavedSession()) {
            setShowResumeDialog(true);
        } else {
            fetchQuestions();
        }
    };

    // Resume from saved session
    const resumeFromSavedSession = () => {
        const savedState = loadQuizState();
        if (savedState) {
            setCurrentQuestionIndex(savedState.currentQuestionIndex);
            setSelectedAnswers(savedState.selectedAnswers);
            setScore(savedState.score);
            setQuizStartTime(savedState.quizStartTime);

            // Fetch fresh questions to restore correct answers
            fetchQuestionsForResume(savedState);
        }
        setShowResumeDialog(false);
    };

    // Start fresh quiz
    const startFreshQuiz = () => {
        clearQuizState();
        setShowResumeDialog(false);
        fetchQuestions();
    };

    // Fetch questions for resume (restore correct answers)
    const fetchQuestionsForResume = async (savedState) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple",
            );

            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }

            const data = await response.json();

            if (data.response_code !== 0) {
                throw new Error("No questions available");
            }

            const processedQuestions = data.results.map((question) => {
                const answers = [
                    ...question.incorrect_answers,
                    question.correct_answer,
                ];
                const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

                return {
                    ...question,
                    question: decodeHtmlEntities(question.question),
                    correct_answer: decodeHtmlEntities(question.correct_answer),
                    answers: shuffledAnswers.map((answer) =>
                        decodeHtmlEntities(answer),
                    ),
                };
            });

            const restoredState = restoreQuizFromSnapshot(
                savedState,
                processedQuestions,
            );
            if (restoredState) {
                setQuestions(restoredState.questions);
                setOriginalQuestions(processedQuestions);

                // Restore timer
                resetTimer(savedState.timeRemaining);
                if (!savedState.isPaused) {
                    startTimer();
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple",
            );

            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }

            const data = await response.json();

            if (data.response_code !== 0) {
                throw new Error("No questions available");
            }

            // Process questions to decode HTML entities and shuffle answers
            const processedQuestions = data.results.map((question) => {
                const answers = [
                    ...question.incorrect_answers,
                    question.correct_answer,
                ];
                // Shuffle answers
                const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

                return {
                    ...question,
                    question: decodeHtmlEntities(question.question),
                    correct_answer: decodeHtmlEntities(question.correct_answer),
                    answers: shuffledAnswers.map((answer) =>
                        decodeHtmlEntities(answer),
                    ),
                };
            });

            setQuestions(processedQuestions);
            setOriginalQuestions(processedQuestions);
            setQuizStartTime(Date.now());

            // Start timer when questions are loaded
            resetTimer();
            startTimer();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const decodeHtmlEntities = (text) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    };

    const handleAnswerSelect = (selectedAnswer) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correct_answer;

        const answerData = {
            questionIndex: currentQuestionIndex,
            selectedAnswer,
            correctAnswer: currentQuestion.correct_answer,
            isCorrect,
        };

        const newSelectedAnswers = [...selectedAnswers, answerData];
        setSelectedAnswers(newSelectedAnswers);

        const newScore = isCorrect ? score + 1 : score;
        if (isCorrect) {
            setScore(newScore);
        }

        // Save progress after each answer
        saveQuizProgress(newSelectedAnswers, currentQuestionIndex, newScore);

        // Move to next question or complete quiz
        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }, 1000);
        } else {
            setTimeout(() => {
                setQuizCompleted(true);
                clearQuizState(); // Clear saved state on completion
            }, 1000);
        }
    };

    // Save quiz progress
    const saveQuizProgress = (
        answers = selectedAnswers,
        questionIndex = currentQuestionIndex,
        currentScore = score,
    ) => {
        const snapshot = createQuizSnapshot({
            questions,
            currentQuestionIndex: questionIndex,
            selectedAnswers: answers,
            score: currentScore,
            timeRemaining,
            isPaused,
            quizStartTime,
        });

        saveQuizState(snapshot);
    };

    // Pause functionality
    const handlePause = useCallback(() => {
        pauseTimer();
        saveQuizProgress();
    }, [pauseTimer, saveQuizProgress]);

    // Resume functionality
    const handleResume = useCallback(() => {
        resumeTimer();
        saveQuizProgress();
    }, [resumeTimer, saveQuizProgress]);

    // Quit quiz
    const handleQuitQuiz = () => {
        clearQuizState();
        setQuizCompleted(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setScore(0);
        resetTimer();
        fetchQuestions();
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (
                event.code === "Space" &&
                !quizCompleted &&
                questions.length > 0
            ) {
                event.preventDefault();
                if (isPaused) {
                    handleResume();
                } else if (isRunning) {
                    handlePause();
                }
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [
        isPaused,
        isRunning,
        quizCompleted,
        questions.length,
        handlePause,
        handleResume,
    ]);

    const restartQuiz = () => {
        clearQuizState();
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setQuizCompleted(false);
        setScore(0);
        setQuizStartTime(null);
        resetTimer();
        fetchQuestions();
    };

    // Resume dialog
    if (showResumeDialog) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-blue-500 text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Resume Quiz?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We found a saved quiz session. Would you like to
                        continue where you left off?
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={resumeFromSavedSession}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Resume Quiz
                        </button>
                        <button
                            onClick={startFreshQuiz}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Start Fresh
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchQuestions}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (quizCompleted) {
        return (
            <QuizResults
                score={score}
                totalQuestions={questions.length}
                onRestart={restartQuiz}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1"></div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex-1 text-center">
                            Quiz Challenge
                        </h1>
                        <div className="flex-1 flex justify-end">
                            {/* Pause Button */}
                            {questions.length > 0 && !isPaused && (
                                <button
                                    onClick={handlePause}
                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                                    title="Pause Quiz (Spacebar)"
                                >
                                    <div className="flex gap-1">
                                        <div className="w-2 h-6 bg-white rounded"></div>
                                        <div className="w-2 h-6 bg-white rounded"></div>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-purple-200 text-lg">
                        Test your knowledge with these Computer Science
                        questions!
                    </p>
                </div>

                {/* Timer */}
                {questions.length > 0 && (
                    <Timer
                        timeRemaining={timeRemaining}
                        formatTime={formatTime}
                        isRunning={isRunning}
                        isPaused={isPaused}
                        onTimeUp={handleTimeUp}
                    />
                )}

                {/* Progress Bar */}
                <div className="bg-white/20 rounded-full h-3 mb-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                        }}
                    ></div>
                </div>

                {/* Question Counter */}
                <div className="text-center mb-6">
                    <span className="bg-white/20 text-white px-4 py-2 rounded-full text-lg font-semibold">
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions.length}
                    </span>
                </div>

                {/* Quiz Question */}
                {questions.length > 0 && (
                    <QuizQuestion
                        question={questions[currentQuestionIndex]}
                        onAnswerSelect={handleAnswerSelect}
                        selectedAnswer={
                            selectedAnswers[currentQuestionIndex]
                                ?.selectedAnswer
                        }
                        isPaused={isPaused}
                    />
                )}

                {/* Pause Overlay */}
                {isPaused && (
                    <PauseOverlay
                        onResume={handleResume}
                        onQuit={handleQuitQuiz}
                        timeRemaining={timeRemaining}
                        formatTime={formatTime}
                        currentQuestion={currentQuestionIndex}
                        totalQuestions={questions.length}
                    />
                )}
            </div>
        </div>
    );
};

export default QuizApp;
