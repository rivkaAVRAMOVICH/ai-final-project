import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

export default function TrueFalseQuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state?.quizData;

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizData) {
    return (
      <Card>
        <h2>No quiz data found.</h2>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </Card>
    );
  }

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    quizData.quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) calculatedScore++;
    });
    setScore(calculatedScore);
    setSubmitted(true);
  };

  return (
    <Card>
      <h1>True / False Quiz</h1>

      {quizData.quiz.questions.map((q) => {
        let bgColor = "";
        if (submitted) {
          bgColor = answers[q.id] === q.correct_answer ? "#d4edda" : "#f8d7da";
        }

        return (
          <div
            key={q.id}
            style={{
              backgroundColor: bgColor,
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
              transition: "background-color 0.3s",
            }}
          >
            <h3>{q.statement}</h3>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {[
                { label: "✔️", value: true },
                { label: "❌", value: false },
              ].map((btn) => {
                const isSelected = answers[q.id] === btn.value;

                return (
                  <button
                    key={btn.label}
                    onClick={() => handleSelect(q.id, btn.value)}
                    disabled={submitted}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: isSelected ? "2px solid #0d6efd" : "1px solid #ccc",
                      backgroundColor: "#fff",
                      color: "#000",
                      cursor: "pointer",
                      fontSize: "20px",
                      transition: "all 0.2s",
                      minWidth: "60px",
                    }}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted ? (
        <Button onClick={handleSubmit} style={{ marginTop: "16px" }}>
          Submit Quiz
        </Button>
      ) : (
        <div style={{ marginTop: "16px" }}>
          <h2>
            🏅 Your Score: {score} / {quizData.quiz.questions.length} 
          </h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      )}
    </Card>
  );
}
