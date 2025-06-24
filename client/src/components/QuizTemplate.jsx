import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimerBar from './TimerBar';
import { useAuth } from '../context/AuthContext';
import ScoreBoard from './ScoreBoard';

export default function QuizTemplate({ title, questions, genreKey }) {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(60);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [wrong, setWrong] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState([]);

  const current = questions[index];
  const { fetchWithAutoRefresh, fetchUser } = useAuth();

  useEffect(() => {
    if (showResult || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, showResult]);

  const normalize = (str) =>
    str.trim().toLowerCase().replace(/[^a-z0-9]/gi, '');

  const handleSubmit = () => {
    const correct = normalize(userAnswer) === normalize(current.answer);

    setAnswers((prev) => [
      ...prev,
      { question: current.question, correctAnswer: current.answer, userAnswer }
    ]);

    if (correct) {
      const earned = 50; // base points
      const streakBonus = earned * multiplier;
      setScore((prev) => prev + streakBonus);

      const newStreak = streak + 1;
      setStreak(newStreak);
      setMultiplier(1 + Math.floor(newStreak / 3));
    } else {
      setWrong((prev) => prev + 1);
      setStreak(0);
      setMultiplier(1);
    }

    const hasNext = index + 1 < questions.length;
    if (hasNext) {
      setIndex((prev) => prev + 1);
      setUserAnswer('');
      setTimer(60);
      setShowHint(false);
    } else {
      setShowResult(true);
    }
  };

  useEffect(() => {
    if (!showResult) return;
    const handleQuizComplete = async () => {
      try {
        await fetchWithAutoRefresh('/update-points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ points: score }),
        });

        await fetchWithAutoRefresh('/add-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            genre: genreKey,
            score,
            total: questions.length,
            date: new Date().toISOString(),
          }),
        });

        await fetchUser();
      } catch (err) {
        console.error('❌ Quiz finalization error:', err);
      }
    };
    handleQuizComplete();
  }, [showResult]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      <TimerBar time={timer} max={60} />
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-6">{title}</h1>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-card p-6 rounded-lg shadow relative flex gap-6 justify-between items-center"
            >
              <div className="flex-1">
                <div className="text-5xl mb-4">{current.question}</div>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Your answer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-foreground"
                />

                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="mt-2 text-xs text-blue-500 underline"
                >
                  Show Hint
                </button>

                {showHint && (
                  <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 italic">
                    Hint: {current.hint}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
                  className={`mt-4 px-6 py-2 rounded-md text-white ${
                    userAnswer.trim()
                      ? 'bg-primary hover:bg-primary-dark'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit
                </button>
                <ScoreBoard correct={score} wrong={wrong} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="bg-card p-6 rounded-lg shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">🎉 Quiz Complete!</h2>
              <p className="text-lg mb-2">
                You scored {score} points from {questions.length} questions
              </p>
              <p className="text-muted mt-2">
                Your points include multiplier bonuses for consecutive correct answers.
              </p>

              <div className="mt-6 text-left max-w-xl mx-auto">
                <h3 className="text-xl font-semibold mb-2">📘 Review Answers</h3>
                <ul className="space-y-3 text-sm">
                  {answers.map((entry, i) => (
                    <li key={i} className="p-3 border rounded-md bg-muted">
                      <div className="text-2xl mb-1">{entry.question}</div>
                      <p>
                        Your Answer:{' '}
                        <span
                          className={
                            normalize(entry.userAnswer) === normalize(entry.correctAnswer)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {entry.userAnswer || <em>Skipped</em>}
                        </span>
                      </p>
                      <p className="text-gray-700">Correct Answer: {entry.correctAnswer}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
