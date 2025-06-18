export default function QuizCard({
  quiz,
  answer,
  setAnswer,
  feedback,
  onSubmit,
  onNext,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      <h2 className="text-xl font-semibold mb-2">🧠 Guess the Phrase</h2>
      <p className="text-5xl mb-6">{quiz.emojis}</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full border rounded-md px-4 py-2 text-lg mb-4"
        placeholder="Type your answer..."
      />
      <button
        onClick={onSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition mb-2"
      >
        Submit
      </button>
      {feedback && (
        <p
          className={`text-lg font-semibold mt-2 ${
            feedback.includes("Correct") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
      <button
        onClick={onNext}
        className="mt-4 text-sm text-blue-500 underline"
      >
        Next →
      </button>
    </div>
  );
}

