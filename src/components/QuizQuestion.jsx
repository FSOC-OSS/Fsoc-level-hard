"use client"

import { useState, useEffect, useCallback } from "react"
import { FadeIn, SlideIn, ScaleIn, StaggerChildren } from "./AnimationWrappers"
import { useAnimations } from "../context/AnimationContext"
import BookmarkManager from "../utils/BookmarkManager"
import BadgeManager from "../utils/BadgeManager"
import FeedbackManager from "../utils/FeedbackManager"
import VoiceControls from "./VoiceControls"
import VoiceSettings from "./VoiceSettings"
import StarRating from "./StarRating"
import ReportModal from "./ReportModal"
import CommentSection from "./CommentSection"
import ThankYouModal from "./ThankYouModal"
import { useVoice } from "../hooks/useVoice"

const QuizQuestion = ({
  question,
  onAnswerSelect,
  selectedAnswer,
  isTimerEnabled,
  onResultAnnounced,
  hintsRemaining,
  onRequestHint,
  userId,
  username,
  onRatingSubmit,
}) => {
  useAnimations();
  
  // Local state
  const [clickedAnswer, setClickedAnswer] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isAnnouncingResult, setIsAnnouncingResult] = useState(false)
  const [hasResultBeenAnnounced, setHasResultBeenAnnounced] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [eliminatedIndices, setEliminatedIndices] = useState(new Set())
  
  // Feedback states
  const [showFeedbackSection, setShowFeedbackSection] = useState(false)
  const [feedbackSummary, setFeedbackSummary] = useState(null)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [thankYouType, setThankYouType] = useState(null)

  const {
    isListening,
    isSpeaking,
    transcript,
    voiceSettings,
    availableVoices,
    microphonePermission,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    parseVoiceAnswer,
    updateVoiceSettings,
    setTranscript,
  } = useVoice()

  useEffect(() => {
    FeedbackManager.initializeFeedbackSystem()
  }, [])

  const loadFeedbackSummary = useCallback(() => {
    const questionId = question.id || BookmarkManager.generateQuestionId(question)
    
    try {
      const feedback = FeedbackManager.getQuestionFeedback(questionId)
      
      if (feedback) {
        const summary = {
          rating: {
            average: Number(feedback.averageRating) || 0,
            count: Number(feedback.totalRatings) || 0
          },
          commentCount: Array.isArray(feedback.comments) ? feedback.comments.length : 0,
          reported: feedback.status === 'under_review'
        }
        setFeedbackSummary(summary)
      } else {
        setFeedbackSummary(null)
      }
    } catch (error) {
      console.error('Error loading feedback summary:', error)
      setFeedbackSummary(null)
    }
  }, [question])

  useEffect(() => {
    setClickedAnswer(null)
    setIsTimedOut(false)
    setShowResult(false)
    setIsAnnouncingResult(false)
    setHasResultBeenAnnounced(false)
    setQuestionStartTime(Date.now())
    stopSpeaking()
    setTranscript("")
    setHintsUsed(0)
    setEliminatedIndices(new Set())
    setShowFeedbackSection(false)

    const questionId = question.id || BookmarkManager.generateQuestionId(question)
    setIsBookmarked(BookmarkManager.isBookmarked(questionId))
    setShowHint(false)

    loadFeedbackSummary()
  }, [question, stopSpeaking, setTranscript, loadFeedbackSummary])

  useEffect(() => {
    if ((selectedAnswer || clickedAnswer || isTimedOut) && !showResult) {
      setShowResult(true)
    }
  }, [selectedAnswer, clickedAnswer, isTimedOut, showResult])

  const handleAnswerClick = (answer) => {
    if (selectedAnswer || isAnnouncingResult) return

    const answerTime = questionStartTime ? (Date.now() - questionStartTime) / 1000 : 0
    const isCorrect = answer === question.correct_answer

    BadgeManager.onAnswerSubmitted(isCorrect, answerTime)

    setClickedAnswer(answer)
    onAnswerSelect(answer)
  }

  const handleHintRequest = () => {
    if (hintsUsed >= 1 || hintsRemaining <= 0 || selectedAnswer || clickedAnswer || isTimedOut) {
      return
    }
    if (typeof onRequestHint === "function" && onRequestHint()) {
      setHintsUsed(1)
      setShowHint(true)
      eliminateTwoWrongAnswers()
      BadgeManager.onHintUsed()
    }
  }

  const getHintText = () => {
    if (hintsUsed === 1 && eliminatedIndices.size > 0) {
      const letters = Array.from(eliminatedIndices)
        .sort((a, b) => a - b)
        .map((i) => String.fromCharCode(65 + i))
      return `50/50 used: Eliminated options ${letters.join(" and ")}.`
    }
    return ""
  }

  const handleBookmarkToggle = () => {
    const result = BookmarkManager.toggleBookmark(question)
    if (result.success) {
      setIsBookmarked(!isBookmarked)
      if (result.action === "added") {
        BadgeManager.onBookmarkAdded()
      }
    }
  }

  useEffect(() => {
    if (showResult && question && !hasResultBeenAnnounced) {
      const isCorrect = selectedAnswer === question.correct_answer
      const correctIndex = question.answers.indexOf(question.correct_answer)
      const correctOption = String.fromCharCode(65 + correctIndex)

      let resultText = ""
      if (isTimedOut) {
        resultText = `Time's up! The correct answer was "${question.correct_answer}", option ${correctOption}.`
      } else if (isCorrect) {
        resultText = "Correct! Well done!"
      } else {
        resultText = `Incorrect. The correct answer was "${question.correct_answer}", option ${correctOption}.`
      }

      setIsAnnouncingResult(true)
      speak(resultText, () => {
        setIsAnnouncingResult(false)
        setHasResultBeenAnnounced(true)
        if (onResultAnnounced) onResultAnnounced()
      })
    }
  }, [showResult, selectedAnswer, isTimedOut, question, hasResultBeenAnnounced, speak, onResultAnnounced])

  const getButtonClass = (answer) => {
    const base = "w-full p-4 text-left rounded-lg font-medium transition-all duration-300 transform "
    if (!selectedAnswer && !clickedAnswer && !isTimedOut) {
      return (
        base +
        "bg-white hover:bg-purple-50 hover:scale-105 hover:shadow-lg text-gray-800 border-2 border-transparent hover:border-purple-300"
      )
    }
    if (selectedAnswer || clickedAnswer || isTimedOut) {
      if (answer === question.correct_answer)
        return base + "bg-green-500 text-white border-2 border-green-600 scale-105 shadow-lg"
      if (answer === (selectedAnswer || clickedAnswer))
        return base + "bg-red-500 text-white border-2 border-red-600 scale-105 shadow-lg"
      return base + "bg-gray-300 text-gray-600 border-2 border-gray-400"
    }
    return base
  }

  const getAnswerIcon = (answer) => {
    if (!selectedAnswer && !clickedAnswer && !isTimedOut) return null
    if (answer === question.correct_answer) return <span className="text-2xl">✓</span>
    if (answer === (selectedAnswer || clickedAnswer)) return <span className="text-2xl">✗</span>
    return null
  }

  const eliminateTwoWrongAnswers = () => {
    const wrong = question.answers.map((ans, idx) => ({ ans, idx })).filter((x) => x.ans !== question.correct_answer)
    const shuffled = [...wrong].sort(() => Math.random() - 0.5)
    const toRemove = shuffled.slice(0, Math.min(2, wrong.length)).map((x) => x.idx)
    setEliminatedIndices(new Set(toRemove))
  }

  const questionId = question.id || BookmarkManager.generateQuestionId(question)

  return (
    <>
      <FadeIn duration={0.4}>
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto relative" data-quiz-question="true">
          <div className="absolute top-4 right-4 z-10">
            <ScaleIn delay={0.2}>
              <VoiceControls
                question={question}
                onAnswerSelect={handleAnswerClick}
                selectedAnswer={selectedAnswer || clickedAnswer}
                isListening={isListening}
                isSpeaking={isSpeaking}
                transcript={transcript}
                microphonePermission={microphonePermission}
                onSpeak={speak}
                onStopSpeaking={stopSpeaking}
                onStartListening={startListening}
                onStopListening={stopListening}
                onOpenSettings={() => setIsSettingsOpen(true)}
                parseVoiceAnswer={parseVoiceAnswer}
                setTranscript={setTranscript}
                isTimedOut={isTimedOut}
                showResult={showResult}
                isAnnouncingResult={isAnnouncingResult}
              />
            </ScaleIn>
          </div>

          <div className="mb-8 pr-48 flex justify-between items-start">
            <div>
              <SlideIn direction="left" delay={0.1}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <span className="text-2xl">🤔</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">{question.category}</span>
                </div>
              </SlideIn>
              
              <SlideIn direction="left" delay={0.2}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">{question.question}</h2>
              </SlideIn>

              <StaggerChildren staggerDelay={0.05} initialDelay={0.3}>
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {question.difficulty}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {question.type}
                  </span>
                  {isTimerEnabled && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      ⏱️ Timed
                    </span>
                  )}
                  {isAnnouncingResult && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      🔊 Announcing Result...
                    </span>
                  )}
                  {hintsRemaining > hintsUsed && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      💡 {hintsRemaining - hintsUsed} hint{hintsRemaining - hintsUsed > 1 ? "s" : ""} remaining
                    </span>
                  )}
                  {feedbackSummary && feedbackSummary.rating.count > 0 && (
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      ⭐ {Number(feedbackSummary.rating.average).toFixed(1)} ({feedbackSummary.rating.count})
                    </span>
                  )}
                  {feedbackSummary && feedbackSummary.reported && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      🚩 Reported
                    </span>
                  )}
                </div>
              </StaggerChildren>
            </div>

            <SlideIn direction="right" delay={0.2}>
              <div className="flex gap-2">
                <button
                  onClick={handleHintRequest}
                  disabled={hintsUsed >= 1 || hintsRemaining <= 0 || selectedAnswer || clickedAnswer || isTimedOut}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    hintsUsed >= 1 || hintsRemaining <= 0 || selectedAnswer || clickedAnswer || isTimedOut
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-yellow-500 hover:text-yellow-600"
                  }`}
                  title={hintsRemaining <= 0 ? "No hints remaining" : "Use 50/50 hint"}
                  aria-label="Use 50/50 hint"
                >
                  <svg className="w-6 h-6 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className="px-2 py-1 rounded-md text-sm font-semibold bg-yellow-100 text-yellow-800" aria-live="polite">
                  {hintsRemaining} left
                </div>

                <button
                  onClick={handleBookmarkToggle}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isBookmarked ? "text-orange-500 hover:text-orange-600" : "text-gray-400 hover:text-orange-500"}`}
                  title={isBookmarked ? "Remove bookmark" : "Bookmark this question"}
                >
                  <svg
                    className="w-6 h-6 transition-all duration-300"
                    fill={isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
              </div>
            </SlideIn>
          </div>

          {showHint && (
            <FadeIn duration={0.3}>
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-yellow-600">💡</div>
                  <span className="font-semibold text-yellow-800">Hint:</span>
                </div>
                <p className="text-yellow-700">{getHintText()}</p>
              </div>
            </FadeIn>
          )}

          <StaggerChildren staggerDelay={0.1} initialDelay={0.4}>
            <div className="space-y-4">
              {question.answers.map((answer, index) => {
                const isEliminated = eliminatedIndices.has(index)
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(answer)}
                    disabled={selectedAnswer || clickedAnswer || isTimedOut || isAnnouncingResult || isEliminated}
                    className={`${getButtonClass(answer)} ${
                      isEliminated
                        ? "opacity-0 scale-95 pointer-events-none h-0 py-0 my-0 overflow-hidden transition-all duration-300"
                        : "transition-all duration-300"
                    }`}
                    data-quiz-answer="true"
                    data-answer-index={index}
                    aria-hidden={isEliminated ? "true" : "false"}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{answer}</span>
                      </div>
                      {getAnswerIcon(answer)}
                    </div>
                  </button>
                )
              })}
            </div>
          </StaggerChildren>

          {(selectedAnswer || clickedAnswer || isTimedOut) && (
            <SlideIn direction="up" delay={0.2}>
              <div className="mt-6 p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 flex-wrap">
                  {isTimedOut && !selectedAnswer && !clickedAnswer ? (
                    <>
                      <span className="text-2xl">⏱️</span>
                      <span className="text-orange-600 font-semibold text-lg">
                        Time's up! The correct answer was: {question.correct_answer} (Option{" "}
                        {String.fromCharCode(65 + question.answers.indexOf(question.correct_answer))})
                      </span>
                    </>
                  ) : (selectedAnswer || clickedAnswer) === question.correct_answer ? (
                    <>
                      <span className="text-2xl">🎉</span>
                      <span className="text-green-600 font-semibold text-lg">Correct!</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">😔</span>
                      <span className="text-red-600 font-semibold text-lg">
                        Incorrect. The correct answer is: {question.correct_answer} (Option{" "}
                        {String.fromCharCode(65 + question.answers.indexOf(question.correct_answer))})
                      </span>
                    </>
                  )}
                </div>
              </div>
            </SlideIn>
          )}

          {(selectedAnswer || clickedAnswer || isTimedOut) && (
            <FadeIn delay={0.4}>
              <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                <ScaleIn delay={0.5}>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 font-medium mb-3">How would you rate this question?</p>
                    <StarRating
                      questionId={questionId}
                      userId={userId}
                      onRatingSubmit={(rating) => {
                        if (onRatingSubmit) onRatingSubmit(rating)
                        setThankYouType('rating')
                        setShowThankYouModal(true)
                        
                        setTimeout(() => {
                          loadFeedbackSummary()
                        }, 500)
                      }}
                    />
                  </div>
                </ScaleIn>

                <SlideIn direction="up" delay={0.6}>
                  <div className="flex justify-between items-center">
                    <ReportModal
                      questionId={questionId}
                      userId={userId}
                      question={question}
                      onReportSubmitted={() => {
                        setThankYouType('report')
                        setShowThankYouModal(true)
                      }}
                    />
                    
                    <button
                      onClick={() => setShowFeedbackSection(!showFeedbackSection)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                    >
                      {showFeedbackSection ? "Hide Comments" : "View Comments"} 
                      {feedbackSummary?.commentCount > 0 && ` (${feedbackSummary.commentCount})`}
                    </button>
                  </div>
                </SlideIn>

                {showFeedbackSection && (
                  <FadeIn duration={0.3}>
                    <CommentSection
                      questionId={questionId}
                      userId={userId}
                      username={username}
                      onCommentPosted={() => {
                        setThankYouType('comment')
                        setShowThankYouModal(true)
                      }}
                    />
                  </FadeIn>
                )}
              </div>
            </FadeIn>
          )}
        </div>
      </FadeIn>

      <VoiceSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voiceSettings={voiceSettings}
        availableVoices={availableVoices}
        onUpdateSettings={updateVoiceSettings}
      />

      <ThankYouModal
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        feedbackType={thankYouType}
      />
    </>
  )
}

export default QuizQuestion