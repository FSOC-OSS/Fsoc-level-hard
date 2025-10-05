import React, { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

// Lightweight onboarding modal implementing the requested steps.
const STEPS = {
  WELCOME: 0,
  WALKTHROUGH: 1,
  TUTORIAL: 2,
  PREFERENCES: 3,
  COMPLETE: 4,
}

const slides = [
  { title: 'Track Progress & Badges', desc: 'Earn badges and level up as you complete quizzes.', emoji: '🏅' },
  { title: 'Bookmarks & Review', desc: 'Save questions to review later and improve.', emoji: '🔖' },
  { title: 'Timed Challenges', desc: 'Use timers to make quizzes more exciting.', emoji: '⏱️' },
  { title: 'Assistive Tools', desc: 'Hints, ratings and accessibility built-in.', emoji: '🛠️' },
]

const Onboarding = ({ initialOpen = false, onClose = () => {} }) => {
  const { preference, setPreference } = useTheme()
  const [open, setOpen] = useState(initialOpen)
  const [step, setStep] = useState(Number(localStorage.getItem('onboardingStep') || 0))
  const [selectedCategories, setSelectedCategories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('onboardingCategories') || '[]')
    } catch { return [] }
  })
  const [difficulty, setDifficulty] = useState(localStorage.getItem('onboardingDifficulty') || 'medium')
  const [soundEnabled, setSoundEnabled] = useState(JSON.parse(localStorage.getItem('onboardingSound') || 'true'))

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('open-onboarding', handleOpen)
    return () => window.removeEventListener('open-onboarding', handleOpen)
  }, [])

  useEffect(() => {
    localStorage.setItem('onboardingStep', String(step))
  }, [step])

  const close = () => {
    setOpen(false)
    onClose()
  }

  const skip = () => {
    localStorage.setItem('onboardingCompleted', 'true')
    close()
  }

  const next = () => setStep((s) => Math.min(s + 1, Object.keys(STEPS).length))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const toggleCategory = (c) => {
    setSelectedCategories((prev) => {
      const found = prev.includes(c)
      const next = found ? prev.filter((p) => p !== c) : [...prev, c]
      localStorage.setItem('onboardingCategories', JSON.stringify(next))
      return next
    })
  }

  const savePreferences = () => {
    const prefs = {
      category: { id: null, name: selectedCategories[0] || '' },
      difficulty,
      soundEffects: soundEnabled,
      numQuestions: 10,
      hintsPerQuiz: 3,
    }
    try { localStorage.setItem('quizPreferences', JSON.stringify(prefs)) } catch {}
    localStorage.setItem('onboardingCompleted', 'true')
    localStorage.setItem('onboardingCompletedAt', String(Date.now()))
    // give a small simulated bonus
    try {
      const prev = JSON.parse(localStorage.getItem('userBonuses') || '{}')
      prev.welcomeXP = (prev.welcomeXP || 0) + 50
      localStorage.setItem('userBonuses', JSON.stringify(prev))
    } catch {}
    setStep(STEPS.COMPLETE)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={skip} />
      <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-3xl font-bold">{
                step === STEPS.WELCOME ? 'Welcome to Quiz Challenge' : step === STEPS.WALKTHROUGH ? 'Features' : step === STEPS.TUTORIAL ? 'Interactive Tutorial' : step === STEPS.PREFERENCES ? 'Set Your Preferences' : 'All Set!'
              }</div>
              <div className="text-gray-600 mt-1">
                {step === STEPS.WELCOME && 'A short guided tour to help you get comfortable with the app.'}
                {step === STEPS.WALKTHROUGH && 'Swipe or use Next/Previous to browse key features.'}
                {step === STEPS.TUTORIAL && 'We will highlight parts of the UI and walk you through taking a quiz.'}
                {step === STEPS.PREFERENCES && 'Pick a theme, difficulty and favorite categories to personalize your quizzes.'}
                {step === STEPS.COMPLETE && 'Congratulations — your onboarding is complete!'}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-transparent text-sm text-gray-600" onClick={skip}>Skip</button>
              <button className="px-3 py-1 rounded bg-purple-600 text-white" onClick={close}>Close</button>
            </div>
          </div>

          <div className="mt-6">
            {step === STEPS.WELCOME && (
              <div className="text-center py-8">
                <div className="text-6xl">🎉</div>
                <h3 className="text-xl font-semibold mt-4">Welcome aboard!</h3>
                <p className="text-gray-600 mt-2">Let's take a quick tour to show you where things are and how to start your first quiz.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <button onClick={() => setStep(STEPS.WALKTHROUGH)} className="px-4 py-2 bg-purple-600 text-white rounded">Get Started</button>
                  <button onClick={skip} className="px-4 py-2 bg-gray-100 rounded">Maybe later</button>
                </div>
              </div>
            )}

            {step === STEPS.WALKTHROUGH && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slides.map((s, i) => (
                    <div key={i} className="p-4 border rounded-lg bg-gray-50">
                      <div className="text-3xl">{s.emoji}</div>
                      <div className="font-semibold mt-2">{s.title}</div>
                      <div className="text-sm text-gray-600">{s.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button onClick={prev} className="px-3 py-1 rounded bg-gray-100">Previous</button>
                    <button onClick={() => setStep(STEPS.TUTORIAL)} className="px-3 py-1 rounded bg-purple-600 text-white">Next</button>
                  </div>
                  <div className="text-sm text-gray-500">{slides.length} slides</div>
                </div>
              </div>
            )}

            {step === STEPS.TUTORIAL && (
              <div className="p-4">
                <div className="mb-4">We'll highlight the quiz area and explain how to answer questions. Click "Next" to simulate moving through a question.</div>
                <div className="mb-4 p-4 rounded bg-white/60 border">
                  <div className="font-semibold">Quiz Area</div>
                  <div className="text-sm text-gray-600">This is where questions appear. Try pausing, using hints or changing the timer.</div>
                </div>
                <div className="flex justify-between">
                  <button onClick={prev} className="px-3 py-1 rounded bg-gray-100">Back</button>
                  <button onClick={() => setStep(STEPS.PREFERENCES)} className="px-3 py-1 rounded bg-purple-600 text-white">Got it</button>
                </div>
              </div>
            )}

            {step === STEPS.PREFERENCES && (
              <div className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <div className="font-semibold">Theme</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => setPreference('light')} className={`px-3 py-1 rounded ${preference === 'light' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Light</button>
                      <button onClick={() => setPreference('dark')} className={`px-3 py-1 rounded ${preference === 'dark' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Dark</button>
                    </div>
                  </div>

                  <div className="p-4 border rounded">
                    <div className="font-semibold">Difficulty</div>
                    <div className="mt-2 flex gap-2">
                      {['easy','medium','hard'].map(d => (
                        <button key={d} onClick={() => setDifficulty(d)} className={`px-3 py-1 rounded ${difficulty===d ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>{d}</button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border rounded md:col-span-2">
                    <div className="font-semibold">Favorite Categories</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Science','History','Geography','Sports','Computers'].map(cat => (
                        <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1 rounded ${selectedCategories.includes(cat) ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>{cat}</button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border rounded md:col-span-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Sound Effects</div>
                      <div className="text-sm text-gray-600">Enable click/success sounds</div>
                    </div>
                    <label className="inline-flex items-center">
                      <input type="checkbox" checked={soundEnabled} onChange={e => { setSoundEnabled(e.target.checked); localStorage.setItem('onboardingSound', String(e.target.checked)) }} />
                      <span className="ml-2 text-sm">{soundEnabled ? 'On' : 'Off'}</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <button onClick={prev} className="px-3 py-1 rounded bg-gray-100">Back</button>
                  <div>
                    <button onClick={() => { savePreferences() }} className="px-4 py-2 bg-green-600 text-white rounded">Save & Continue</button>
                  </div>
                </div>
              </div>
            )}

            {step === STEPS.COMPLETE && (
              <div className="p-8 text-center">
                <div className="text-6xl">🎊</div>
                <h3 className="text-2xl font-bold mt-4">You're ready!</h3>
                <p className="text-gray-600 mt-2">You've earned a small welcome bonus. Good luck on your first quiz!</p>
                <div className="mt-6 flex justify-center gap-3">
                  <button onClick={() => { close() }} className="px-4 py-2 bg-purple-600 text-white rounded">Start Your First Quiz</button>
                  <button onClick={() => { localStorage.setItem('onboardingCompleted', 'true'); close() }} className="px-4 py-2 bg-gray-100 rounded">Maybe later</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
