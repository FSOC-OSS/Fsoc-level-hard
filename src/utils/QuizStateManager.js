const QUIZ_STATE_KEY = 'quizPausedState'
const QUIZ_STATE_EXPIRY_HOURS = 24

class QuizStateManager {
  static saveQuizState(state) {
    try {
      const stateWithTimestamp = {
        ...state,
        timestamp: Date.now(),
        expiresAt: Date.now() + (QUIZ_STATE_EXPIRY_HOURS * 60 * 60 * 1000)
      }

      localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(stateWithTimestamp))
      return true
    } catch (error) {
      console.warn('Failed to save quiz state:', error)
      return false
    }
  }

  static loadQuizState() {
    try {
      const savedState = localStorage.getItem(QUIZ_STATE_KEY)
      if (!savedState) return null

      const state = JSON.parse(savedState)

      // Check if state has expired
      if (state.expiresAt && Date.now() > state.expiresAt) {
        this.clearQuizState()
        return null
      }

      // Validate required fields
      if (!state.questions || !Array.isArray(state.questions) || state.questions.length === 0) {
        this.clearQuizState()
        return null
      }

      return state
    } catch (error) {
      console.warn('Failed to load quiz state:', error)
      this.clearQuizState()
      return null
    }
  }

  static clearQuizState() {
    try {
      localStorage.removeItem(QUIZ_STATE_KEY)
      return true
    } catch (error) {
      console.warn('Failed to clear quiz state:', error)
      return false
    }
  }

  static hasValidSavedState() {
    const state = this.loadQuizState()
    return state !== null
  }

  static createQuizState({
    questions,
    currentQuestionIndex,
    selectedAnswers,
    score,
    baseScore,
    bonusScore,
    currentStreak,
    bestStreak,
    streakEvents,
    timeRemaining,
    timerDuration,
    isTimerEnabled,
    selectedCategory,
    quizStartTime
  }) {
    return {
      questions: questions.map(q => ({
        ...q,
        // Ensure answers are properly stored
        answers: q.answers || []
      })),
      currentQuestionIndex: currentQuestionIndex || 0,
      selectedAnswers: selectedAnswers || [],
      score: score || 0,
      baseScore: baseScore || 0,
      bonusScore: bonusScore || 0,
      currentStreak: currentStreak || 0,
      bestStreak: bestStreak || 0,
      streakEvents: Array.isArray(streakEvents) ? streakEvents : [],
      timeRemaining: timeRemaining || null,
      timerDuration: timerDuration || 30,
      isTimerEnabled: isTimerEnabled !== false,
      selectedCategory: selectedCategory || '',
      quizStartTime: quizStartTime || Date.now(),
      pausedAt: Date.now()
    }
  }

  static validateQuizState(state) {
    if (!state || typeof state !== 'object') return false

    const requiredFields = ['questions', 'currentQuestionIndex', 'selectedAnswers']
    for (const field of requiredFields) {
      if (!(field in state)) return false
    }

    if (!Array.isArray(state.questions) || state.questions.length === 0) return false
    if (typeof state.currentQuestionIndex !== 'number' || state.currentQuestionIndex < 0) return false
    if (!Array.isArray(state.selectedAnswers)) return false

    return true
  }

  static getStateInfo() {
    const state = this.loadQuizState()
    if (!state) return null

    return {
      hasState: true,
      questionsCount: state.questions?.length || 0,
      currentQuestion: (state.currentQuestionIndex || 0) + 1,
      score: state.score || 0,
      pausedAt: state.pausedAt,
      timeRemaining: state.timeRemaining,
      category: state.selectedCategory
    }
  }

  static mergeSavedStateWithCurrent(savedState, currentState) {
    if (!this.validateQuizState(savedState)) {
      return currentState
    }

    // Merge saved state with current state, prioritizing saved state
    return {
      ...currentState,
      ...savedState,
      // Ensure we don't lose the current timer settings if they've changed
      timerDuration: currentState.timerDuration || savedState.timerDuration,
      isTimerEnabled: currentState.isTimerEnabled !== undefined
        ? currentState.isTimerEnabled
        : savedState.isTimerEnabled
    }
  }
}

export default QuizStateManager
