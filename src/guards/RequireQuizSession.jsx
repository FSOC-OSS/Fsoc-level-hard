import React from "react";
import { Navigate, useParams } from "react-router-dom";
import QuizSessionManager from "../utils/QuizSessionManager";

const RequireQuizSession = ({ children }) => {
  const { sessionId } = useParams();
  if (!QuizSessionManager.hasValidSession(sessionId)) {
    return <Navigate to="/quiz/setup" replace />;
  }
  return children;
};

export default RequireQuizSession;
