class AchievementManager {
    static STORAGE_KEY = "quiz_achievements";
    static STATS_KEY = "quiz_stats";

    static badgeDefinitions = {
        // Participation Badges
        "first-steps": {
            id: "first-steps",
            name: "First Steps",
            description: "Complete your first quiz",
            category: "participation",
            icon: "🎯",
            criteria: { type: "quizzes_completed", value: 1 },
        },
        "dedicated-learner": {
            id: "dedicated-learner",
            name: "Dedicated Learner",
            description: "Complete 10 quizzes",
            category: "participation",
            icon: "📚",
            criteria: { type: "quizzes_completed", value: 10 },
        },
        "quiz-master": {
            id: "quiz-master",
            name: "Quiz Master",
            description: "Complete 50 quizzes",
            category: "participation",
            icon: "🏆",
            criteria: { type: "quizzes_completed", value: 50 },
        },
        "quiz-legend": {
            id: "quiz-legend",
            name: "Quiz Legend",
            description: "Complete 100 quizzes",
            category: "participation",
            icon: "👑",
            criteria: { type: "quizzes_completed", value: 100 },
        },

        // Performance/Score Badges
        "perfect-score": {
            id: "perfect-score",
            name: "Perfect Score",
            description: "Achieve 100% accuracy in a quiz",
            category: "performance",
            icon: "💯",
            criteria: { type: "perfect_score", value: 100 },
        },
        perfectionist: {
            id: "perfectionist",
            name: "Perfectionist",
            description: "Achieve 95%+ accuracy in a quiz",
            category: "performance",
            icon: "⭐",
            criteria: { type: "accuracy", value: 95 },
        },
        excellent: {
            id: "excellent",
            name: "Excellent",
            description: "Achieve 90%+ accuracy in a quiz",
            category: "performance",
            icon: "🌟",
            criteria: { type: "accuracy", value: 90 },
        },
        "good-job": {
            id: "good-job",
            name: "Good Job",
            description: "Achieve 80%+ accuracy in a quiz",
            category: "performance",
            icon: "👏",
            criteria: { type: "accuracy", value: 80 },
        },

        // Streak Badges
        "streak-starter": {
            id: "streak-starter",
            name: "Streak Starter",
            description: "5 consecutive correct answers",
            category: "performance",
            icon: "🔥",
            criteria: { type: "streak", value: 5 },
        },
        "on-fire": {
            id: "on-fire",
            name: "On Fire",
            description: "10 consecutive correct answers",
            category: "performance",
            icon: "🚀",
            criteria: { type: "streak", value: 10 },
        },
        "hot-streak": {
            id: "hot-streak",
            name: "Hot Streak",
            description: "25 consecutive correct answers",
            category: "performance",
            icon: "⚡",
            criteria: { type: "streak", value: 25 },
        },
        unstoppable: {
            id: "unstoppable",
            name: "Unstoppable",
            description: "50 consecutive correct answers",
            category: "performance",
            icon: "💥",
            criteria: { type: "streak", value: 50 },
        },
        "legendary-streak": {
            id: "legendary-streak",
            name: "Legendary Streak",
            description: "100 consecutive correct answers",
            category: "performance",
            icon: "🌟",
            criteria: { type: "streak", value: 100 },
        },

        // Speed Badges
        "speed-reader": {
            id: "speed-reader",
            name: "Speed Reader",
            description: "Complete a question in under 30 seconds",
            category: "performance",
            icon: "⚡",
            criteria: { type: "speed", value: 30 },
        },
        "speed-demon": {
            id: "speed-demon",
            name: "Speed Demon",
            description: "Complete a question in under 15 seconds",
            category: "performance",
            icon: "💨",
            criteria: { type: "speed", value: 15 },
        },

        // Special Badges
        bookworm: {
            id: "bookworm",
            name: "Bookworm",
            description: "Bookmark 10 questions for review",
            category: "participation",
            icon: "📖",
            criteria: { type: "bookmarks", value: 10 },
        },
        "hint-master": {
            id: "hint-master",
            name: "Hint Master",
            description: "Use all available hints",
            category: "participation",
            icon: "💡",
            criteria: { type: "hints_used", value: 1 },
        },
        "social-sharer": {
            id: "social-sharer",
            name: "Social Sharer",
            description: "Share quiz results 5 times",
            category: "participation",
            icon: "📱",
            criteria: { type: "shares", value: 5 },
        },
    };

