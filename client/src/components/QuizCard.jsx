export default function QuizCard({
  quiz,
  answer,
  setAnswer,
  feedback,
  onSubmit,
  onNext,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && answer.trim()) onSubmit();
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">🧠 Guess the Phrase</h2>
        <p className="text-5xl mb-8">{quiz.emojis}</p> 
      </div>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Your answer"
        className="w-full border rounded-md px-4 py-3 text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Type your answer..."
      />

      <div className="space-y-3">
        <button
          onClick={onSubmit}
          disabled={!answer.trim()}
          aria-label="Submit answer"
          className={`bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 active:scale-95 transition ${
            !answer.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Submit
        </button>

        {feedback && (
          <p
            className={`mt-2 text-lg font-semibold ${
              feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {feedback}
          </p>
        )}

        <button
          onClick={onNext}
          aria-label="Next question"
          className="text-sm text-primary underline hover:text-primary/80"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
