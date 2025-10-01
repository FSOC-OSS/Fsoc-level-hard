import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../App";

const QuizReview = () => {
  const navigate = useNavigate();
  const { questions, userAnswers } = useQuiz();
  const [current, setCurrent] = useState(0);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700 animate-pulse">
          Loading review mode...
        </p>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      
      {/* Header with Progress & Back */}
      <div className="mb-4 w-full max-w-2xl flex justify-between items-center">
        <div className="flex gap-2">
          {questions.map((_, idx) => {
            const answered = userAnswers[idx] === questions[idx].correctAnswer;
            return (
              <div
                key={idx}
                tabIndex={0}
                onClick={() => setCurrent(idx)}
                onKeyPress={(e) => e.key === "Enter" && setCurrent(idx)}
                className={`w-6 h-6 rounded-full cursor-pointer border ${
                  answered ? "bg-green-500 border-green-600" : "bg-red-500 border-red-600"
                }`}
                title={`Question ${idx + 1} - ${answered ? "Correct" : "Incorrect"}`}
              />
            );
          })}
        </div>

        <button
          onClick={() => navigate("/results")}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Back to Results
        </button>
      </div>

      {/* Question Box */}
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">
          Question {current + 1} of {questions.length}
        </h2>
        <p className="text-lg font-medium mb-6">{q.question}</p>

        {/* Answers with Visual Distinction */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctAnswer;
            const isUser = i === userAnswers[current];

            let classes = "p-3 rounded-lg border text-left ";
            if (isCorrect) classes += "bg-green-100 border-green-500 text-green-800";
            else if (isUser && !isCorrect) classes += "bg-red-100 border-red-500 text-red-800";
            else classes += "bg-gray-50 border-gray-300 text-gray-700";

            return (
              <div key={i} className={classes}>
                {opt} {isCorrect ? "✓" : isUser ? "✗" : ""}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={current === questions.length - 1}
            onClick={() => setCurrent(current + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuizReview;