    static getAchievements() {
        try {
            const achievements = localStorage.getItem(this.STORAGE_KEY);
            return achievements ? JSON.parse(achievements) : {};
        } catch (error) {
            console.error("Error loading achievements:", error);
            return {};
        }
    }

    static getStats() {
        try {
            const stats = localStorage.getItem(this.STATS_KEY);
            return stats
                ? JSON.parse(stats)
                : {
                      quizzes_completed: 0,
                      total_questions: 0,
                      correct_answers: 0,
                      current_streak: 0,
                      best_streak: 0,
                      fastest_time: null,
                      perfect_scores: 0,
                      bookmarks_made: 0,
                      hints_used: 0,
                      shares_made: 0,
                      last_quiz_date: null,
                  };
        } catch (error) {
            console.error("Error loading stats:", error);
            return {
                quizzes_completed: 0,
                total_questions: 0,
                correct_answers: 0,
                current_streak: 0,
                best_streak: 0,
                fastest_time: null,
                perfect_scores: 0,
                bookmarks_made: 0,
                hints_used: 0,
                shares_made: 0,
                last_quiz_date: null,
            };
        }
    }

    static saveAchievements(achievements) {
        try {
            localStorage.setItem(
                this.STORAGE_KEY,
                JSON.stringify(achievements),
            );
            return true;
        } catch (error) {
            console.error("Error saving achievements:", error);
            return false;
        }
    }

    static saveStats(stats) {
        try {
            localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
            return true;
        } catch (error) {
            console.error("Error saving stats:", error);
            return false;
        }
    }

    static unlockAchievement(badgeId) {
        const achievements = this.getAchievements();
        const badge = this.badgeDefinitions[badgeId];

        if (!badge || achievements[badgeId]) {
            return null;
        }

        achievements[badgeId] = {
            ...badge,
            unlockedAt: new Date().toISOString(),
        };

        this.saveAchievements(achievements);
        return achievements[badgeId];
    }

    static checkAchievements(stats) {
        const newlyUnlocked = [];

        Object.entries(this.badgeDefinitions).forEach(([badgeId, badge]) => {
            if (this.isAchievementUnlocked(badgeId)) {
                return;
            }

            if (this.checkCriteria(badge.criteria, stats)) {
                const unlockedBadge = this.unlockAchievement(badgeId);
                if (unlockedBadge) {
                    newlyUnlocked.push(unlockedBadge);
                }
            }
        });

        return newlyUnlocked;
    }

    static checkCriteria(criteria, stats) {
        switch (criteria.type) {
            case "quizzes_completed":
                return stats.quizzes_completed >= criteria.value;
            case "accuracy": {
                const totalQuestions = stats.total_questions;
                if (totalQuestions === 0) return false;
                const accuracy = (stats.correct_answers / totalQuestions) * 100;
                return accuracy >= criteria.value;
            }
            case "perfect_score":
                return stats.perfect_scores > 0;
            case "streak":
                return stats.best_streak >= criteria.value;
            case "speed":
                return (
                    stats.fastest_time !== null &&
                    stats.fastest_time <= criteria.value
                );
            case "bookmarks":
                return stats.bookmarks_made >= criteria.value;
            case "hints_used":
                return stats.hints_used >= criteria.value;
            case "shares":
                return stats.shares_made >= criteria.value;
            default:
                return false;
        }
    }

    static isAchievementUnlocked(badgeId) {
        const achievements = this.getAchievements();
        return !!achievements[badgeId];
    }

