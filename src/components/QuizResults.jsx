"use client";

import React, { useState, useEffect } from "react";
import BadgeManager from "../utils/BadgeManager";
import AchievementNotification from "./AchievementNotification";

const QuizResults = ({
    score,
    totalQuestions,
    onRestart,
    onBackToSetup,
    quizData = {},
}) => {
    const [newBadges, setNewBadges] = useState([]);
    const [showAchievements, setShowAchievements] = useState(false);
    const percentage = Math.round((score / totalQuestions) * 100);

    useEffect(() => {
        BadgeManager.initializeBadgeSystem();

        const earnedBadges = BadgeManager.onQuizCompleted({
            score,
            totalQuestions,
            timeSpent: quizData.timeSpent || 0,
            averageTimePerQuestion: quizData.averageTimePerQuestion || 30,
        });

        if (earnedBadges.length > 0) {
            setNewBadges(earnedBadges);
            setShowAchievements(true);
        }
    }, [score, totalQuestions, quizData]);

    const handleShareResult = () => {
        const shareText = `I just scored ${score}/${totalQuestions} (${percentage}%) on this quiz! 🎯`;

        if (navigator.share) {
            navigator.share({
                title: "Quiz Results",
                text: shareText,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(shareText);
            alert("Results copied to clipboard!");
        }

        BadgeManager.onResultShared();
    };

    const getResultMessage = () => {
        if (percentage >= 90)
            return {
                message: "Outstanding! 🏆",
                emoji: "🎯",
                color: "text-yellow-600",
            };
        if (percentage >= 80)
            return {
                message: "Excellent! 🌟",
                emoji: "⭐",
                color: "text-green-600",
            };
        if (percentage >= 70)
            return {
                message: "Great Job! 👏",
                emoji: "👍",
                color: "text-blue-600",
            };
        if (percentage >= 50)
            return {
                message: "Good Effort! 💪",
                emoji: "👌",
                color: "text-purple-600",
            };
        return {
            message: "Keep Trying! 📚",
            emoji: "💪",
            color: "text-red-600",
        };
    };

    const result = getResultMessage();

    return (
        <>
            {showAchievements && newBadges.length > 0 && (
                <AchievementNotification
                    badges={newBadges}
                    onClose={() => setShowAchievements(false)}
                    onViewAll={() => {
                        setShowAchievements(false);
                        window.location.href = "/badges";
                    }}
                />
            )}

            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform animate-pulse">
                    <div className="text-8xl mb-6 animate-bounce">
                        {result.emoji}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Quiz Complete!
                    </h2>

                    <p
                        className={`text-2xl font-semibold mb-6 ${result.color}`}
                    >
                        {result.message}
                    </p>

                    {/* New Badges Display */}
                    {newBadges.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                                🎉 New Achievements Unlocked!
                            </h3>
                            <div className="flex justify-center gap-3 mb-4">
                                {newBadges.slice(0, 3).map((badge, index) => (
                                    <div
                                        key={badge.id}
                                        className="flex flex-col items-center bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-3 border-2 border-yellow-300"
                                    >
                                        <div className="text-2xl mb-1">
                                            {badge.icon}
                                        </div>
                                        <div className="text-xs font-medium text-gray-700 text-center">
                                            {badge.name}
                                        </div>
                                    </div>
                                ))}
                                {newBadges.length > 3 && (
                                    <div className="flex items-center justify-center bg-purple-100 rounded-lg p-3 border-2 border-purple-300">
                                        <span className="text-sm font-bold text-purple-700">
                                            +{newBadges.length - 3} more
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <div className="text-6xl font-bold text-gray-800 mb-2">
                            {score}/{totalQuestions}
                        </div>
                        <div className="text-xl text-gray-600 mb-4">
                            {percentage}% Correct
                        </div>

                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg
                                className="w-32 h-32 transform -rotate-90"
                                viewBox="0 0 120 120"
                            >
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(percentage / 100) * 314} 314`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-purple-600">
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {score}
                            </div>
                            <div className="text-sm text-green-700">
                                Correct
                            </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {totalQuestions - score}
                            </div>
                            <div className="text-sm text-red-700">
                                Incorrect
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onRestart}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                            data-quiz-restart="true"
                        >
                            🔄 Try Again
                        </button>

                        <button
                            onClick={onBackToSetup}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            ⚙️ Back to Setup
                        </button>

                        <button
                            onClick={() =>
                                window.open("https://opentdb.com/", "_blank")
                            }
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            🌐 More Quizzes
                        </button>
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            onClick={handleShareResult}
                            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            📱 Share Results
                        </button>

                        <button
                            onClick={() => (window.location.href = "/badges")}
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            🏆 View All Achievements
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizResults;
