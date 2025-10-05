import React from "react";
import { useNavigate } from "react-router-dom";
import QuizSetupPage from "../components/QuizSetupPage";
import QuizSessionManager from "../utils/QuizSessionManager";
import ConsentManager from "../utils/ConsentManager";

const QuizSetupWrapper = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Read preferences saved by QuizSetupPage
    let prefs = null;
    try {
      const raw =
        (ConsentManager && ConsentManager.getItem && ConsentManager.getItem("quizPreferences")) ||
        localStorage.getItem("quizPreferences");
      prefs = raw ? JSON.parse(raw) : null;
    } catch {
      prefs = null;
    }

    const sessionId = QuizSessionManager.createSession(prefs || {});

    const params = new URLSearchParams();
    if (prefs?.category?.id) params.set("categoryId", String(prefs.category.id));
    if (prefs?.category?.name) params.set("category", prefs.category.name);
    if (prefs?.difficulty) params.set("difficulty", String(prefs.difficulty));
    if (prefs?.numQuestions) params.set("num", String(prefs.numQuestions));
    if (prefs?.questionType) params.set("type", String(prefs.questionType));

    navigate(`/quiz/active/${sessionId}/q/1?${params.toString()}`);
  };

  return <QuizSetupPage onStart={handleStart} />;
};

export default QuizSetupWrapper;
