// TestAchievements.js - Utility for testing achievements system
// This file provides methods to populate sample data for testing the achievement system

import AchievementManager from './AchievementManager';

class TestAchievements {
    // Simulate completing a quiz with various scenarios
    static simulateQuizCompletion(scenario = 'perfect') {
        const scenarios = {
            perfect: {
                score: 10,
                totalQuestions: 10,
                timePerQuestion: 20,
                wasCorrect: true,
                usedHints: false
            },
            good: {
                score: 8,
                totalQuestions: 10,
                timePerQuestion: 25,
                wasCorrect: true,
                usedHints: false
            },
            average: {
                score: 6,
                totalQuestions: 10,
                timePerQuestion: 35,
                wasCorrect: false,
                usedHints: true
            },
            speedDemon: {
                score: 8,
                totalQuestions: 10,
                timePerQuestion: 12,
                wasCorrect: true,
                usedHints: false
            },
            streak: {
                score: 10,
                totalQuestions: 10,
                timePerQuestion: 20,
                wasCorrect: true,
                usedHints: false
            }
        };

        const data = scenarios[scenario] || scenarios.perfect;
        return AchievementManager.updateQuizStats(data);
    }

    // Simulate multiple quiz completions to unlock participation badges
    static simulateMultipleQuizzes(count = 5) {
        const achievements = [];

        for (let i = 0; i < count; i++) {
            const scenario = i % 2 === 0 ? 'perfect' : 'good';
            const newAchievements = this.simulateQuizCompletion(scenario);
            achievements.push(...newAchievements);
        }

        return achievements;
    }

    // Simulate bookmarking activities
    static simulateBookmarks(count = 10) {
        const achievements = [];

        for (let i = 0; i < count; i++) {
            const newAchievements = AchievementManager.updateBookmarkStats();
            achievements.push(...newAchievements);
        }

        return achievements;
    }

    // Simulate sharing activities
    static simulateShares(count = 5) {
        const achievements = [];

        for (let i = 0; i < count; i++) {
            const newAchievements = AchievementManager.updateShareStats();
            achievements.push(...newAchievements);
        }

        return achievements;
    }

    // Simulate streak building
    static simulateStreak(streakLength = 25) {
        const achievements = [];

        for (let i = 0; i < streakLength; i++) {
            const newAchievements = AchievementManager.updateStreakStats(true);
            achievements.push(...newAchievements);
        }

        return achievements;
    }

    // Populate comprehensive test data
    static populateTestData() {
        console.log('🧪 Populating test achievement data...');

        const allAchievements = [];

        // Simulate first quiz completion
        console.log('📝 Simulating first quiz...');
        const firstQuiz = this.simulateQuizCompletion('perfect');
        allAchievements.push(...firstQuiz);

        // Simulate multiple quizzes for participation badges
        console.log('📚 Simulating multiple quizzes...');
        const multipleQuizzes = this.simulateMultipleQuizzes(15);
        allAchievements.push(...multipleQuizzes);

        // Simulate speed achievements
        console.log('⚡ Simulating speed achievements...');
        const speedAchievements = this.simulateQuizCompletion('speedDemon');
        allAchievements.push(...speedAchievements);

        // Simulate streak achievements
        console.log('🔥 Simulating streak achievements...');
        const streakAchievements = this.simulateStreak(25);
        allAchievements.push(...streakAchievements);

        // Simulate bookmark achievements
        console.log('📖 Simulating bookmark achievements...');
        const bookmarkAchievements = this.simulateBookmarks(12);
        allAchievements.push(...bookmarkAchievements);

        // Simulate sharing achievements
        console.log('📱 Simulating sharing achievements...');
        const shareAchievements = this.simulateShares(6);
        allAchievements.push(...shareAchievements);

        // Filter unique achievements
        const uniqueAchievements = allAchievements.filter((achievement, index, self) =>
            index === self.findIndex(a => a.id === achievement.id)
        );

        console.log('✅ Test data populated successfully!');
        console.log(`🏆 Unlocked ${uniqueAchievements.length} achievements`);

        return uniqueAchievements;
    }

    // Clear all test data
    static clearTestData() {
        console.log('🧹 Clearing test data...');
        AchievementManager.resetAchievements();
        console.log('✅ Test data cleared!');
    }

    // Get current stats for debugging
    static getDebugInfo() {
        const stats = AchievementManager.getStats();
        const progress = AchievementManager.getOverallProgress();
        const unlockedBadges = AchievementManager.getUnlockedBadges();

        return {
            stats,
            progress,
            unlockedBadges: unlockedBadges.length,
            badgesList: unlockedBadges.map(b => ({ id: b.id, name: b.name }))
        };
    }

    // Quick test scenarios
    static quickTests = {
        // Test first quiz completion
        firstQuiz: () => {
            TestAchievements.clearTestData();
            return TestAchievements.simulateQuizCompletion('perfect');
        },

        // Test perfect streak
        perfectStreak: () => {
            TestAchievements.clearTestData();
            return TestAchievements.simulateStreak(10);
        },

        // Test speed demon
        speedDemon: () => {
            TestAchievements.clearTestData();
            return TestAchievements.simulateQuizCompletion('speedDemon');
        },

        // Test participation badges
        participation: () => {
            TestAchievements.clearTestData();
            return TestAchievements.simulateMultipleQuizzes(25);
        },

        // Test all badge types
        allBadges: () => {
            TestAchievements.clearTestData();
            return TestAchievements.populateTestData();
        }
    };
}

// Make it available globally for console testing
if (typeof window !== 'undefined') {
    window.TestAchievements = TestAchievements;
}

export default TestAchievements;
