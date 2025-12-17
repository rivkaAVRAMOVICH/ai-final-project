export default function QuizResult({ result }) {
  return (
    <Card>
      <h2>Your Score: {result.score}%</h2>

      {result.details.map((d) => (
        <p key={d.id} className={d.correct ? "correct" : "wrong"}>
          {d.correct ? "✅" : "❌"} {d.question}
        </p>
      ))}
    </Card>
  );
}
