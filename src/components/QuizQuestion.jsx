import { useEffect, useRef, useState } from "react";

const SHORTCUT_HINTS = [
  { key: "1-4", desc: "Select answer" },
  { key: "↑↓", desc: "Navigate answers" },
  { key: "⏎/Space", desc: "Submit/Next" },
  { key: "Esc", desc: "Show hints/help" },
];

const QuizQuestion = ({
  question,
  onAnswerSelect,
  selectedAnswer,
  onNext,
  isLast,
  // Removed unused props: questionIndex, totalQuestions
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showHint, setShowHint] = useState(false);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const buttonsRef = useRef([]);

  // Reset focus and keyboard state on question change
  useEffect(() => {
    setFocusedIndex(-1);
    setKeyboardActive(false);
    setShowHint(false);
  }, [question]);

  // Keyboard handler
  useEffect(() => {
    if (selectedAnswer) return; // Only allow before answer is selected
    const handler = (e) => {
      setKeyboardActive(true);

      // Number keys (1-4) for answer select
      if (e.key >= "1" && e.key <= String(question.answers.length)) {
        const idx = Number(e.key) - 1;
        setFocusedIndex(idx);
        onAnswerSelect(question.answers[idx]);
      }

      // Arrow navigation
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => {
          const next = prev < question.answers.length - 1 ? prev + 1 : 0;
          buttonsRef.current[next]?.focus();
          return next;
        });
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        setFocusedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : question.answers.length - 1;
          buttonsRef.current[next]?.focus();
          return next;
        });
        e.preventDefault();
      }

      // Enter/Space to select focused answer
      if ((e.key === "Enter" || e.key === " ") && focusedIndex >= 0) {
        onAnswerSelect(question.answers[focusedIndex]);
      }

      // Escape: show/hide help
      if (e.key === "Escape") {
        setShowHint((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [question, selectedAnswer, focusedIndex, onAnswerSelect]);

  // After answer selected, allow next via Space/Enter
  useEffect(() => {
    if (!selectedAnswer) return;
    const handler = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!isLast) onNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedAnswer, onNext, isLast]);

  const handleAnswerClick = (answer, idx) => {
    if (selectedAnswer) return;
    setFocusedIndex(idx);
    onAnswerSelect(answer);
  };

  const getButtonClass = (answer, idx) => {
    const baseClass =
      "w-full p-4 text-left rounded-lg font-medium transition-all duration-300 transform border-2 ";
    // Highlight if focused (keyboard navigation)
    let focusRing =
      focusedIndex === idx && !selectedAnswer ? "ring-4 ring-yellow-300 " : "";
    if (!selectedAnswer) {
      return (
        baseClass +
        focusRing +
        "bg-white hover:bg-purple-50 hover:scale-105 hover:shadow-lg text-gray-800 border-transparent hover:border-purple-300"
      );
    }

    if (answer === question.correct_answer) {
      return (
        baseClass +
        "bg-green-500 text-white border-green-600 scale-105 shadow-lg"
      );
    } else if (answer === selectedAnswer) {
      return (
        baseClass + "bg-red-500 text-white border-red-600 scale-105 shadow-lg"
      );
    } else {
      return baseClass + "bg-gray-300 text-gray-600 border-gray-400";
    }
  };

  const getAnswerIcon = (answer) => {
    if (!selectedAnswer) return null;
    if (answer === question.correct_answer) {
      return <span className="text-2xl">✓</span>;
    } else if (answer === selectedAnswer) {
      return <span className="text-2xl">✗</span>;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto relative">
      {/* Keyboard Mode Indicator */}
      {keyboardActive && (
        <div className="absolute top-0 right-0 mt-2 mr-2 bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold z-10">
          Keyboard Mode
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <span className="text-2xl">🤔</span>
          </div>
          <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
            {question.category}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
        <div className="flex items-center gap-2 mt-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {question.difficulty}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {question.type}
          </span>
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-4">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            ref={(el) => (buttonsRef.current[index] = el)}
            tabIndex={0}
            onClick={() => handleAnswerClick(answer, index)}
            disabled={!!selectedAnswer}
            className={getButtonClass(answer, index)}
            aria-label={`Select answer ${String.fromCharCode(
              65 + index
            )}: ${answer}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                  {/* Show numeric shortcut */}
                  <span className="mr-1 text-xs text-purple-400 font-bold">
                    [{index + 1}]
                  </span>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-lg">{answer}</span>
              </div>
              {getAnswerIcon(answer)}
            </div>
          </button>
        ))}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SHORTCUT_HINTS.map((hint) => (
          <span
            key={hint.key}
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium"
          >
            {hint.key}: {hint.desc}
          </span>
        ))}
      </div>
      {showHint && (
        <div className="mt-2 bg-yellow-50 border border-yellow-300 rounded p-2 text-yellow-900 text-sm">
          <b>Keyboard Shortcuts:</b> <br />
          1-4: Select answer &nbsp; | &nbsp; ↑/↓: Move focus &nbsp; | &nbsp;
          Enter/Space: Submit/Next &nbsp; | &nbsp; Esc: Toggle shortcut help
        </div>
      )}

      {/* Feedback */}
      {selectedAnswer && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            {selectedAnswer === question.correct_answer ? (
              <>
                <span className="text-2xl">🎉</span>
                <span className="text-green-600 font-semibold text-lg">
                  Correct!
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl">😔</span>
                <span className="text-red-600 font-semibold text-lg">
                  Incorrect. The correct answer is: {question.correct_answer}
                </span>
              </>
            )}
          </div>
          {!isLast && (
            <div className="mt-2 text-gray-500 text-sm">
              Press{" "}
              <span className="font-mono bg-gray-200 px-1 rounded">Enter</span>{" "}
              or{" "}
              <span className="font-mono bg-gray-200 px-1 rounded">Space</span>{" "}
              for next question
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
