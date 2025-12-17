import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeText } from "../services/studyApi";
import Button from "../components/Button";
import Textarea from "../components/Textarea";
import Card from "../components/Card";
import Loader from "../components/Loader";

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    const quizData = await analyzeText(text);
    setLoading(false);
    navigate("/quiz", { state: { quizData } });
  };

  return (
    <Card>
      <h1>Study Assistant</h1>
      <Textarea value={text} onChange={setText} />
      {loading ? <Loader /> : <Button onClick={handleSubmit}>Generate Quiz</Button>}
    </Card>
  );
}
