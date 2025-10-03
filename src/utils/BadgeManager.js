const BADGE_STORAGE_KEY = 'userBadges';
const BADGE_STATS_KEY = 'badgeStats';

class BadgeManager {
  static badgeDefinitions = {
    participation: {
      firstSteps: {
        id: 'firstSteps',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🎯',
        category: 'participation',
        requirement: 1,
        type: 'quiz_count'
      },
      dedicatedLearner: {
        id: 'dedicatedLearner',
        name: 'Dedicated Learner',
        description: 'Complete 10 quizzes',
        icon: '📚',
        category: 'participation',
        requirement: 10,
        type: 'quiz_count'
      },
      quizMaster: {
        id: 'quizMaster',
        name: 'Quiz Master',
        description: 'Complete 50 quizzes',
        icon: '🏆',
        category: 'participation',
        requirement: 50,
        type: 'quiz_count'
      },
      centurion: {
        id: 'centurion',
        name: 'Centurion',
        description: 'Complete 100 quizzes',
        icon: '👑',
        category: 'participation',
        requirement: 100,
        type: 'quiz_count'
      },
      bookworm: {
        id: 'bookworm',
        name: 'Bookworm',
        description: 'Bookmark 10 questions for review',
        icon: '📖',
        category: 'participation',
        requirement: 10,
        type: 'bookmark_count'
      }
    },
    performance: {
      perfectScore: {
        id: 'perfectScore',
        name: 'Perfect Score',
        description: 'Achieve 100% accuracy in a quiz',
        icon: '💯',
        category: 'performance',
        requirement: 100,
        type: 'accuracy'
      },
      perfectionist: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 95%+ accuracy in a quiz',
        icon: '⭐',
        category: 'performance',
        requirement: 95,
        type: 'accuracy'
      },
      hotStreak: {
        id: 'hotStreak',
        name: 'Hot Streak',
        description: 'Achieve 90%+ accuracy in a quiz',
        icon: '🔥',
        category: 'performance',
        requirement: 90,
        type: 'accuracy'
      },
      sharpShooter: {
        id: 'sharpShooter',
        name: 'Sharp Shooter',
        description: 'Achieve 80%+ accuracy in a quiz',
        icon: '🎯',
        category: 'performance',
        requirement: 80,
        type: 'accuracy'
      }
    },
    streak: {
      streak5: {
        id: 'streak5',
        name: 'Getting Started',
        description: '5 consecutive correct answers',
        icon: '✨',
        category: 'streak',
        requirement: 5,
        type: 'consecutive_correct'
      },
      streak10: {
        id: 'streak10',
        name: 'On Fire',
        description: '10 consecutive correct answers',
        icon: '🔥',
        category: 'streak',
        requirement: 10,
        type: 'consecutive_correct'
      },
      streak25: {
        id: 'streak25',
        name: 'Unstoppable',
        description: '25 consecutive correct answers',
        icon: '⚡',
        category: 'streak',
        requirement: 25,
        type: 'consecutive_correct'
      },
      streak50: {
        id: 'streak50',
        name: 'Legendary',
        description: '50 consecutive correct answers',
        icon: '🌟',
        category: 'streak',
        requirement: 50,
        type: 'consecutive_correct'
      }
    },
    speed: {
      speedDemon: {
        id: 'speedDemon',
        name: 'Speed Demon',
        description: 'Answer a question in under 15 seconds',
        icon: '⚡',
        category: 'speed',
        requirement: 15,
        type: 'answer_time'
      },
      quickDraw: {
        id: 'quickDraw',
        name: 'Quick Draw',
        description: 'Answer a question in under 30 seconds',
        icon: '💨',
        category: 'speed',
        requirement: 30,
        type: 'answer_time'
      }
    },
    special: {
      hintMaster: {
        id: 'hintMaster',
        name: 'Hint Master',
        description: 'Use hints 20 times',
        icon: '💡',
        category: 'special',
        requirement: 20,
        type: 'hint_usage'
      },
      socialSharer: {
        id: 'socialSharer',
        name: 'Social Sharer',
        description: 'Share quiz results 5 times',
        icon: '📤',
        category: 'special',
        requirement: 5,
        type: 'share_count'
      }
    }
  };

  static initializeBadgeSystem() {
    const existingBadges = this.getUserBadges();
    const existingStats = this.getBadgeStats();

    if (!existingBadges) {
      localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify({}));
    }

    if (!existingStats) {
      const initialStats = {
        quiz_count: 0,
        bookmark_count: 0,
        consecutive_correct: 0,
        max_consecutive_correct: 0,
        hint_usage: 0,
        share_count: 0,
        total_correct_answers: 0,
        total_questions_answered: 0,
        best_accuracy: 0,
        fastest_answer_time: null,
        quizzes_completed: [],
        created_at: Date.now()
      };
      localStorage.setItem(BADGE_STATS_KEY, JSON.stringify(initialStats));
    }
  }

  static getUserBadges() {
    try {
      const badges = localStorage.getItem(BADGE_STORAGE_KEY);
      return badges ? JSON.parse(badges) : {};
    } catch (error) {
      console.error('Error loading user badges:', error);
      return {};
    }
  }

  static getBadgeStats() {
    try {
      const stats = localStorage.getItem(BADGE_STATS_KEY);
      return stats ? JSON.parse(stats) : null;
    } catch (error) {
      console.error('Error loading badge stats:', error);
      return null;
    }
  }

  static updateBadgeStats(updates) {
    try {
      const currentStats = this.getBadgeStats() || {};
      const updatedStats = { ...currentStats, ...updates };
      localStorage.setItem(BADGE_STATS_KEY, JSON.stringify(updatedStats));
      return updatedStats;
    } catch (error) {
      console.error('Error updating badge stats:', error);
      return null;
    }
  }

  static awardBadge(badgeId) {
    try {
      const userBadges = this.getUserBadges();
      if (!userBadges[badgeId]) {
        userBadges[badgeId] = {
          id: badgeId,
          earnedAt: Date.now(),
          isNew: true
        };
        localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(userBadges));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error awarding badge:', error);
      return false;
    }
  }

  static markBadgeAsViewed(badgeId) {
    try {
      const userBadges = this.getUserBadges();
      if (userBadges[badgeId]) {
        userBadges[badgeId].isNew = false;
        localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(userBadges));
      }
    } catch (error) {
      console.error('Error marking badge as viewed:', error);
    }
  }

  static checkAndAwardBadges(eventType, data = {}) {
    const newlyEarnedBadges = [];
    const stats = this.getBadgeStats();

    if (!stats) return newlyEarnedBadges;

    Object.values(this.badgeDefinitions).forEach(category => {
      Object.values(category).forEach(badge => {
        if (this.shouldAwardBadge(badge, stats, eventType, data)) {
          const wasAwarded = this.awardBadge(badge.id);
          if (wasAwarded) {
            newlyEarnedBadges.push(badge);
          }
        }
      });
    });

    return newlyEarnedBadges;
  }

  static shouldAwardBadge(badge, stats, eventType, data) {
    const userBadges = this.getUserBadges();
    if (userBadges[badge.id]) return false;

    switch (badge.type) {
      case 'quiz_count':
        return stats.quiz_count >= badge.requirement;

      case 'bookmark_count':
        return stats.bookmark_count >= badge.requirement;

      case 'accuracy':
        return data.accuracy !== undefined && data.accuracy >= badge.requirement;

      case 'consecutive_correct':
        return stats.max_consecutive_correct >= badge.requirement;

      case 'answer_time':
        return data.answerTime !== undefined && data.answerTime <= badge.requirement;

      case 'hint_usage':
        return stats.hint_usage >= badge.requirement;

      case 'share_count':
        return stats.share_count >= badge.requirement;

      default:
        return false;
    }
  }

  static onQuizCompleted(quizData) {
    const { score, totalQuestions, timeSpent, averageTimePerQuestion } = quizData;
    const accuracy = Math.round((score / totalQuestions) * 100);

    const stats = this.getBadgeStats();
    const updatedStats = this.updateBadgeStats({
      quiz_count: stats.quiz_count + 1,
      total_correct_answers: stats.total_correct_answers + score,
      total_questions_answered: stats.total_questions_answered + totalQuestions,
      best_accuracy: Math.max(stats.best_accuracy, accuracy),
      quizzes_completed: [...(stats.quizzes_completed || []), {
        date: Date.now(),
        score,
        totalQuestions,
        accuracy,
        timeSpent
      }]
    });

    return this.checkAndAwardBadges('quiz_completed', {
      accuracy,
      timeSpent,
      averageTimePerQuestion
    });
  }

  static onAnswerSubmitted(isCorrect, timeSpent) {
    const stats = this.getBadgeStats();
    const newConsecutive = isCorrect ? stats.consecutive_correct + 1 : 0;

    const updatedStats = this.updateBadgeStats({
      consecutive_correct: newConsecutive,
      max_consecutive_correct: Math.max(stats.max_consecutive_correct, newConsecutive),
      fastest_answer_time: stats.fastest_answer_time
        ? Math.min(stats.fastest_answer_time, timeSpent)
        : timeSpent
    });

    return this.checkAndAwardBadges('answer_submitted', {
      answerTime: timeSpent,
      isCorrect,
      consecutiveCorrect: newConsecutive
    });
  }

  static onBookmarkAdded() {
    const stats = this.getBadgeStats();
    this.updateBadgeStats({
      bookmark_count: stats.bookmark_count + 1
    });

    return this.checkAndAwardBadges('bookmark_added');
  }

  static onHintUsed() {
    const stats = this.getBadgeStats();
    this.updateBadgeStats({
      hint_usage: stats.hint_usage + 1
    });

    return this.checkAndAwardBadges('hint_used');
  }

  static onResultShared() {
    const stats = this.getBadgeStats();
    this.updateBadgeStats({
      share_count: stats.share_count + 1
    });

    return this.checkAndAwardBadges('result_shared');
  }

  static getAllBadges() {
    const allBadges = [];
    Object.values(this.badgeDefinitions).forEach(category => {
      allBadges.push(...Object.values(category));
    });
    return allBadges;
  }

  static getBadgesByCategory() {
    return this.badgeDefinitions;
  }

  static getEarnedBadges() {
    const userBadges = this.getUserBadges();
    const allBadges = this.getAllBadges();

    return allBadges.filter(badge => userBadges[badge.id]).map(badge => ({
      ...badge,
      earnedAt: userBadges[badge.id].earnedAt,
      isNew: userBadges[badge.id].isNew
    }));
  }

  static getLockedBadges() {
    const userBadges = this.getUserBadges();
    const allBadges = this.getAllBadges();

    return allBadges.filter(badge => !userBadges[badge.id]);
  }

  static getNewBadges() {
    const userBadges = this.getUserBadges();
    const allBadges = this.getAllBadges();

    return allBadges.filter(badge =>
      userBadges[badge.id] && userBadges[badge.id].isNew
    ).map(badge => ({
      ...badge,
      earnedAt: userBadges[badge.id].earnedAt
    }));
  }

  static getBadgeProgress(badge) {
    const stats = this.getBadgeStats();
    if (!stats) return { current: 0, required: badge.requirement, percentage: 0 };

    let current = 0;

    switch (badge.type) {
      case 'quiz_count':
        current = stats.quiz_count;
        break;
      case 'bookmark_count':
        current = stats.bookmark_count;
        break;
      case 'consecutive_correct':
        current = stats.max_consecutive_correct;
        break;
      case 'hint_usage':
        current = stats.hint_usage;
        break;
      case 'share_count':
        current = stats.share_count;
        break;
      default:
        current = 0;
    }

    const percentage = Math.min(Math.round((current / badge.requirement) * 100), 100);

    return {
      current: Math.min(current, badge.requirement),
      required: badge.requirement,
      percentage
    };
  }

  static getOverallProgress() {
    const allBadges = this.getAllBadges();
    const earnedBadges = this.getEarnedBadges();

    const totalBadges = allBadges.length;
    const earnedCount = earnedBadges.length;
    const percentage = Math.round((earnedCount / totalBadges) * 100);

    return {
      earned: earnedCount,
      total: totalBadges,
      percentage
    };
  }

  static resetBadgeSystem() {
    try {
      localStorage.removeItem(BADGE_STORAGE_KEY);
      localStorage.removeItem(BADGE_STATS_KEY);
      this.initializeBadgeSystem();
      return true;
    } catch (error) {
      console.error('Error resetting badge system:', error);
      return false;
    }
  }

  static exportBadgeData() {
    return {
      badges: this.getUserBadges(),
      stats: this.getBadgeStats(),
      earnedBadges: this.getEarnedBadges(),
      exportedAt: Date.now()
    };
  }

  static importBadgeData(data) {
    try {
      if (data.badges) {
        localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(data.badges));
      }
      if (data.stats) {
        localStorage.setItem(BADGE_STATS_KEY, JSON.stringify(data.stats));
      }
      return true;
    } catch (error) {
      console.error('Error importing badge data:', error);
      return false;
    }
  }
}

export default BadgeManager;
