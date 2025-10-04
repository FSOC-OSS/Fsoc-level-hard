import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizApp from "./components/QuizApp";
import BookmarkedQuestions from "./components/BookmarkedQuestions";
import BadgesPage from "./components/BadgesPage";



import PrivacySettings from "./components/PrivacySettings";
import CookiePolicy from "./components/CookiePolicy";
import ConsentProvider from "./context/ConsentContext";
import FooterPrivacy from "./components/FooterPrivacy";
import FAQPage from "./components/FAQPage";


function App() {
    return (
        <Router>

            <ConsentProvider>
                <Routes>
                    <Route path="/" element={<QuizApp />} />
                    <Route path="/bookmarks" element={<BookmarkedQuestions />} />
                    <Route path="/badges" element={<BadgesPage />} />
                     <Route path="/faq" element={<FAQPage />} />
                     <Route path="/settings/privacy" element={<PrivacySettings />} />
                    <Route path="/privacy/cookies" element={<CookiePolicy />} />
                </Routes>
                <FooterPrivacy />
            </ConsentProvider>

        </Router>
    );
}

export default App;
