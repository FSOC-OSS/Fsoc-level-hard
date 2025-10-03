import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizApp from "./components/QuizApp";
import BookmarkedQuestions from "./components/BookmarkedQuestions";
import BadgesPage from "./components/BadgesPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QuizApp />} />
                <Route path="/bookmarks" element={<BookmarkedQuestions />} />
                <Route path="/badges" element={<BadgesPage />} />
            </Routes>
        </Router>
    );
}

export default App;
