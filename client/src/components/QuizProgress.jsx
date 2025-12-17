export default function QuizProgress({ current, total }) {
  return (
    <p className="progress">
      Question {current} of {total}
    </p>
  );
}
