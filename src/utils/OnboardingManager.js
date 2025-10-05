const OnboardingManager = {
  isCompleted() {
    return localStorage.getItem('onboardingCompleted') === 'true'
  },
  markCompleted() {
    localStorage.setItem('onboardingCompleted', 'true')
  },
  reset() {
    localStorage.removeItem('onboardingCompleted')
    localStorage.removeItem('onboardingStep')
    localStorage.removeItem('onboardingCategories')
    localStorage.removeItem('onboardingDifficulty')
    localStorage.removeItem('onboardingSound')
    localStorage.removeItem('onboardingCompletedAt')
    // also remove any temporary quizPreferences set
    try { localStorage.removeItem('quizPreferences') } catch {}
  },
  open() {
    window.dispatchEvent(new Event('open-onboarding'))
  },
}

export default OnboardingManager
