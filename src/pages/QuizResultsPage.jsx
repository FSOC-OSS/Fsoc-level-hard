import React from "react";
import { useParams, Link } from "react-router-dom";
import QuizResults from "../components/QuizResults";
import QuizSessionManager from "../utils/QuizSessionManager";

const QuizResultsPage = () => {
  const { sessionId } = useParams();
  const sess = QuizSessionManager.getSession(sessionId);

  if (!sess?.results) {
    return (
      <div className="min-h-screen theme-screen flex items-center justify-center p-6">
        <div className="app-card rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">This session has no recorded results. It may not be finished yet.</p>
          <Link to={`/quiz/active/${sessionId}/q/${sess?.currentQuestion || 1}`} className="bg-purple-600 text-white px-4 py-2 rounded-md">Back to Quiz</Link>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, questions, userAnswers, quizData } = sess.results;

  return (
    <QuizResults
      score={score}
      totalQuestions={totalQuestions}
      onRestart={() => {}}
      onBackToSetup={() => {}}
      quizData={quizData || {}}
      questions={questions || []}
      userAnswers={userAnswers || []}
    />
  );
};

export default QuizResultsPage;
