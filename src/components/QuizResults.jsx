import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizResults = ({ score, totalQuestions, onRestart, questions, selectedAnswers }) => {
  const navigate = useNavigate();

  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getResultMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! 🏆", emoji: "🎯", color: "text-yellow-600" };
    if (percentage >= 80) return { message: "Excellent! 🌟", emoji: "⭐", color: "text-green-600" };
    if (percentage >= 70) return { message: "Great Job! 👏", emoji: "👍", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Good Effort! 💪", emoji: "👌", color: "text-purple-600" };
    return { message: "Keep Trying! 📚", emoji: "💪", color: "text-red-600" };
  };

  const result = getResultMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform animate-pulse">
        {/* Celebration Animation */}
        <div className="text-8xl mb-6 animate-bounce">
          {result.emoji}
        </div>

        {/* Results Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Quiz Complete!
        </h2>
        
        <p className={`text-2xl font-semibold mb-6 ${result.color}`}>
          {result.message}
        </p>

        {/* Score Display */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="text-6xl font-bold text-gray-800 mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-xl text-gray-600 mb-4">
            {percentage}% Correct
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
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
              <span className="text-2xl font-bold text-purple-600">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-green-700">Correct</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
            <div className="text-sm text-red-700">Incorrect</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🔄 Try Again
          </button>
          
          <button
            onClick={() => window.open('https://opentdb.com/', '_blank')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            🌐 More Quizzes
          </button>

          {/* ✅ Review Answers Button */}
          <button
            onClick={() => navigate('/review', { state: { questions, selectedAnswers } })}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            📖 Review Answers
          </button>
        </div>

        {/* Share Results */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">Share your results:</p>
          <button>
            📱 Share Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
