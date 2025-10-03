// Simple streak rules and helpers for multipliers, bonuses, and milestones

const STREAK_MILESTONES = [5, 10, 15, 20, 25, 50, 100]

const MULTIPLIERS = {
  5: 1.5,
  10: 2.0,
  15: 2.5,
  20: 3.0,
  25: 3.5,
  50: 4.0,
  100: 5.0
}

class StreakManager {
  static getMultiplierForStreak(streak) {
    let multiplier = 1
    for (const milestone of STREAK_MILESTONES) {
      if (streak >= milestone) {
        multiplier = MULTIPLIERS[milestone]
      }
    }
    return multiplier
  }

  static getNextMilestone(streak) {
    for (const milestone of STREAK_MILESTONES) {
      if (streak < milestone) return milestone
    }
    return null
  }

  static getJustHitMilestone(prevStreak, newStreak) {
    for (const milestone of STREAK_MILESTONES) {
      if (prevStreak < milestone && newStreak >= milestone) return milestone
    }
    return null
  }

  static calculateBonusForQuestion(isCorrect, currentStreak) {
    if (!isCorrect) return { addedStreak: 0, bonusPoints: 0, multiplier: 1, hitMilestone: null }

    const newStreak = currentStreak + 1
    const multiplier = this.getMultiplierForStreak(newStreak)
    const basePoint = 1
    const bonusPoints = Math.max(0, Math.round(basePoint * (multiplier - 1)))
    const hitMilestone = this.getJustHitMilestone(currentStreak, newStreak)

    return { addedStreak: 1, bonusPoints, multiplier, hitMilestone }
  }
}

export default StreakManager


