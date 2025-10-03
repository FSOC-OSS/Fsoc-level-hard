"use client";



const QuizResults = ({ score, totalQuestions, onRestart, onBackToSetup, onReview }) => {

import React, { useState, useEffect } from "react";
import BadgeManager from "../utils/BadgeManager";
import AchievementNotification from "./AchievementNotification";

const QuizResults = ({
    score,
    totalQuestions,
    onRestart,
    onBackToSetup,
    quizData = {},
 {
    const [newBadges, setNewBadges] = useState([]);
    const [showAchievements, setShowAchievements] = useState(false);


import { jsPDF } from "jspdf";

const QuizResults = ({ score, totalQuestions, onRestart, onBackToSetup }) => {

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform animate-pulse">
                <div className="text-8xl mb-6 animate-bounce">{result.emoji}</div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Quiz Complete!
                    </h2>

                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                        {score}/{totalQuestions}
                    </div>
                    <div className="text-xl text-gray-600 mb-4">{percentage}% Correct</div>

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
                    )}

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
                        onClick={onReview}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        📝 Review Answers
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

                    <button
                        onClick={() => window.open("https://opentdb.com/", "_blank")}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        🌐 More Quizzes
                    </button>
                </div>

                <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-3">Share your results:</p>
                    
                </div>
                <div className="space-y-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        📄 Download PDF
                    </button>

                    <button
                        onClick={handleShareTwitter}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        🐦 Share on Twitter
                    </button>

                    <button
                        onClick={handleShareFacebook}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        📘 Share on Facebook
                    </button>

                    <button
                        onClick={handleCopyLink}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
                    >
                        🔗 Copy Shareable Link
                    </button>
                </div>

               
            </div>
        </>
    );
};

export default QuizResults;
