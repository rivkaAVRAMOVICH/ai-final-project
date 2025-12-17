export default function Question({ question }) {
  if (!question) return null; // אם אין אובייקט, לא מציגים כלום

  return (
    <div className="question-card">
      <h3>{question.question}</h3>
      <ul>
        {question.options.map((opt, idx) => (
          <li key={idx}>{opt}</li>
        ))}
      </ul>
    </div>
  );
}
