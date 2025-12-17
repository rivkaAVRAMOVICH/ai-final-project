import { useLocation } from "react-router-dom";

export default function ResultPage() {
  const { state } = useLocation();

  return (
    <div>
      <h2>Your Results</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
