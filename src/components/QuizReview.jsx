import React, { useState } from 'react';

import './QuizReview.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


const QuizReview = ({ questions, userAnswers, onBack }) => {
  const [current, setCurrent] = useState(0);

  const goTo = (idx) => setCurrent(idx);
  const next = () => setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const isCorrect = userAnswers[current] === questions[current].correctAnswer;

  return (
    <div className="quiz-review-container">
      <div className="review-header">
        <button onClick={onBack} className="back-btn">Back to Results</button>
        <div className="progress-indicator">
          Question {current + 1} / {questions.length}
        </div>
      </div>
      <div className="question-nav">
        {questions.map((q, idx) => {
          const correct = userAnswers[idx] === q.correctAnswer;
          return (
            <button
              key={idx}
              className={`nav-dot ${current === idx ? 'active' : ''} ${correct ? 'correct' : 'incorrect'}`}
              onClick={() => goTo(idx)}
              aria-label={`Go to question ${idx + 1} (${correct ? 'correct' : 'incorrect'})`}
            >
              {idx + 1}
              {correct ? <FaCheckCircle className="icon-correct" /> : <FaTimesCircle className="icon-incorrect" />}
            </button>
          );
        })}
      </div>
      <div className="review-question-block">
        <div className="review-question">{questions[current].question}</div>
        <ul className="review-options">
          {questions[current].options.map((opt, i) => {
            const isUser = userAnswers[current] === opt;
            const isRight = questions[current].correctAnswer === opt;
            let className = 'option';
            let icon = null;
            if (isRight) {
              className += ' correct';
              icon = <FaCheckCircle className="icon-correct" title="Correct answer" />;
            }
            if (isUser && !isRight) {
              className += ' incorrect';
              icon = <FaTimesCircle className="icon-incorrect" title="Your answer (incorrect)" />;
            }
            return (
              <li key={i} className={className} aria-current={isUser ? 'true' : undefined}>
                <span>{opt}</span> {icon}
                {isUser && !isRight && <span className="user-label">Your answer</span>}
                {isRight && <span className="correct-label">Correct</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="review-controls">
        <button onClick={prev} disabled={current === 0} className="nav-btn">Previous</button>
        <button onClick={next} disabled={current === questions.length - 1} className="nav-btn">Next</button>


const QuizReview = ({ questions, userAnswers, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Questions Available</h2>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];
  
  // Get user's selected answer and whether it was correct
  const userSelectedAnswer = currentAnswer?.selectedAnswer || null;
  const isCorrect = currentAnswer?.isCorrect || false;
  const correctAnswer = currentQuestion.correct_answer;

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Review Your Answers</h1>
              <p className="text-purple-200">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-colors flex items-center gap-2"
              title="Back to Results"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Results
            </button>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Question Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const answer = userAnswers[index];
              const questionIsCorrect = answer?.isCorrect || false;
              const isCurrentQuestion = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 ${
                    isCurrentQuestion
                      ? 'ring-2 ring-white scale-110'
                      : 'hover:scale-105'
                  } ${
                    questionIsCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                  title={`Question ${index + 1} - ${questionIsCorrect ? 'Correct' : 'Incorrect'}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question Review */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  isCorrect 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {currentQuestionIndex + 1}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800'
                    : currentQuestion.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {currentQuestion.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {currentQuestion.question}
              </h3>
            </div>
            <div className={`text-3xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✅' : '❌'}
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-4">
            {currentQuestion.answers.map((answer, answerIndex) => {
              const isUserSelection = userSelectedAnswer === answer;
              const isCorrectAnswer = answer === correctAnswer;
              
              let optionClass = "p-4 rounded-lg border-2 transition-colors ";
              
              if (isCorrectAnswer) {
                optionClass += "bg-green-500/20 border-green-400 text-green-100";
              } else if (isUserSelection && !isCorrectAnswer) {
                optionClass += "bg-red-500/20 border-red-400 text-red-100";
              } else {
                optionClass += "bg-white/10 border-white/20 text-white/80";
              }

              return (
                <div key={answerIndex} className={optionClass}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCorrectAnswer 
                          ? 'bg-green-400 text-green-900'
                          : isUserSelection
                          ? 'bg-red-400 text-red-900'
                          : 'bg-white/20 text-white'
                      }`}>
                        {String.fromCharCode(65 + answerIndex)}
                      </div>
                      <span className="text-sm">{answer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrectAnswer && (
                        <span className="text-green-400 text-xl">✓</span>
                      )}
                      {isUserSelection && !isCorrectAnswer && (
                        <span className="text-red-400 text-xl">✗</span>
                      )}
                      {isUserSelection && (
                        <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                          Your choice
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Message */}
          <div className={`p-4 rounded-lg ${
            isCorrect 
              ? 'bg-green-500/20 text-green-100'
              : 'bg-red-500/20 text-red-100'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {isCorrect ? '🎉' : '📚'}
              </span>
              <span className="font-medium">
                {isCorrect 
                  ? 'Correct! Well done!' 
                  : `Incorrect. The correct answer was: ${correctAnswer}`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="text-white font-medium">
            {currentQuestionIndex + 1} / {questions.length}
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentQuestionIndex === questions.length - 1
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
            }`}
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Review Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {userAnswers.filter(a => a?.isCorrect).length}
              </div>
              <div className="text-sm text-white/80">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {userAnswers.filter(a => !a?.isCorrect).length}
              </div>
              <div className="text-sm text-white/80">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round((userAnswers.filter(a => a?.isCorrect).length / questions.length) * 100)}%
              </div>
              <div className="text-sm text-white/80">Accuracy</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizReview;
