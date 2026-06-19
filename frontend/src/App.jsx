import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FlashcardsPage from "./pages/FlashcardsPage";
import LoginPage from "./pages/LoginPage";
import MockExamPage from "./pages/MockExamPage";
import QuizResultsPage from "./pages/QuizResultsPage";
import QuizSessionPage from "./pages/QuizSessionPage";
import ReviewPage from "./pages/ReviewPage";
import SignupPage from "./pages/SignupPage";
import TopicDetailPage from "./pages/TopicDetailPage";
import TopicsPage from "./pages/TopicsPage";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import useAuthStore from "./store/authStore";

const App = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/app" element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="topics/:id" element={<TopicDetailPage />} />
        <Route path="topics/:id/flashcards" element={<FlashcardsPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="mock" element={<MockExamPage />} />
        <Route path="quiz/:id" element={<QuizSessionPage />} />
        <Route path="quiz/:id/results" element={<QuizResultsPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="upload" element={<Navigate to="/app/topics" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
};

export default App;
