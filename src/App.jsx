import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import QuizApp from "./components/QuizApp";
import BookmarkedQuestions from "./components/BookmarkedQuestions";
import BadgesPage from "./components/BadgesPage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import PrivacySettings from "./components/PrivacySettings";
import CookiePolicy from "./components/CookiePolicy";
import ConsentProvider from "./context/ConsentContext";
import FooterPrivacy from "./components/FooterPrivacy";
import NavBar from "./components/NavBar";
import NotFoundPage from "./pages/NotFoundPage";
import FAQPage from "./components/FAQPage";
import Onboarding from './components/Onboarding'
import OnboardingManager from './utils/OnboardingManager'

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

function App() {
    return (
        <Router>
            <ConsentProvider>
                <NavBar />
                {/* Show onboarding if not completed */}
                {!OnboardingManager.isCompleted() && <Onboarding initialOpen={true} />}
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route
                        path="/settings/privacy"
                        element={<PrivacySettings />}
                    />
                    <Route path="/privacy/cookies" element={<CookiePolicy />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <QuizApp />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bookmarks"
                        element={
                            <ProtectedRoute>
                                <BookmarkedQuestions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/badges"
                        element={
                            <ProtectedRoute>
                                <BadgesPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <FooterPrivacy />
            </ConsentProvider>
        </Router>
    );
}

export default App;
