export default function QuizCard({
  quiz,
  answer,
  setAnswer,
  feedback,
  onSubmit,
  onNext,
}) {
  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">🧠 Guess the Phrase</h2>
        <p className="text-5xl mb-8">{quiz.emojis}</p>  {/* Increase mb-6 → mb-8 */}
      </div>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full border rounded-md px-4 py-3 text-lg mb-4"
        placeholder="Type your answer..."
      />

      <div className="space-y-3">
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Submit
        </button>

        {feedback && (
          <p
            className={`text-lg font-semibold ${
              feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {feedback}
          </p>
        )}

        <button
          onClick={onNext}
          className="text-sm text-primary underline"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
