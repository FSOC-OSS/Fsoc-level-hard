import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimationProvider } from "./context/AnimationContext";
import AnimationSettings from "./components/AnimationSettings";
import QuizApp from "./components/QuizApp";
import BookmarkedQuestions from "./components/BookmarkedQuestions";
import BadgesPage from "./components/BadgesPage";
import "./assets/animations.css";

function App() {
    return (
        <AnimationProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<QuizApp />} />
                    <Route path="/bookmarks" element={<BookmarkedQuestions />} />
                    <Route path="/badges" element={<BadgesPage />} />
                </Routes>
            </Router>
            
            {/* Floating Animation Settings Button */}
            <AnimationSettings />
        </AnimationProvider>
    );
}

export default App;