    static updateQuizStats({
        score,
        totalQuestions,
        timePerQuestion,
        wasCorrect,
        usedHints = false,
    }) {
        const stats = this.getStats();

        stats.quizzes_completed++;
        stats.total_questions += totalQuestions;
        stats.correct_answers += score;
        stats.last_quiz_date = new Date().toISOString();

        // Update streak
        if (wasCorrect) {
            stats.current_streak++;
            stats.best_streak = Math.max(
                stats.best_streak,
                stats.current_streak,
            );
        } else {
            stats.current_streak = 0;
        }

        // Update perfect scores
        if (score === totalQuestions) {
            stats.perfect_scores++;
        }

        // Update fastest time
        if (
            timePerQuestion &&
            (stats.fastest_time === null ||
                timePerQuestion < stats.fastest_time)
        ) {
            stats.fastest_time = timePerQuestion;
        }

        // Update hints used
        if (usedHints) {
            stats.hints_used++;
        }

        this.saveStats(stats);
        return this.checkAchievements(stats);
    }

    static updateBookmarkStats() {
        const stats = this.getStats();
        stats.bookmarks_made++;
        this.saveStats(stats);
        return this.checkAchievements(stats);
    }

    static updateShareStats() {
        const stats = this.getStats();
        stats.shares_made++;
        this.saveStats(stats);
        return this.checkAchievements(stats);
    }

    static updateStreakStats(isCorrect) {
        const stats = this.getStats();

        if (isCorrect) {
            stats.current_streak++;
            stats.best_streak = Math.max(
                stats.best_streak,
                stats.current_streak,
            );
        } else {
            stats.current_streak = 0;
        }

        this.saveStats(stats);
        return this.checkAchievements(stats);
    }

    static getUnlockedBadges() {
        const achievements = this.getAchievements();
        return Object.values(achievements);
    }

    static getLockedBadges() {
        const achievements = this.getAchievements();
        return Object.values(this.badgeDefinitions).filter(
            (badge) => !achievements[badge.id],
        );
    }

    static getAllBadges() {
        const achievements = this.getAchievements();
        return Object.values(this.badgeDefinitions).map((badge) => ({
            ...badge,
            unlocked: !!achievements[badge.id],
            unlockedAt: achievements[badge.id]?.unlockedAt || null,
        }));
    }

    static getBadgesByCategory(category) {
        return this.getAllBadges().filter(
            (badge) => badge.category === category,
        );
    }

    static getProgressTowardsBadge(badgeId) {
        const badge = this.badgeDefinitions[badgeId];
        if (!badge || this.isAchievementUnlocked(badgeId)) {
            return 100;
        }

        const stats = this.getStats();
        const criteria = badge.criteria;

        switch (criteria.type) {
            case "quizzes_completed":
                return Math.min(
                    (stats.quizzes_completed / criteria.value) * 100,
                    100,
                );
            case "streak":
                return Math.min(
                    (stats.best_streak / criteria.value) * 100,
                    100,
                );
            case "bookmarks":
                return Math.min(
                    (stats.bookmarks_made / criteria.value) * 100,
                    100,
                );
            case "shares":
                return Math.min(
                    (stats.shares_made / criteria.value) * 100,
                    100,
                );
            default:
                return 0;
        }
    }

    static getOverallProgress() {
        const totalBadges = Object.keys(this.badgeDefinitions).length;
        const unlockedBadges = this.getUnlockedBadges().length;
        return {
            unlocked: unlockedBadges,
            total: totalBadges,
            percentage: Math.round((unlockedBadges / totalBadges) * 100),
        };
    }

    static resetAchievements() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.STATS_KEY);
        return true;
    }

    static exportAchievements() {
        const achievements = this.getAchievements();
        const stats = this.getStats();
        const exportData = {
            achievements,
            stats,
            exportedAt: new Date().toISOString(),
            version: "1.0",
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(dataBlob);
        link.download = `quiz-achievements-${new Date().toISOString().split("T")[0]}.json`;
        link.click();
    }

    static importAchievements(fileContent) {
        try {
            const importData = JSON.parse(fileContent);

            if (importData.achievements) {
                this.saveAchievements(importData.achievements);
            }

            if (importData.stats) {
                this.saveStats(importData.stats);
            }

            return {
                success: true,
                message: "Achievements imported successfully",
            };
        } catch (error) {
            console.error("Error importing achievements:", error);
            return {
                success: false,
                message: "Invalid achievement file format",
            };
        }
    }
}

export default AchievementManager;
