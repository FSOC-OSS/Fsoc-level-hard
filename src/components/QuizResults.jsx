"use client";

import { useEffect, useState } from "react";
import BadgeManager from "../utils/BadgeManager";
import AchievementNotification from "./AchievementNotification";
import QuizReview from "./QuizReview";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import BadgeManager from "../utils/BadgeManager";

const QuizResults = ({ score, totalQuestions, baseScore = 0, bonusScore = 0, bestStreak = 0, streakEvents = [], onRestart, onBackToSetup }) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const [showAchievements, setShowAchievements] = useState(false);
    const [newBadges, setNewBadges] = useState([]);
    const quizData = { timeSpent: 0, averageTimePerQuestion: 0 };
const QuizResults = ({ 
    score, 
    totalQuestions, 
    onRestart, 
    onBackToSetup, 
    quizData = {},
    questions = [],
    userAnswers = []
}) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const [newBadges, setNewBadges] = useState([]);
    const [showAchievements, setShowAchievements] = useState(false);
    const [showReview, setShowReview] = useState(false);

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

    // PDF Export function

    const handleDownloadPDF = () => {
        try {
            const doc = new jsPDF();

            // Branding / Header
            doc.setFillColor(139, 92, 246);  // Purple background
            doc.rect(0, 0, 210, 30, 'F');   // Full width header rect
            doc.setTextColor(255, 255, 255); // White text
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text("Quiz Results", 105, 20, { align: 'center' });

            // Content style
            doc.setTextColor(0);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');

            // Score summary box
            doc.setFillColor(230, 230, 250); // light lavender bg
            doc.roundedRect(15, 40, 180, 60, 5, 5, 'F'); // rounded rect

            doc.setTextColor(75, 0, 130); // dark purple text
            doc.setFontSize(18);
            doc.text(`Score: ${score} / ${totalQuestions}`, 25, 60);
            doc.text(`Percentage: ${percentage}%`, 25, 75);
            doc.text(`Result: ${result.message.replace(/[^\x00-\x7F]/g, "")}`, 25, 90); // emoji removed for font safety

            // Date and Time
            const now = new Date();
            doc.setFontSize(12);
            doc.setTextColor(50);
            doc.text(`Date: ${now.toLocaleDateString()}`, 25, 110);
            doc.text(`Time: ${now.toLocaleTimeString()}`, 110, 110);



            // Footer thank you note
            doc.setFontSize(10);
            doc.setTextColor(120);
            doc.text("Thank you for participating!", 105, 280, { align: 'center' });

            // Save PDF
            doc.save("quiz-results.pdf");
        } catch (error) {
            alert("Oops! Failed to generate PDF. Please try again.");
        }
    };


    // Twitter share
    const handleShareTwitter = () => {
        const text = encodeURIComponent(
            `I scored ${score}/${totalQuestions} (${percentage}%) - ${result.message} in this quiz! If you want to try more quizzes , Try it yourself:`
        );
        const url = encodeURIComponent("https://opentdb.com/");
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            "_blank",
            "width=600,height=400"
        );
    };

    // Facebook share
    const handleShareFacebook = () => {
        const url = encodeURIComponent("https://opentdb.com/");
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            "_blank",
            "width=600,height=400"
        );
    };

    // Copy link with encoded results
    const handleCopyLink = () => {
        const shareUrl = `${window.location.href}?score=${score}&total=${totalQuestions}&percent=${percentage}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("Shareable link copied to clipboard!");
        });
    };

    const handleReviewAnswers = () => {
        setShowReview(true);
    };

    const handleBackFromReview = () => {
        setShowReview(false);
    };

                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                        {score}/{totalQuestions}
                    </div>
                    <div className="text-xl text-gray-600 mb-4">{percentage}% Correct</div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-lg bg-white border">
                            <div className="text-gray-500">Base Points</div>
                            <div className="text-xl font-bold text-gray-800">{baseScore}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white border">
                            <div className="text-gray-500">Bonus Points</div>
                            <div className="text-xl font-bold text-green-600">+{bonusScore}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white border col-span-2">
                            <div className="text-gray-500">Best Streak</div>
                            <div className="text-xl font-bold text-orange-600">🔥 {bestStreak}x</div>
                        </div>
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
                            <span className="text-2xl font-bold text-purple-600">{percentage}%</span>
                        </div>
                    </div>

                    {streakEvents && streakEvents.length > 0 && (
                        <div className="text-left mt-4">
                            <div className="font-semibold text-gray-700 mb-2">Streak Highlights</div>
                            <ul className="space-y-1 max-h-32 overflow-auto pr-2">
                                {streakEvents.map((e, i) => (
                                    <li key={i} className="text-sm text-gray-600">
                                        {e.type === "milestone" ? (
                                            <span>🔥 Reached {e.value}x at Q{(e.index ?? 0) + 1}</span>
                                        ) : (
                                            <span>⚡ Streak broke at {e.value}x on Q{(e.index ?? 0) + 1}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{score}</div>
                        <div className="text-sm text-green-700">Correct</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                            {totalQuestions - score}
                        </div>
                    </div>
                </div>
                <div className="space-y-3 mb-8">
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
                        onClick={() => window.open("https://opentdb.com/", "_blank")}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        🌐 More Quizzes
                    </button>
                </div>
    // If showing review, render QuizReview component
    if (showReview) {
        return (
            <QuizReview
                questions={questions}
                userAnswers={userAnswers}
                onBack={handleBackFromReview}
            />
        );
    }

    return (
        <>
            {showAchievements && (
                <AchievementNotification
                    badges={newBadges}
                    onClose={() => setShowAchievements(false)}
                    onViewAll={() => {
                        setShowAchievements(false);
                        // Navigate to badges page if needed
                    }}
                />
            )}
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-2 sm:p-4 md:p-6">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full text-center">

                    {/* Emoji - Responsive sizing */}
                    <div className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">{result.emoji}</div>

                    {/* Title - Remove duplicate */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                        Quiz Complete!
                    </h2>

                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">

                        {/* Score Display - Responsive */}
                        <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 mb-2">
                            {score}/{totalQuestions}
                        </div>
                        <div className="text-lg sm:text-xl text-gray-600 mb-4">{percentage}% Correct</div>

                        {/* Circular Progress - Responsive sizing */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6">
                            <svg
                                className="w-full h-full transform -rotate-90"
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
                                <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">{percentage}%</span>
                            </div>
                        </div>

                        {/* Score breakdown - Responsive grid */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6 sm:mb-8">
                            <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-green-600">{score}</div>
                                <div className="text-xs sm:text-sm text-green-700">Correct</div>
                            </div>
                            <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-red-600">
                                    {totalQuestions - score}
                                </div>
                                <div className="text-xs sm:text-sm text-red-700">Incorrect</div>
                            </div>
                        </div>

                        {/* Action Buttons - Better mobile layout */}
                        <div className="space-y-3 mb-6 sm:mb-8">
                            <button
                                onClick={onRestart}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                                data-quiz-restart="true"
                            >
                                🔄 Try Again
                            </button>

                            <button
                                onClick={onBackToSetup}
                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                            >
                                ⚙️ Back to Setup
                            </button>

                            {/* Add Review Answers Button */}
                            <button
                                onClick={handleReviewAnswers}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                            >
                                📝 Review Answers
                            </button>

                            <button
                                onClick={() => window.open("https://opentdb.com/", "_blank")}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                            >
                                🌐 More Quizzes
                            </button>
                        </div>


            </div>
        </div>
    );
                        {/* Share Section Divider - Responsive */}
                        <div className="mt-4 sm:mt-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                <div className="px-2 sm:px-4">
                                    <p className="text-sm sm:text-base font-semibold text-gray-700 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm border border-gray-200 flex items-center gap-1 sm:gap-2">
                                        <span className="text-sm sm:text-lg">📤</span>
                                        <span className="hidden sm:inline">Share your results</span>
                                        <span className="sm:hidden">Share</span>
                                    </p>
                                </div>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            </div>
                        </div>

                        {/* Share Buttons - Grid layout for mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                            >
                                📄 Download PDF
                            </button>

                            <button
                                onClick={handleShareTwitter}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                            >
                                🐦 Share on Twitter
                            </button>

                            <button
                                onClick={handleShareFacebook}
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                            >
                                📘 Share on Facebook
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 sm:py-4 px-3 sm:px-6 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                            >
                                🔗 Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default QuizResults;
