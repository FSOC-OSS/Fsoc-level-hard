import { useState, useEffect } from "react";

const QuizQuestion = ({
    question,
    onAnswerSelect,
    selectedAnswer,
    isTimerEnabled,
}) => {
    const [clickedAnswer, setClickedAnswer] = useState(null);

    // Reset clickedAnswer when question changes
    useEffect(() => {
        setClickedAnswer(null);
    }, [question]);

    const handleAnswerClick = (answer) => {
        if (selectedAnswer) return; // Prevent multiple selections

        setClickedAnswer(answer);
        onAnswerSelect(answer);
    };

    const getButtonClass = (answer) => {
        const baseClass =
            "w-full p-4 text-left rounded-lg font-medium transition-all duration-300 transform ";

        if (!selectedAnswer && !clickedAnswer) {
            return (
                baseClass +
                "bg-white hover:bg-purple-50 hover:scale-105 hover:shadow-lg text-gray-800 border-2 border-transparent hover:border-purple-300"
            );
        }

        if (selectedAnswer || clickedAnswer) {
            if (answer === question.correct_answer) {
                return (
                    baseClass +
                    "bg-green-500 text-white border-2 border-green-600 scale-105 shadow-lg"
                );
            } else if (answer === (selectedAnswer || clickedAnswer)) {
                return (
                    baseClass +
                    "bg-red-500 text-white border-2 border-red-600 scale-105 shadow-lg"
                );
            } else {
                return (
                    baseClass +
                    "bg-gray-300 text-gray-600 border-2 border-gray-400"
                );
            }
        }

        return baseClass;
    };

    const getAnswerIcon = (answer) => {
        if (!selectedAnswer && !clickedAnswer) return null;

        if (answer === question.correct_answer) {
            return <span className="text-2xl">✓</span>;
        } else if (answer === (selectedAnswer || clickedAnswer)) {
            return <span className="text-2xl">✗</span>;
        }

        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto">
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
                    {isTimerEnabled && (
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            ⏱️ Timed
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {question.answers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick(answer)}
                        disabled={selectedAnswer || clickedAnswer}
                        className={getButtonClass(answer)}
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
                ))}
            </div>

            {(selectedAnswer || clickedAnswer) && (
                <div className="mt-6 p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                        {(selectedAnswer || clickedAnswer) ===
                        question.correct_answer ? (
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
                                    Incorrect. The correct answer is:{" "}
                                    {question.correct_answer}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

import React, { useState, useEffect } from 'react';

// Utility to shuffle an array (Fisher-Yates)
function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function QuizQuestion({ question, onAnswer }) {
  const DEFAULT_HINTS = 3;

  const [hintsRemaining, setHintsRemaining] = useState(DEFAULT_HINTS);
  const [eliminatedOptions, setEliminatedOptions] = useState(new Set());
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Load hints from localStorage on mount
  useEffect(() => {
    const savedHints = localStorage.getItem('quizHintsRemaining');
    if (savedHints !== null) {
      setHintsRemaining(Number(savedHints));
    }
  }, []);

  // Save hints to localStorage on change
  useEffect(() => {
    localStorage.setItem('quizHintsRemaining', hintsRemaining.toString());
  }, [hintsRemaining]);

  // Reset state on question change
  useEffect(() => {
    setEliminatedOptions(new Set());
    setHasAnswered(false);
    setSelectedIndex(null);
  }, [question]);

  const handleUseHint = () => {
    if (hintsRemaining === 0 || hasAnswered) return;

    // Collect indices of incorrect options not already eliminated
    const incorrectIndices = question.options
      .map((_, idx) => idx)
      .filter(idx => idx !== question.correctIndex && !eliminatedOptions.has(idx));

    // Number of options to eliminate depends on how many incorrect remain
    const numToEliminate = Math.min(2, incorrectIndices.length);

    if (numToEliminate === 0) return; // Nothing to eliminate

    const shuffled = shuffle(incorrectIndices);
    const toEliminate = new Set([...eliminatedOptions, ...shuffled.slice(0, numToEliminate)]);

    setEliminatedOptions(toEliminate);
    setHintsRemaining(prev => prev - 1);
  };

  const handleSelectAnswer = (idx) => {
    if (hasAnswered || eliminatedOptions.has(idx)) return;
    setSelectedIndex(idx);
    setHasAnswered(true);
    onAnswer(idx === question.correctIndex);
  };

  return (
    <div className="quiz-container">
      <h2 className="question-text">{question.text}</h2>
      <div className="options-container">
        {question.options.map((option, idx) => {
          const isEliminated = eliminatedOptions.has(idx);
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={idx}
              className={`option-btn 
                ${isEliminated ? 'option--eliminated' : ''} 
                ${isSelected ? (idx === question.correctIndex ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleSelectAnswer(idx)}
              disabled={isEliminated || hasAnswered}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="hint-container">
        <button
          className={`hint-button ${hintsRemaining === 0 || hasAnswered ? 'disabled' : ''}`}
          onClick={handleUseHint}
          disabled={hintsRemaining === 0 || hasAnswered}
          aria-label="Use 50/50 hint to eliminate two incorrect answers"
        >
          💡 {hintsRemaining}
          {(hintsRemaining !== 0 && !hasAnswered) && <span className="hint-glow" />}
        </button>
      </div>
    </div>
  );
}
