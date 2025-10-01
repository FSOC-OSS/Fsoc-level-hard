import { useEffect } from 'react';

const PauseOverlay = ({
  onResume,
  onQuit,
  timeRemaining,
  formatTime,
  currentQuestion,
  totalQuestions
}) => {
  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        onResume();
      } else if (event.code === 'Escape') {
        event.preventDefault();
        onQuit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onResume, onQuit]);

  const motivationalMessages = [
    "Take a deep breath! You're doing great! 🌟",
    "Every expert was once a beginner. Keep going! 💪",
    "Your mind needs rest to perform at its best! 🧠",
    "Take your time. Quality thinking leads to quality answers! ⭐",
    "A short break can lead to great breakthroughs! 🚀",
    "You've got this! Resume when you're ready! 🎯",
    "Knowledge grows with patience. Take your time! 📚",
    "Even the best athletes take timeouts! 🏆"
  ];

  const randomMessage = motivationalMessages[
    Math.floor(Math.random() * motivationalMessages.length)
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center transform animate-scale-up">
        {/* Pause Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <div className="flex gap-2">
              <div className="w-3 h-10 bg-white rounded"></div>
              <div className="w-3 h-10 bg-white rounded"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Paused</h2>

        {/* Motivational Message */}
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {randomMessage}
        </p>

        {/* Quiz Progress Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {currentQuestion + 1}/{totalQuestions}
              </div>
              <div className="text-sm text-gray-500">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-500">Time Left</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">▶️</span>
              <span>Resume Quiz</span>
            </div>
          </button>

          <button
            onClick={onQuit}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Quit Quiz
          </button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-6 text-sm text-gray-500">
          <p>Keyboard shortcuts:</p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              <kbd className="font-bold">SPACE</kbd> Resume
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              <kbd className="font-bold">ESC</kbd> Quit
            </span>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 text-xs text-gray-400 border-t pt-4">
          🔒 Your progress is securely saved locally
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PauseOverlay;
