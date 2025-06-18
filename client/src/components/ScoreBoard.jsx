export default function ScoreBoard({ correct, wrong }) {
  return (
    <div className="text-sm text-gray-600 mt-4 text-center">
      ✅ Correct: {correct} | ❌ Wrong: {wrong}
    </div>
  );
}
