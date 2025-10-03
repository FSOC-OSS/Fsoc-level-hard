"use client";

import { useEffect, useState, useRef } from "react";
import BadgeManager from "../utils/BadgeManager";
import AchievementNotification from "./AchievementNotification";
import QuizReview from "./QuizReview";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const QuizResults = ({
    score,
    totalQuestions,
    onRestart,
    onBackToSetup,
    quizData = {},
    questions = [],
    userAnswers = [],
}) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const [newBadges, setNewBadges] = useState([]);
    const [showAchievements, setShowAchievements] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const resultsCardRef = useRef(null);

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

        generateQRCode();
    }, [score, totalQuestions, quizData]);

    const generateQRCode = async () => {
        try {
            const shareUrl = `${window.location.origin}${window.location.pathname}?score=${score}&total=${totalQuestions}&percent=${percentage}`;
            const qrDataUrl = await QRCode.toDataURL(shareUrl, {
                width: 200,
                margin: 2,
                color: {
                    dark: "#8b5cf6",
                    light: "#ffffff",
                },
            });
            setQrCodeUrl(qrDataUrl);
        } catch (error) {
            console.error("Failed to generate QR code:", error);
        }
    };

    const getResultMessage = () => {
        if (percentage >= 90)
            return {
                message: "Outstanding! 🏆",
                emoji: "🎯",
                color: "text-yellow-600",
                achievement: "Quiz Master",
            };
        if (percentage >= 80)
            return {
                message: "Excellent! 🌟",
                emoji: "⭐",
                color: "text-green-600",
                achievement: "Star Performer",
            };
        if (percentage >= 70)
            return {
                message: "Great Job! 👏",
                emoji: "👍",
                color: "text-blue-600",
                achievement: "Solid Achiever",
            };
        if (percentage >= 50)
            return {
                message: "Good Effort! 💪",
                emoji: "👌",
                color: "text-purple-600",
                achievement: "Good Learner",
            };
        return {
            message: "Keep Trying! 📚",
            emoji: "💪",
            color: "text-red-600",
            achievement: "Persistent Student",
        };
    };

    const result = getResultMessage();

    const formatDuration = (ms) => {
        if (!ms) return "N/A";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const handleDownloadPDF = () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setFillColor(139, 92, 246);
            doc.rect(0, 0, pageWidth, 40, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("Quiz Results Report", pageWidth / 2, 25, {
                align: "center",
            });

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Performance Summary", 20, 60);

            doc.setFillColor(245, 245, 250);
            doc.roundedRect(15, 70, pageWidth - 30, 50, 5, 5, "F");

            doc.setFontSize(14);
            doc.setFont("helvetica", "normal");
            doc.text(`Score: ${score} out of ${totalQuestions}`, 25, 85);
            doc.text(`Percentage: ${percentage}%`, 25, 95);
            doc.text(`Achievement Level: ${result.achievement}`, 25, 105);
            doc.text(
                `Status: ${result.message.replace(/[^\w\s!]/g, "")}`,
                25,
                115,
            );

            doc.setFont("helvetica", "bold");
            doc.text("Quiz Details", 20, 140);

            const currentDate = new Date();
            doc.setFont("helvetica", "normal");
            doc.text(
                `Date Completed: ${currentDate.toLocaleDateString()}`,
                25,
                155,
            );
            doc.text(
                `Time Completed: ${currentDate.toLocaleTimeString()}`,
                25,
                165,
            );
            doc.text(
                `Duration: ${formatDuration(quizData.timeSpent)}`,
                25,
                175,
            );
            doc.text(
                `Category: ${quizData.category || "General Knowledge"}`,
                25,
                185,
            );

            doc.setFont("helvetica", "bold");
            doc.text("Performance Breakdown", 20, 205);

            const correctAnswers = score;
            const incorrectAnswers = totalQuestions - score;
            const accuracy = percentage;

            doc.setFont("helvetica", "normal");
            doc.text(`Correct Answers: ${correctAnswers}`, 25, 220);
            doc.text(`Incorrect Answers: ${incorrectAnswers}`, 25, 230);
            doc.text(`Accuracy Rate: ${accuracy}%`, 25, 240);

            if (quizData.averageTimePerQuestion) {
                doc.text(
                    `Average Time per Question: ${quizData.averageTimePerQuestion}s`,
                    25,
                    250,
                );
            }

            doc.setFillColor(139, 92, 246);
            doc.rect(0, pageHeight - 30, pageWidth, 30, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text(
                "Generated by Quiz App - Keep Learning!",
                pageWidth / 2,
                pageHeight - 15,
                { align: "center" },
            );

            doc.save(
                `quiz-results-${currentDate.toISOString().split("T")[0]}.pdf`,
            );
        } catch (error) {
            alert("Failed to generate PDF. Please try again.");
            console.error("PDF generation error:", error);
        }
    };

    const handleShareTwitter = () => {
        const achievementText = result.achievement;
        const text = encodeURIComponent(
            `🎯 Just completed a quiz and earned "${achievementText}"! Scored ${score}/${totalQuestions} (${percentage}%). ${result.message.replace(/[^\w\s!]/g, "")} #QuizChallenge #Learning`,
        );
        const url = encodeURIComponent(window.location.href);
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            "_blank",
            "width=600,height=400,scrollbars=yes,resizable=yes",
        );
    };

    const handleShareFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        const quote = encodeURIComponent(
            `I just completed a quiz and scored ${score}/${totalQuestions} (${percentage}%)! Earned the "${result.achievement}" level. Challenge yourself and see how you do!`,
        );
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`,
            "_blank",
            "width=600,height=400,scrollbars=yes,resizable=yes",
        );
    };

    const handleShareLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent("Quiz Achievement Unlocked!");
        const summary = encodeURIComponent(
            `Just completed a challenging quiz with a score of ${percentage}%! Achieved "${result.achievement}" level. Continuous learning keeps the mind sharp. What's your next learning goal?`,
        );
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
            "_blank",
            "width=600,height=400,scrollbars=yes,resizable=yes",
        );
    };

    const handleCopyLink = async () => {
        try {
            const shareUrl = `${window.location.href}?score=${score}&total=${totalQuestions}&percent=${percentage}&achievement=${encodeURIComponent(result.achievement)}`;
            await navigator.clipboard.writeText(shareUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
            BadgeManager.onResultShared();
        } catch (error) {
            alert("Failed to copy link to clipboard");
            console.error("Copy link error:", error);
        }
    };

    const handleDownloadImage = async () => {
        try {
            if (resultsCardRef.current) {
                const canvas = await html2canvas(resultsCardRef.current, {
                    backgroundColor: null,
                    scale: 2,
                    logging: false,
                    useCORS: true,
                });

                const link = document.createElement("a");
                link.download = `quiz-results-${new Date().getTime()}.png`;
                link.href = canvas.toDataURL();
                link.click();
            }
        } catch (error) {
            alert("Failed to generate image. Please try again.");
            console.error("Image generation error:", error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleReviewAnswers = () => {
        setShowReview(true);
    };

    const handleBackFromReview = () => {
        setShowReview(false);
    };

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
            <style jsx>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-section,
                    .print-section * {
                        visibility: visible;
                    }
                    .print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                }
                .print-only {
                    display: none;
                }
            `}</style>

            {showAchievements && (
                <AchievementNotification
                    badges={newBadges}
                    onClose={() => setShowAchievements(false)}
                    onViewAll={() => {
                        setShowAchievements(false);
                    }}
                />
            )}

            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-2 sm:p-4 md:p-6">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full text-center print-section">
                    <div ref={resultsCardRef} className="w-full">
                        <div className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">
                            {result.emoji}
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                            Quiz Complete!
                        </h2>

                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                            <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 mb-2">
                                {score}/{totalQuestions}
                            </div>
                            <div className="text-lg sm:text-xl text-gray-600 mb-4">
                                {percentage}% Correct
                            </div>
                            <div className="text-md font-semibold text-purple-600 mb-4">
                                Achievement: {result.achievement}
                            </div>

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
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                                        {percentage}%
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6 sm:mb-8">
                                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                                        {score}
                                    </div>
                                    <div className="text-xs sm:text-sm text-green-700">
                                        Correct
                                    </div>
                                </div>
                                <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                                    <div className="text-xl sm:text-2xl font-bold text-red-600">
                                        {totalQuestions - score}
                                    </div>
                                    <div className="text-xs sm:text-sm text-red-700">
                                        Incorrect
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="print-only bg-gray-50 p-4 rounded-lg mb-4">
                        <h3 className="font-bold text-lg mb-2">Quiz Details</h3>
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>Time: {new Date().toLocaleTimeString()}</p>
                        <p>Duration: {formatDuration(quizData.timeSpent)}</p>
                        <p>
                            Category: {quizData.category || "General Knowledge"}
                        </p>
                    </div>

                    <div className="space-y-3 mb-6 sm:mb-8 no-print">
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

                        <button
                            onClick={handleReviewAnswers}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                        >
                            📝 Review Answers
                        </button>

                        <button
                            onClick={() =>
                                window.open("https://opentdb.com/", "_blank")
                            }
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                        >
                            🌐 More Quizzes
                        </button>
                    </div>

                    <div className="mt-4 sm:mt-6 no-print">
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <div className="px-2 sm:px-4">
                                <p className="text-sm sm:text-base font-semibold text-gray-700 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm border border-gray-200 flex items-center gap-1 sm:gap-2">
                                    <span className="text-sm sm:text-lg">
                                        📤
                                    </span>
                                    <span className="hidden sm:inline">
                                        Export & Share
                                    </span>
                                    <span className="sm:hidden">Share</span>
                                </p>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                            >
                                📄 PDF Report
                            </button>

                            <button
                                onClick={handleDownloadImage}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                            >
                                🖼️ Save Image
                            </button>

                            <button
                                onClick={handlePrint}
                                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                            >
                                🖨️ Print
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className={`w-full font-bold py-3 sm:py-4 px-3 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs sm:text-sm ${
                                    copySuccess
                                        ? "bg-green-500 text-white"
                                        : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
                                }`}
                            >
                                {copySuccess
                                    ? "✅ Link Copied!"
                                    : "🔗 Copy Link"}
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                Share on Social Media
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={handleShareTwitter}
                                    className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs"
                                >
                                    🐦 Twitter
                                </button>

                                <button
                                    onClick={handleShareFacebook}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs"
                                >
                                    📘 Facebook
                                </button>

                                <button
                                    onClick={handleShareLinkedIn}
                                    className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-xs"
                                >
                                    💼 LinkedIn
                                </button>
                            </div>
                        </div>

                        {qrCodeUrl && (
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                    Scan QR Code to Share
                                </p>
                                <div className="inline-block p-2 bg-white rounded-lg shadow-md">
                                    <img
                                        src={qrCodeUrl}
                                        alt="QR Code for sharing"
                                        className="w-24 h-24 mx-auto"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizResults;
