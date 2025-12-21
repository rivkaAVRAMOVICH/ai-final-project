import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import TrueFalseQuizPage from "./pages/TrueFalseQuizPage"; 
import ResultPage from "./pages/ResultPage";
import RolePlayPage from "./pages/RolePlayPage"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-true-false" element={<TrueFalseQuizPage />} />
        <Route path="/role-play" element={<RolePlayPage />} /> 
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}