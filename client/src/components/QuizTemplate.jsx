import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimerBar from './TimerBar';

export default function QuizTemplate({ title, questions, genreKey }) {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(60);
  const [name, setName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  const current = questions[index];

  
  // Timer logic
  useEffect(() => {
    if (showResult) return;
    if (timer === 0) handleSubmit(); // Auto-submit on time out
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, showResult]);

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`leaderboard_${genreKey}`);
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  const handleSubmit = () => {
    if (userAnswer.trim().toLowerCase() === current.answer.toLowerCase()) {
      setScore(score + 1);
    }

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setUserAnswer('');
      setTimer(60); // reset for next question
    } else {
      setShowResult(true);
    }
  };

  const handleSaveScore = () => {
    if (!name.trim()) return;
    const newEntry = { name: name.trim(), score, total: questions.length };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setLeaderboard(updated);
    localStorage.setItem(`leaderboard_${genreKey}`, JSON.stringify(updated));
    setName('');
  };

  return (
    <>
    <TimerBar time={timer} max={60} />

    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      {/* Rest of your quiz UI */}
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
            {/* Question/Answer */}
            <div className="flex-1">
              <div className="text-5xl mb-4">{current.question}</div>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-foreground"
              />
              <button
                onClick={handleSubmit}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
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

            {/* Save name */}
            <div className="mt-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="px-4 py-2 border rounded-md mr-2"
              />
              <button
                onClick={handleSaveScore}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Save Score
              </button>
            </div>

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div className="mt-6 text-left">
                <h3 className="font-bold mb-2">🏆 Leaderboard</h3>
                <ul className="space-y-1 text-sm">
                  {leaderboard.map((entry, idx) => (
                    <li key={idx}>
                      {idx + 1}. {entry.name} — {entry.score}/{entry.total}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  </>
);
}  