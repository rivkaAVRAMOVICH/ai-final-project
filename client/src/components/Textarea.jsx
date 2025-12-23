import "../styles/homePage.css";
export default function Textarea({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="my-textarea"
      placeholder="Enter your text here..."
    />
  );
}
