import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Question";
import Question from "../components/Question";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = location.state?.quizData;

  if (!quizData) {
    return (
      <Card>
        <h2>No quiz data found.</h2>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </Card>
    );
  }

  return (
    <Card>
      <h1>Quiz</h1>
     {quizData?.quiz?.questions?.length > 0 ? (
  quizData.quiz.questions.map((q) => (
    <Question key={q.id} question={q} />
  ))
) : (
  <p>No questions available.</p>
)}
      <Button onClick={() => navigate("/")}>Back to Home</Button>
    </Card>
  );
}
