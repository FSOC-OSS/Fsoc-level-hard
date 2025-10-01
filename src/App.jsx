import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import QuizApp from './components/QuizApp';
import QuizReview from './components/QuizReview';

// Wrapper to pass state to QuizReview
const QuizReviewWrapper = () => {
  const { state } = useLocation();
  if (!state) return <div className="min-h-screen flex items-center justify-center text-gray-700">No quiz data to review.</div>;
  return <QuizReview questions={state.questions} selectedAnswers={state.selectedAnswers} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizApp />} />
        <Route path="/review" element={<QuizReviewWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;

