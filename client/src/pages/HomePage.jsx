import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { analyzeQuiz, startRolePlay } from "../services/studyApi";

export default function HomePage() {
  // מצב הטקסט נשמר ב-localStorage
  const [text, setText] = useState(() => localStorage.getItem("studyText") || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // שמירה ועדכון של הטקסט ב-localStorage
  const handleChange = (newText) => {
    setText(newText);
    localStorage.setItem("studyText", newText);
  };

  // פונקציה שמייצרת את המבחן בהתאם לסוג
  const handleQuizClick = async (quizType) => {
    if (!text.trim()) return;

    setLoading(true);
    const data = await analyzeQuiz(text, quizType);

    if (quizType === "multiple-choice") {
      navigate("/quiz", { state: { quizData: data } });
    } else if (quizType === "true-false") {
      navigate("/quiz-true-false", { state: { quizData: data } });
    }

    setLoading(false);
  };

  const handlePlayClick = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      // התחלת משחק תפקידים
      const session = await startRolePlay(text);
      navigate("/role-play", { state: { session } });
    } catch (err) {
      console.error("Failed to start role play:", err);
    } finally {
      setLoading(false);
    }
  };

  // ניקוי הטקסט
  const handleClearText = () => {
    setText("");
    localStorage.removeItem("studyText");
  };

  return (
    <Card>
      <h1>Study Assistant</h1>

      {text ? (
        <div
          style={{
            position: "relative",
            padding: "12px",
            backgroundColor: "#f5f5f5",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          {text}
          <button
            onClick={handleClearText}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              cursor: "pointer",
              border: "none",
              background: "transparent",
              fontSize: "16px",
            }}
          >
            ❌
          </button>
        </div>
      ) : (
        <Textarea value={text} onChange={handleChange} />
      )}

      <div style={{ marginTop: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Button onClick={() => handleQuizClick("multiple-choice")} disabled={!text}>
          Multiple Choice
        </Button>
        <Button onClick={() => handleQuizClick("true-false")} disabled={!text}>
          True / False
        </Button>
        <Button
          onClick={handlePlayClick}
          disabled={!text}
        >
          Role Play Game
        </Button>

      </div>

      {loading && <Loader />}
    </Card>
  );
}
