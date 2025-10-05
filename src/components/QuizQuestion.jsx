"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import BookmarkManager from "../utils/BookmarkManager";
import BadgeManager from "../utils/BadgeManager";
import FeedbackManager from "../utils/FeedbackManager";
import VoiceControls from "./VoiceControls";
import VoiceSettings from "./VoiceSettings";
import StarRating from "./StarRating";
import ReportModal from "./ReportModal";
import CommentSection from "./CommentSection";
import ThankYouModal from "./ThankYouModal";
import { useVoice } from "../hooks/useVoice";
import CelebrationManager from "../utils/CelebrationManager";
import correctSfx from "../assets/correct.mp3";
import wrongSfx from "../assets/wrong.mp3";

const QuizQuestion = ({
    question,
    onAnswerSelect,
    selectedAnswer,
    isTimerEnabled,
    onResultAnnounced,
    hintsRemaining,
    onRequestHint,
    userId,
    username,
    onRatingSubmit,
    timeRemaining,
    isTimerPaused,
}) => {
    // Local state
    const [clickedAnswer, setClickedAnswer] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isTimedOut, setIsTimedOut] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isAnnouncingResult, setIsAnnouncingResult] = useState(false);
    const [hasResultBeenAnnounced, setHasResultBeenAnnounced] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [eliminatedIndices, setEliminatedIndices] = useState(new Set());
    const [shuffledIndices, setShuffledIndices] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [lastShuffleTime, setLastShuffleTime] = useState(null);
    const [shuffleCounter, setShuffleCounter] = useState(0);
    // Audio refs for correct/incorrect sounds
    const correctAudioRef = useRef(null);
    const wrongAudioRef = useRef(null);

    // Feedback states
    const [showFeedbackSection, setShowFeedbackSection] = useState(false);
    const [feedbackSummary, setFeedbackSummary] = useState(null);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [thankYouType, setThankYouType] = useState(null);

    const {
        isListening,
        isSpeaking,
        transcript,
        voiceSettings,
        availableVoices,
        microphonePermission,
        speak,
        stopSpeaking,
        startListening,
        stopListening,
        parseVoiceAnswer,
        updateVoiceSettings,
        setTranscript,
    } = useVoice();

    // Generate a stable question ID
    const questionId = question ? (question.id || BookmarkManager.generateQuestionId(question)) : null;

    // --- FIX 1: Defined the missing `loadFeedbackSummary` function ---
    // This function fetches ratings and comment counts for the current question.
    const loadFeedbackSummary = useCallback(async () => {
        if (!questionId) return;
        try {
            const summary = await FeedbackManager.getFeedbackSummary(questionId);
            setFeedbackSummary(summary);
        } catch (error) {
            console.error("Failed to load feedback summary:", error);
            setFeedbackSummary(null); // Reset on error
        }
    }, [questionId]);


    // Effect to reset state when a new question is loaded
    useEffect(() => {
        // Initialize audio elements once
        try {
            correctAudioRef.current = new Audio(correctSfx);
            wrongAudioRef.current = new Audio(wrongSfx);
            // sensible default volume for SFX; can be adjusted later
            if (correctAudioRef.current) correctAudioRef.current.volume = 0.75;
            if (wrongAudioRef.current) wrongAudioRef.current.volume = 0.75;
            // preload to reduce latency
            if (correctAudioRef.current) correctAudioRef.current.preload = "auto";
            if (wrongAudioRef.current) wrongAudioRef.current.preload = "auto";
        } catch (e) {
            // ignore audio init failures (browser restrictions, etc.)
            console.warn("Failed to initialize answer sound effects:", e);
        }

        setClickedAnswer(null);
        setIsTimedOut(false);
        setShowResult(false);
        setIsAnnouncingResult(false);
        setHasResultBeenAnnounced(false);
        setQuestionStartTime(Date.now());
        stopSpeaking();
        setTranscript("");
        setHintsUsed(0);
        setEliminatedIndices(new Set());
        setIsShuffling(false);
        setLastShuffleTime(null);
        setShuffleCounter(0);
        setShowHint(false);

        // --- FIX 3: Make answer shuffling dynamic based on answer count ---
        if (question && question.answers) {
            const initialIndices = Array.from({ length: question.answers.length }, (_, i) => i);
            setShuffledIndices(initialIndices);
        }

        if (questionId) {
            setIsBookmarked(BookmarkManager.isBookmarked(questionId));
            loadFeedbackSummary();
        }

    }, [question, questionId, stopSpeaking, setTranscript, loadFeedbackSummary]);
    
    // --- FIX 2: Added robust logic to handle timer expiration ---
    // This effect watches the `timeRemaining` prop to set the timeout state internally.
    useEffect(() => {
        if (isTimerEnabled && timeRemaining !== null && timeRemaining <= 0 && !selectedAnswer && !clickedAnswer) {
            setIsTimedOut(true);
        }
    }, [timeRemaining, isTimerEnabled, selectedAnswer, clickedAnswer]);


    // Show result when answer selected or timed out
    useEffect(() => {
        if ((selectedAnswer !== undefined || clickedAnswer || isTimedOut) && !showResult) {
            setShowResult(true);
        }
    }, [selectedAnswer, clickedAnswer, isTimedOut, showResult]);

    // Timer-synchronized shuffle effect (every 3 seconds)
    useEffect(() => {
        if (
            isTimerEnabled &&
            timeRemaining !== null &&
            timeRemaining !== lastShuffleTime &&
            !selectedAnswer &&
            !clickedAnswer &&
            !isTimedOut &&
            !isTimerPaused &&
            !isAnnouncingResult &&
            timeRemaining > 0 &&
            question.answers.length > 2
        ) {
            setLastShuffleTime(timeRemaining);
            setShuffleCounter((prev) => prev + 1);

            if (shuffleCounter > 0 && shuffleCounter % 3 === 0) {
                setIsShuffling(true);

                // Dynamically create indices array based on the number of answers
                const newIndices = Array.from({ length: question.answers.length }, (_, i) => i).sort(() => Math.random() - 0.5);

                setTimeout(() => {
                    setShuffledIndices(newIndices);
                    setTimeout(() => setIsShuffling(false), 150);
                }, 100);
            }
        }
    }, [
        timeRemaining,
        selectedAnswer,
        clickedAnswer,
        isTimedOut,
        isTimerPaused,
        isAnnouncingResult,
        isTimerEnabled,
        lastShuffleTime,
        shuffleCounter,
        question.answers.length
    ]);

    // Handle answer click with celebration effects
    const handleAnswerClick = (answer, event) => {
        if (selectedAnswer || isAnnouncingResult) return;

        const answerTime = questionStartTime ? (Date.now() - questionStartTime) / 1000 : 0;
        const isCorrect = answer === question.correct_answer;

        const answerElement = event.currentTarget;

        // Celebration effects
        CelebrationManager.createRippleEffect(answerElement, "rgba(139, 92, 246, 0.3)", event);
        CelebrationManager.bounceElement(answerElement, "light");

        if (isCorrect) {
            setTimeout(() => {
                CelebrationManager.animateCorrectAnswer(answerElement);
                CelebrationManager.triggerHapticFeedback("success");
                CelebrationManager.createSparkles(answerElement, 3);
            }, 200);
        } else {
            setTimeout(() => {
                CelebrationManager.animateIncorrectAnswer(answerElement);
                CelebrationManager.triggerHapticFeedback("error");
            }, 200);
        }

        BadgeManager.onAnswerSubmitted(isCorrect, answerTime);

        setClickedAnswer(answer);
        onAnswerSelect(answer);
    };

    // Hint system
    const handleHintRequest = () => {
        if (
            hintsUsed >= 1 ||
            hintsRemaining <= 0 ||
            selectedAnswer ||
            clickedAnswer ||
            isTimedOut ||
            question.answers.length <= 2
        ) {
            return;
        }
        if (typeof onRequestHint === "function" && onRequestHint()) {
            setHintsUsed(1);
            setShowHint(true);
            eliminateTwoWrongAnswers();
            BadgeManager.onHintUsed();
        }
    };

    const eliminateTwoWrongAnswers = () => {
        const wrong = question.answers.map((ans, idx) => ({ ans, idx })).filter((x) => x.ans !== question.correct_answer);
        const shuffled = [...wrong].sort(() => Math.random() - 0.5);
        const toRemove = shuffled.slice(0, Math.min(2, wrong.length)).map((x) => x.idx);
        setEliminatedIndices(new Set(toRemove));
    };

    const getHintText = () => {
        if (hintsUsed === 1 && eliminatedIndices.size > 0) {
            const letters = Array.from(eliminatedIndices)
                .sort((a, b) => a - b)
                .map((i) => String.fromCharCode(65 + shuffledIndices.indexOf(i))); // Get displayed letter
            return `50/50 used: Eliminated options ${letters.join(" and ")}.`;
        }
        return "";
    };


    // Bookmark toggle
    const handleBookmarkToggle = () => {
        const result = BookmarkManager.toggleBookmark(question);
        if (result.success) {
            setIsBookmarked(!isBookmarked);
            if (result.action === "added") {
                BadgeManager.onBookmarkAdded();
            }
        }
    };

    // Speak result
    useEffect(() => {
        if (showResult && question && !hasResultBeenAnnounced) {
            const isCorrect = (selectedAnswer || clickedAnswer) === question.correct_answer;
            const correctIndex = question.answers.indexOf(question.correct_answer);
            const correctOption = String.fromCharCode(65 + correctIndex);

            let resultText = "";
            if (isTimedOut) {
                resultText = `Time's up! The correct answer was "${question.correct_answer}", option ${correctOption}.`;
            } else if (isCorrect) {
                resultText = "Correct! Well done!";
            } else {
                resultText = `Incorrect. The correct answer was "${question.correct_answer}", option ${correctOption}.`;
            }

            setIsAnnouncingResult(true);
            // Play SFX if enabled in CelebrationManager settings
            try {
                const settings = CelebrationManager.getSettings();
                if (settings && settings.enableSound) {
                    if (isTimedOut || !isCorrect) {
                        if (wrongAudioRef.current) {
                            wrongAudioRef.current.pause();
                            try { wrongAudioRef.current.currentTime = 0; } catch(e){}
                            wrongAudioRef.current.play().catch(() => {});
                        }
                    } else if (isCorrect) {
                        if (correctAudioRef.current) {
                            correctAudioRef.current.pause();
                            try { correctAudioRef.current.currentTime = 0; } catch(e){}
                            correctAudioRef.current.play().catch(() => {});
                        }
                    }
                }
            } catch (e) {
                console.warn('Error playing answer SFX:', e);
            }

            speak(resultText, () => {
                setIsAnnouncingResult(false);
                setHasResultBeenAnnounced(true);
                if (onResultAnnounced) onResultAnnounced();
            });
        }
    }, [showResult, selectedAnswer, clickedAnswer, isTimedOut, question, hasResultBeenAnnounced, speak, onResultAnnounced]);

    // cleanup audio on unmount
    useEffect(() => {
        return () => {
            try {
                if (correctAudioRef.current) {
                    correctAudioRef.current.pause();
                    correctAudioRef.current.src = "";
                }
                if (wrongAudioRef.current) {
                    wrongAudioRef.current.pause();
                    wrongAudioRef.current.src = "";
                }
            } catch (e) {
                // no-op
            }
        };
    }, []);

    // Button classes
    const getButtonClass = (answer) => {
        const base = "w-full p-4 text-left rounded-lg font-medium transition-all duration-300 transform ";
        if (!selectedAnswer && !clickedAnswer && !isTimedOut) {
            return base + "bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 hover:scale-105 hover:shadow-lg text-gray-800 dark:text-gray-200 border-2 border-transparent hover:border-purple-300 ripple-container";
        }
        if (selectedAnswer !== undefined || clickedAnswer || isTimedOut) {
            if (answer === question.correct_answer)
                return base + "bg-green-500 text-white border-2 border-green-600 scale-105 shadow-lg animate-pulse";
            if (answer === (selectedAnswer || clickedAnswer))
                return base + "bg-red-500 text-white border-2 border-red-600 scale-105 shadow-lg";
            return base + "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 border-2 border-gray-400 opacity-60";
        }
        return base;
    };

    const getAnswerIcon = (answer) => {
        if (selectedAnswer === undefined && !clickedAnswer && !isTimedOut) return null;
        if (answer === question.correct_answer) return <span className="text-2xl">✓</span>;
        if (answer === (selectedAnswer || clickedAnswer)) return <span className="text-2xl">✗</span>;
        return null;
    };
    
    if (!question) {
        return <div>Loading question...</div>; // or some placeholder
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-3xl mx-auto relative" data-quiz-question="true">
                {/* Voice Controls */}
                <div className="absolute top-4 right-4 z-10 no-print">
                    <VoiceControls
                        question={question}
                        onAnswerSelect={handleAnswerClick}
                        selectedAnswer={selectedAnswer || clickedAnswer}
                        isListening={isListening}
                        isSpeaking={isSpeaking}
                        transcript={transcript}
                        microphonePermission={microphonePermission}
                        onSpeak={speak}
                        onStopSpeaking={stopSpeaking}
                        onStartListening={startListening}
                        onStopListening={stopListening}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        parseVoiceAnswer={parseVoiceAnswer}
                        setTranscript={setTranscript}
                        isTimedOut={isTimedOut}
                        showResult={showResult}
                        isAnnouncingResult={isAnnouncingResult}
                    />
                </div>

                {/* Header */}
                <div className="mb-8 pr-48 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
                                <span className="text-2xl">🤔</span>
                            </div>
                            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">{question.category}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-relaxed">{question.question}</h2>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                {question.difficulty}
                            </span>
                            <span className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                                {question.type === 'multiple' ? 'Multiple Choice' : 'True / False'}
                            </span>
                            {isTimerEnabled && (
                                <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                                    ⏱️ Timed
                                </span>
                            )}
                            {isAnnouncingResult && (
                                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                                    🔊 Announcing Result...
                                </span>
                            )}
                            {feedbackSummary && feedbackSummary.rating.count > 0 && (
                                <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                                    ⭐ {Number(feedbackSummary.rating.average).toFixed(1)} ({feedbackSummary.rating.count})
                                </span>
                            )}
                            {feedbackSummary && feedbackSummary.reported && (
                                <span className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">
                                    🚩 Reported
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Bookmark and Hint */}
                    <div className="flex flex-col gap-2 items-center no-print">
                         <div className="flex gap-2 items-center">
                            <button
                                onClick={(e) => {
                                    handleHintRequest();
                                    if (hintsUsed < 1 && hintsRemaining > 0 && !selectedAnswer && !clickedAnswer && !isTimedOut) {
                                        CelebrationManager.createRippleEffect(e.target, "rgba(255, 193, 7, 0.4)", e);
                                        CelebrationManager.triggerHapticFeedback("light");
                                    }
                                }}
                                disabled={hintsUsed >= 1 || hintsRemaining <= 0 || !!selectedAnswer || !!clickedAnswer || isTimedOut || question.answers.length <= 2}
                                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ripple-container ${
                                    hintsUsed >= 1 || hintsRemaining <= 0 || !!selectedAnswer || !!clickedAnswer || isTimedOut || question.answers.length <= 2
                                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                        : "text-yellow-500 hover:text-yellow-600"
                                }`}
                                title={hintsRemaining <= 0 ? "No hints remaining" : "Use 50/50 hint"}
                                aria-label="Use 50/50 hint"
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className="px-2 py-1 rounded-md text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" aria-live="polite">
                                {hintsRemaining}
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                handleBookmarkToggle();
                                CelebrationManager.createRippleEffect(e.target, "rgba(255, 152, 0, 0.4)", e);
                                CelebrationManager.bounceElement(e.target, "light");
                                CelebrationManager.triggerHapticFeedback("light");
                            }}
                            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ripple-container ${isBookmarked ? "text-orange-500 hover:text-orange-600" : "text-gray-400 dark:text-gray-500 hover:text-orange-500"}`}
                            title={isBookmarked ? "Remove bookmark" : "Bookmark this question"}
                        >
                            <svg className="w-6 h-6 transition-all duration-300" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Hint Display */}
                {showHint && (
                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg animate-fadeInUp">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-yellow-600 dark:text-yellow-400">💡</div>
                            <span className="font-semibold text-yellow-800 dark:text-yellow-200">Hint:</span>
                        </div>
                        <p className="text-yellow-700 dark:text-yellow-300">{getHintText()}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {shuffledIndices.map((originalIndex, displayPosition) => {
                        const answer = question.answers[originalIndex];
                        const isEliminated = eliminatedIndices.has(originalIndex);
                        return (
                            <button
                                key={`${originalIndex}-${displayPosition}`}
                                onClick={(e) => handleAnswerClick(answer, e)}
                                disabled={selectedAnswer !== undefined || clickedAnswer || isTimedOut || isAnnouncingResult || isEliminated || isShuffling}
                                className={`${getButtonClass(answer)} ${
                                    isEliminated
                                        ? "opacity-0 scale-95 pointer-events-none h-0 py-0 my-0 overflow-hidden"
                                        : isShuffling
                                            ? "transition-all duration-200 transform scale-98 opacity-80"
                                            : "transition-all duration-300 transform scale-100 opacity-100"
                                } relative overflow-hidden`}
                                data-quiz-answer="true"
                                data-answer-index={originalIndex}
                                aria-hidden={isEliminated ? "true" : "false"}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-gray-600 rounded-full flex items-center justify-center text-purple-600 dark:text-gray-200 font-bold transition-all duration-200 ${isShuffling ? "animate-pulse" : ""}`}>
                                            {String.fromCharCode(65 + displayPosition)}
                                        </div>
                                        <span className="text-lg">{answer}</span>
                                    </div>
                                    {getAnswerIcon(answer)}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Result */}
                {(showResult) && (
                    <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-fadeInUp">
                        <div className="flex items-center gap-2 flex-wrap">
                            {isTimedOut ? (
                                <>
                                    <span className="text-2xl">⏱️</span>
                                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-lg">
                                        Time's up! The correct answer was: {question.correct_answer}
                                    </span>
                                </>
                            ) : (selectedAnswer || clickedAnswer) === question.correct_answer ? (
                                <>
                                    <span className="text-2xl">🎉</span>
                                    <span className="text-green-600 dark:text-green-400 font-semibold text-lg">Correct!</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-2xl">😔</span>
                                    <span className="text-red-600 dark:text-red-400 font-semibold text-lg">
                                        Incorrect. The correct answer is: {question.correct_answer}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Feedback Section - Shows after answer is selected */}
                {(showResult) && (
                    <div className="mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6 animate-fadeInUp">
                        {/* Star Rating */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">How would you rate this question?</p>
                            <StarRating
                                questionId={questionId}
                                userId={userId}
                                onRatingSubmit={(rating) => {
                                    if (onRatingSubmit) onRatingSubmit(rating);
                                    setThankYouType('rating');
                                    setShowThankYouModal(true);
                                    setTimeout(() => loadFeedbackSummary(), 500);
                                }}
                            />
                        </div>

                        {/* Report & Comments Button */}
                        <div className="flex justify-between items-center">
                            <ReportModal
                                questionId={questionId}
                                userId={userId}
                                question={question}
                                onReportSubmitted={() => {
                                    setThankYouType('report');
                                    setShowThankYouModal(true);
                                    setTimeout(() => loadFeedbackSummary(), 500);
                                }}
                            />
                            
                            <button
                                onClick={() => setShowFeedbackSection(!showFeedbackSection)}
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
                            >
                                {showFeedbackSection ? "Hide Comments" : "View Comments"} 
                                {feedbackSummary?.commentCount > 0 && ` (${feedbackSummary.commentCount})`}
                            </button>
                        </div>

                        {/* Comment Section - Expandable */}
                        {showFeedbackSection && (
                            <div className="animate-fadeInUp">
                                <CommentSection
                                    questionId={questionId}
                                    userId={userId}
                                    username={username}
                                    onCommentPosted={() => {
                                        setThankYouType('comment');
                                        setShowThankYouModal(true);
                                        loadFeedbackSummary();
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Voice Settings Modal */}
            <VoiceSettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                voiceSettings={voiceSettings}
                availableVoices={availableVoices}
                onUpdateSettings={updateVoiceSettings}
            />

            {/* Thank You Modal */}
            <ThankYouModal
                isOpen={showThankYouModal}
                onClose={() => setShowThankYouModal(false)}
                feedbackType={thankYouType}
            />
        </>
    );
};

export default QuizQuestion;