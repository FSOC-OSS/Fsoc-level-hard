import React, { useMemo } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import QuizApp from "../components/QuizApp";
import QuizSessionManager from "../utils/QuizSessionManager";
import useNavigationBlocker from "../hooks/useNavigationBlocker";
import ConfirmLeaveModal from "../components/ConfirmLeaveModal";

const QuizActivePage = () => {
  const navigate = useNavigate();
  const { sessionId, questionNumber } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const initialPreferences = useMemo(() => ({
    categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    categoryName: searchParams.get("category") || undefined,
    difficulty: searchParams.get("difficulty") || undefined,
    numQuestions: searchParams.get("num") ? Number(searchParams.get("num")) : undefined,
    type: searchParams.get("type") || undefined,
  }), [searchParams]);

  // Block navigation while on active quiz page
  const { isBlocked, confirm, cancel } = useNavigationBlocker(true);

  const handleQuestionChange = (nextNumber) => {
    const paramsString = searchParams.toString();
    navigate(`/quiz/active/${sessionId}/q/${nextNumber}${paramsString ? `?${paramsString}` : ""}`, { replace: true });
    QuizSessionManager.setCurrentQuestion(sessionId, nextNumber);
  };

  const handleComplete = ({ score, totalQuestions, questions, userAnswers, quizData }) => {
    QuizSessionManager.saveResults(sessionId, {
      score,
      totalQuestions,
      questions,
      userAnswers,
      quizData,
    });
    navigate(`/quiz/results/${sessionId}`);
  };

  return (
    <>
      <QuizApp
        startImmediately
        sessionId={sessionId}
        initialPreferences={initialPreferences}
        currentQuestionNumber={Number(questionNumber) || 1}
        onQuestionChange={handleQuestionChange}
        onComplete={handleComplete}
      />
      <ConfirmLeaveModal open={isBlocked} onConfirm={confirm} onCancel={cancel} />
    </>
  );
};

export default QuizActivePage;
