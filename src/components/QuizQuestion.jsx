"use client";

import { useState, useEffect } from "react";
import BookmarkManager from "../utils/BookmarkManager";
import AchievementManager from "../utils/AchievementManager";

const QuizQuestion = ({
    question,
    onAnswerSelect,
    selectedAnswer,
    isTimerEnabled,
}) => {
    const [clickedAnswer, setClickedAnswer] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Reset clickedAnswer when question changes and check bookmark status
    useEffect(() => {
        setClickedAnswer(null);
        const questionId =
            question.id || BookmarkManager.generateQuestionId(question);
        setIsBookmarked(BookmarkManager.isBookmarked(questionId));
    }, [question]);

    const handleAnswerClick = (answer) => {
        if (selectedAnswer) return; // Prevent multiple selections

        setClickedAnswer(answer);
        onAnswerSelect(answer);
    };

    const handleBookmarkToggle = () => {
        const result = BookmarkManager.toggleBookmark(question);
        if (result.success) {
            setIsBookmarked(!isBookmarked);

            // Track bookmark achievement if bookmarking (not removing)
            if (!isBookmarked) {
                AchievementManager.updateBookmarkStats();
            }
        }
    };

    const getButtonClass = (answer) => {
        const baseClass =
            "w-full p-4 text-left rounded-lg font-medium transition-all duration-300 transform ";

        if (!selectedAnswer && !clickedAnswer) {
            return (
                baseClass +
                "bg-white hover:bg-purple-50 hover:scale-105 hover:shadow-lg text-gray-800 border-2 border-transparent hover:border-purple-300"
            );
        }

        if (selectedAnswer || clickedAnswer) {
            if (answer === question.correct_answer) {
                return (
                    baseClass +
                    "bg-green-500 text-white border-2 border-green-600 scale-105 shadow-lg"
                );
            } else if (answer === (selectedAnswer || clickedAnswer)) {
                return (
                    baseClass +
                    "bg-red-500 text-white border-2 border-red-600 scale-105 shadow-lg"
                );
            } else {
                return (
                    baseClass +
                    "bg-gray-300 text-gray-600 border-2 border-gray-400"
                );
            }
        }

        return baseClass;
    };

    const getAnswerIcon = (answer) => {
        if (!selectedAnswer && !clickedAnswer) return null;

        if (answer === question.correct_answer) {
            return <span className="text-2xl">✓</span>;
        } else if (answer === (selectedAnswer || clickedAnswer)) {
            return <span className="text-2xl">✗</span>;
        }

        return null;
    };

    return (
        <div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto"
            data-quiz-question="true"
        >
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <span className="text-2xl">🤔</span>
                        </div>
                        <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                            {question.category}
                        </span>
                    </div>
                    <button
                        onClick={handleBookmarkToggle}
                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                            isBookmarked
                                ? "text-orange-500 hover:text-orange-600"
                                : "text-gray-400 hover:text-orange-500"
                        }`}
                        title={
                            isBookmarked
                                ? "Remove bookmark"
                                : "Bookmark this question"
                        }
                    >
                        <svg
                            className="w-6 h-6 transition-all duration-300"
                            fill={isBookmarked ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                    </button>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                    {question.question}
                </h2>

                <div className="flex items-center gap-2 mt-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {question.difficulty}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {question.type}
                    </span>
                    {isTimerEnabled && (
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            ⏱️ Timed
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {question.answers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick(answer)}
                        disabled={selectedAnswer || clickedAnswer}
                        className={getButtonClass(answer)}
                        data-quiz-answer="true"
                        data-answer-index={index}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className="text-lg">{answer}</span>
                            </div>
                            {getAnswerIcon(answer)}
                        </div>
                    </button>
                ))}
            </div>

            {(selectedAnswer || clickedAnswer) && (
                <div className="mt-6 p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                        {(selectedAnswer || clickedAnswer) ===
                        question.correct_answer ? (
                            <>
                                <span className="text-2xl">🎉</span>
                                <span className="text-green-600 font-semibold text-lg">
                                    Correct!
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl">😔</span>
                                <span className="text-red-600 font-semibold text-lg">
                                    Incorrect. The correct answer is:{" "}
                                    {question.correct_answer}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizQuestion;
