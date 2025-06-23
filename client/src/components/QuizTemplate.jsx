import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimerBar from './TimerBar';
import { useAuth } from '../context/AuthContext';

export default function QuizTemplate({ title, questions, genreKey }) {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(60);
  const current = questions[index];

  const { fetchWithAutoRefresh, refreshUser } = useAuth();

  // Timer logic
  useEffect(() => {
    if (showResult || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit(); // Auto-submit on timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showResult]);

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === current.answer.toLowerCase();
    if (correct) {
      setScore((prev) => prev + 1);
    }

    const hasNext = index + 1 < questions.length;
    if (hasNext) {
      setIndex((prev) => prev + 1);
      setUserAnswer('');
      setTimer(60);
    } else {
      setShowResult(true);
    }
  };

  // Called once after quiz completes

const handleQuizComplete = async () => {
  try {
    // 🏆 Update points
    const res = await fetchWithAutoRefresh('/update-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: score * 5 }),
    });

    const resData = await res.json();
    console.log("✅ Points updated:", res.status, resData);

    // 🧠 Save quiz history
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

    // 🔄 Update user state (points in UI)
    await refreshUser();

  } catch (err) {
    console.error('❌ Quiz finalization error:', err);
  }
};


  // Trigger quiz complete
  useEffect(() => {
    if (showResult) handleQuizComplete();
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
                <p className="mt-4 text-muted">Score: {score}</p>
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
                You scored {score} out of {questions.length}
              </p>
              <p className="text-muted mt-2">
                +{score * 5} points added to your account!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
