import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizApp from "./components/QuizApp";
import BookmarkedQuestions from "./components/BookmarkedQuestions";
import AchievementsPage from "./components/AchievementsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QuizApp />} />
                <Route path="/bookmarks" element={<BookmarkedQuestions />} />
                <Route path="/achievements" element={<AchievementsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
