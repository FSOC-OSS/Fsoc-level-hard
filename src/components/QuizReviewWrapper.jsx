import React from 'react';
import QuizReview from './QuizReview';

const QuizReviewWrapper = ({ questions, userAnswers, onBack }) => {
  const formattedQuestions = questions.map(q => ({
    question: q.question,
    options: q.incorrect_answers
      ? [q.correct_answer, ...q.incorrect_answers].sort()
      : q.options,
    correctAnswer: q.correct_answer,
  }));
  
  return <QuizReview questions={formattedQuestions} userAnswers={userAnswers} onBack={onBack} />;
};

export default QuizReviewWrapper;
