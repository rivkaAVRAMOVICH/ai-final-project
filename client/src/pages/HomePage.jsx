import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { analyzeQuiz, startRolePlay } from "../services/studyApi";
import "../styles/homePage.css";

export default function HomePage() {
  const [text, setText] = useState(() => localStorage.getItem("studyText") || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");


  const handleChange = (newText) => {
    setText(newText);
    localStorage.setItem("studyText", newText);
    setError(""); 
  };


  const handleQuizClick = async (quizType) => {
    if (!text.trim()) {
      setError("Enter your text first");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await analyzeQuiz(text, quizType);

      if (quizType === "multiple-choice") {
        navigate("/quiz", { state: { quizData: data } });
      } else if (quizType === "true-false") {
        navigate("/quiz-true-false", { state: { quizData: data } });
      }
    } catch (err) {
      console.error("Error calling analyzeQuiz:", err);
      setError("Failed to analyze quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayClick = async () => {
    if (!text.trim()) {
      setError("Enter your text first");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const session = await startRolePlay(text);
      navigate("/role-play", { state: { session } });
    } catch (err) {
      console.error("Failed to start role play:", err);
      setError("Failed to start role play. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleClearText = () => {
    setText("");
    localStorage.removeItem("studyText");
  };

  return (
    <Card>
      <h1 className="home-title">Study Assistant</h1>
      <h3 className="home-subtitle">Learn smarter: create quizzes and practice role-play with your text</h3>

      {text ? (
        <div className="saved-text-box">
          <p>{text}</p>
          <button className="clear-text-btn" onClick={handleClearText}>
            ❌
          </button>
        </div>
      ) : (
        <Textarea value={text} onChange={handleChange} />
      )}

      <div className="home-actions">
        <Button onClick={() => handleQuizClick("multiple-choice")}>
          Multiple Choice
        </Button>
        <Button onClick={() => handleQuizClick("true-false")}>
          True / False
        </Button>
        <Button onClick={handlePlayClick}>
          Role Play Game
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : null}

    </Card>
  );
}
