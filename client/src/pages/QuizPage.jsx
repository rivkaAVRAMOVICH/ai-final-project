import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

export default function QuizPage() {
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

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;

    quizData.quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
  };

  return (
    <Card>
      <h1>Quiz</h1>

      {quizData.quiz.questions.map((q) => {
        // צבע רקע לכל שאלה אם הוגש המבחן
        let backgroundColor = "";
        if (submitted) {
          backgroundColor =
            answers[q.id] === q.correct_answer ? "#d4edda" : "#f8d7da"; // ירוק בהיר או אדום בהיר
        }

        return (
          <div
            key={q.id}
            className="question-card"
            style={{ padding: "12px", borderRadius: "6px", marginBottom: "16px", backgroundColor }}
          >
            <h3>{q.question}</h3>

            {q.options.map((option, idx) => {
              let color = "";
              if (submitted) {
                if (option === q.correct_answer) color = "green";
                else if (answers[q.id] === option) color = "red";
              }

              return (
                <label
                  key={idx}
                  style={{ display: "block", marginBottom: "8px", color }}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: option }))
                    }
                    disabled={submitted}
                  />{" "}
                  {option}
                </label>
              );
            })}
          </div>
        );
      })}

      {!submitted ? (
        <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
      ) : (
        <div>
          <h2>
            Your Score: {score} / {quizData.quiz.questions.length} 🏅
          </h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      )}
    </Card>
  );
}
