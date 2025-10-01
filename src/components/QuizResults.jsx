
import {
  exportToPDF,
  printScorecard,
} from "../utils/exportUtils";
import ShareResults from "./ShareResults";

const QuizResults = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getResultMessage = () => {
    if (percentage >= 90)
      return {
        message: "Outstanding! 🏆",
        emoji: "🎯",
        color: "text-yellow-600",
      };
    if (percentage >= 80)
      return { message: "Excellent! 🌟", emoji: "⭐", color: "text-green-600" };
    if (percentage >= 70)
      return { message: "Great Job! 👏", emoji: "👍", color: "text-blue-600" };
    if (percentage >= 50)
      return {
        message: "Good Effort! 💪",
        emoji: "👌",
        color: "text-purple-600",
      };
    return { message: "Keep Trying! 📚", emoji: "💪", color: "text-red-600" };
  };

  const result = getResultMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md w-full text-center">
        {/* Emoji Celebration */}
        <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">
          {result.emoji}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Quiz Complete!
        </h2>
        <p
          className={`text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 ${result.color}`}
        >
          {result.message}
        </p>

        {/* Score */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-base sm:text-lg md:text-xl text-gray-600 mb-4">
            {percentage}% Correct
          </div>

          {/* Progress Circle */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
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
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {score}
            </div>
            <div className="text-xs sm:text-sm text-green-700">Correct</div>
          </div>
          <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {totalQuestions - score}
            </div>
            <div className="text-xs sm:text-sm text-red-700">Incorrect</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            🔄 Try Again
          </button>

          <button
            onClick={() => window.open("https://opentdb.com/", "_blank")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            🌐 More Quizzes
          </button>
        </div>

        {/* Export & Share */}
        <div className="mt-4 sm:mt-6 space-y-2">
          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            Save or share your results:
          </p>

          <button
            onClick={() => exportToPDF(score, totalQuestions, percentage)}
            className="w-full bg-purple-200 hover:bg-purple-300 text-purple-900 font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
          >
            📄 Export as PDF
          </button>

          <button
            onClick={() => printScorecard(score, totalQuestions, percentage)}
            className="w-full bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
          >
            🖨 Print Scorecard
          </button>

          {/* <button
            onClick={() => exportToJSON(score, totalQuestions, percentage)}
            className="w-full bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
          >
            📄 Export as JSON
          </button> */}

          {/* <button
            onClick={() => exportToCSV(score, totalQuestions, percentage)}
            className="w-full bg-green-200 hover:bg-green-300 text-green-900 font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
          >
            📊 Export as CSV
          </button> */}

          {/* Social Sharing Component */}
          <ShareResults
            score={score}
            totalQuestions={totalQuestions}
            percentage={percentage}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
