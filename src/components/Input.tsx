import "./Input.css";

export const QuestionInput: React.FC<{
  value: string;
  correct: "normal" | "correct" | "wrong";
  onChange: (value: string) => void;
  blocked?: boolean;
}> = ({ value, correct, onChange, blocked }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`question-input ${
        correct === "correct" ? "correct" : correct === "wrong" ? "wrong" : ""
      }`}
      disabled={blocked}
    />
  );
};
