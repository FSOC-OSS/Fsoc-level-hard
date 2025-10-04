"use client";

import { useEffect, useState, useCallback } from "react";
import BadgeManager from "../utils/BadgeManager";
import AchievementNotification from "./AchievementNotification";
import QuizReview from "./QuizReview";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import BonusSpinWheel from "./BonusSpinWheel";
import { computeBasePoints, applyBonus } from "../utils/Points";
import BonusManager from "../utils/BonusManager";

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
    const [linkCopied, setLinkCopied] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    // Points and bonus state
    const basePoints = computeBasePoints(questions, userAnswers);
    const [bonusReward, setBonusReward] = useState(null);
    const [finalPoints, setFinalPoints] = useState(basePoints);
    const [showWheel, setShowWheel] = useState(BonusManager.canSpin());

    const generateQRCode = useCallback(async () => {
        try {
            const shareUrl = `${window.location.origin}?score=${score}&total=${totalQuestions}&percent=${percentage}`;
            const qrDataUrl = await QRCode.toDataURL(shareUrl, {
                width: 150,
                margin: 1,
                color: {
                    dark: "#8b5cf6",
                    light: "#ffffff",
                },
            });
            setQrCodeUrl(qrDataUrl);
        } catch (error) {
            console.error("Failed to generate QR code:", error);
        }
    }, [score, totalQuestions, percentage]);

    useEffect(() => {
        BadgeManager.initializeBadgeSystem();
        generateQRCode();

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

        // initialize final points as base (before spin)
        setFinalPoints(basePoints);
    }, [score, totalQuestions, quizData, basePoints, generateQRCode]);

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

    const getShareMessage = (platform) => {
        const baseMessage = `I just scored ${score}/${totalQuestions} (${percentage}%)`;
        const achievement = result.message.replace(/[^\w\s]/g, "");

        switch (platform) {
            case "twitter":
                return `${baseMessage} - ${achievement} on this amazing quiz! Challenge yourself: `;
            case "facebook":
                return `${baseMessage} on this quiz! ${achievement} Try it yourself and see how you do!`;
            case "linkedin":
                return `Achievement unlocked! ${baseMessage} on this knowledge quiz. ${achievement} #Learning #Quiz #Achievement`;
            default:
                return `${baseMessage} - ${achievement} in this quiz!`;
        }
    };

    const handleDownloadPDF = () => {
        try {
            const doc = new jsPDF();

            doc.setFillColor(139, 92, 246);
            doc.rect(0, 0, 210, 30, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("Quiz Results Report", 105, 20, { align: "center" });

            doc.setTextColor(0);
            doc.setFontSize(14);
            doc.setFont("helvetica", "normal");

            doc.setFillColor(230, 230, 250);
            doc.roundedRect(15, 40, 180, 80, 5, 5, "F");

            doc.setTextColor(75, 0, 130);
            doc.setFontSize(18);
            doc.text(`Final Score: ${score} / ${totalQuestions}`, 25, 60);
            doc.text(`Percentage: ${percentage}%`, 25, 75);
            doc.text(
                `Performance: ${result.message.replace(/[^\w\s]/g, "")}`,
                25,
                90,
            );

            const now = new Date();
            doc.setFontSize(12);
            doc.setTextColor(50);
            doc.text(`Quiz Date: ${now.toLocaleDateString()}`, 25, 110);
            doc.text(`Completion Time: ${now.toLocaleTimeString()}`, 110, 110);

            if (quizData.timeSpent) {
                const minutes = Math.floor(quizData.timeSpent / 60);
                const seconds = Math.floor(quizData.timeSpent % 60);
                doc.text(`Total Time Spent: ${minutes}m ${seconds}s`, 25, 125);
            }

            doc.setFillColor(245, 245, 245);
            doc.rect(15, 140, 180, 80, "F");
            doc.setTextColor(100);
            doc.setFontSize(14);
            doc.text("Performance Breakdown:", 25, 155);

            doc.setFontSize(12);
            doc.text(`Correct Answers: ${score}`, 25, 170);
            doc.text(`Incorrect Answers: ${totalQuestions - score}`, 25, 185);
            doc.text(`Success Rate: ${percentage}%`, 25, 200);

            if (percentage >= 80) {
                doc.text("Excellent performance! Keep up the great work!", 25, 215);
            } else if (percentage >= 60) {
                doc.text("Good job! There's room for improvement.", 25, 215);
            } else {
                doc.text("Keep practicing to improve your score!", 25, 215);
            }

            doc.setFontSize(10);
            doc.setTextColor(120);
            doc.text("Generated by Quiz Challenge App", 105, 280, {
                align: "center",
            });
            doc.text(
                `Report generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`,
                105,
                290,
                { align: "center" },
            );

            doc.save(
                `quiz-results-${percentage}%-${now.toISOString().split("T")[0]}.pdf`,
            );
        } catch {
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const handleShareTwitter = () => {
        const text = encodeURIComponent(getShareMessage("twitter"));
        const url = encodeURIComponent(window.location.origin);
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            "_blank",
            "width=600,height=400",
        );
    };

    const handleShareFacebook = () => {
        const url = encodeURIComponent(window.location.origin);
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(getShareMessage("facebook"))}`,
            "_blank",
            "width=600,height=400",
        );
    };

    const handleShareLinkedIn = () => {
        const url = encodeURIComponent(window.location.origin);
        const title = encodeURIComponent("Quiz Challenge Results");
        const summary = encodeURIComponent(getShareMessage("linkedin"));
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`,
            "_blank",
            "width=600,height=400",
        );
    };

    const handleCopyLink = async () => {
        try {
            const shareUrl = `${window.location.origin}?score=${score}&total=${totalQuestions}&percent=${percentage}&timestamp=${Date.now()}`;
            await navigator.clipboard.writeText(shareUrl);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 3000);
        } catch {
            alert("Failed to copy link. Please try again.");
        }
    };

    const handleDownloadImage = async () => {
        try {
            const element = document.getElementById("quiz-results-card");
            const canvas = await html2canvas(element, {
                backgroundColor: "#8b5cf6",
                scale: 2,
                useCORS: true,
                allowTaint: true,
            });

            const link = document.createElement("a");
            link.download = `quiz-results-${percentage}%-${new Date().toISOString().split("T")[0]}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (err) {
            alert("Failed to generate image. Please try again.");
            console.error("Image generation error:", err);
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
                    .print-content,
                    .print-content * {
                        visibility: visible;
                    }
                    .print-content {
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

            {showWheel && (
                <BonusSpinWheel
                    isOpen={showWheel}
                    quizScore={score}
                    onRewardWon={(reward) => {
                        const normalized = reward.isMultiplier
                            ? { type: 'multiplier', value: reward.value, label: reward.label, points: 0, isMultiplier: true }
                            : { type: 'points', value: reward.points, label: reward.label, points: reward.points, isMultiplier: false };

                        const { finalPoints: fp } = applyBonus(basePoints, normalized);
                        setBonusReward(normalized);
                        setFinalPoints(fp);
                        setShowWheel(false);

                        BonusManager.saveBonusToHistory(
                            { label: normalized.label, points: normalized.points, isMultiplier: normalized.isMultiplier },
                            basePoints,
                            fp,
                            totalQuestions
                        );
                        BonusManager.markWheelSpun(fp - basePoints);
                    }}
                    onClose={() => setShowWheel(false)}
                />
            )}

            {showAchievements && (
                <AchievementNotification
                    badges={newBadges}
                    onClose={() => setShowAchievements(false)}
                    onViewAll={() => {
                        setShowAchievements(false);
                    }}
                />
            )}
            <div className="min-h-screen theme-screen flex items-center justify-center p-2 sm:p-4 md:p-6">
                <div
                    id="quiz-results-card"
                    className="print-content app-card rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full text-center"
                >
                    <div className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">
                        {result.emoji}
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                        Quiz Complete!
                    </h2>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2">
                            {score}/{totalQuestions}
                        </div>
                        <div className="text-xl text-gray-600 dark:text-gray-300 mb-2">{percentage}% Correct</div>
                        <div className={`text-lg font-semibold ${result.color} mb-2`}>
                            {result.message}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Points: {finalPoints} {bonusReward ? `(base ${basePoints} + bonus)` : ''}
                        </div>

                        <div className="relative w-32 h-32 mx-auto my-4">
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
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {score}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                                Correct
                            </div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {totalQuestions - score}
                            </div>
                            <div className="text-sm text-red-700 dark:text-red-300">
                                Incorrect
                            </div>
                        </div>
                    </div>

                    {qrCodeUrl && (
                        <div className="mb-6 no-print">
                            <p className="text-sm text-gray-500 mb-2">
                                Scan to share:
                            </p>
                            <div className="flex justify-center">
                                <img
                                    src={qrCodeUrl}
                                    alt="QR Code for sharing results"
                                    className="border border-gray-200 rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    <div className="print-only mb-6">
                        <p className="text-sm text-gray-600">
                            Quiz completed on {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            Generated by Quiz Challenge App
                        </p>
                    </div>
                </div>

                    <div className="space-y-3 mb-8 no-print">
                        <button
                            onClick={onRestart}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
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
                            onClick={handleReviewAnswers}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            📝 Review Answers
                        </button>
                    </div>

                    <div className="space-y-3 no-print">
                        <p className="text-sm text-gray-500 mb-3">
                            Export & Share:
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleDownloadPDF}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                            >
                                📄 PDF
                            </button>

                            <button
                                onClick={handleDownloadImage}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                            >
                                🖼️ Image
                            </button>

                            <button
                                onClick={handlePrint}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                            >
                                🖨️ Print
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className={`${linkCopied ? "bg-green-600" : "bg-purple-600 hover:bg-purple-700"} text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm`}
                            >
                                {linkCopied ? "✅ Copied!" : "🔗 Link"}
                            </button>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-3">
                                Share on social media:
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={handleShareTwitter}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                                >
                                    🐦 Twitter
                                </button>

                                <button
                                    onClick={handleShareFacebook}
                                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                                >
                                    📘 Facebook
                                </button>

                                <button
                                    onClick={handleShareLinkedIn}
                                    className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                                >
                                    💼 LinkedIn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizResults;