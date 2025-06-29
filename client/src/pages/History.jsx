import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import emojiPattern from '../assets/emoji-pattern.png';

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const genreRoutes = {
    moviecharacters: 'moviecharacters',
    movies: 'moviecharacters',
    'movie characters': 'moviecharacters',
    emotionquiz: 'emotionquiz',
    emotions: 'emotionquiz',
    'emotion quiz': 'emotionquiz',
    emotion: 'emotionquiz',
    marvel: 'marvelcharacters',
    'marvel heroes': 'marvelcharacters',
    marvelcharacters: 'marvelcharacters',
    songs: 'guessthesong',
    'guess the song': 'guessthesong',
    guessthesong: 'guessthesong',
  };

  if (!user || !user.history) {
    return <div className="p-6 text-center">Loading history...</div>;
  }

  const filteredHistory = user.history.filter((entry) => {
    const matchCategory = categoryFilter ? entry.genre === categoryFilter : true;
    const matchDate = dateFilter
      ? new Date(entry.date).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString()
      : true;
    return matchCategory && matchDate;
  });

  const chartData = [...user.history]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      score: entry.score,
    }));

  const handleReplay = (genre) => {
    const normalized = genre.toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = genreRoutes[normalized];

    if (path) {
      navigate(`/quiz/${path}`);
    } else {
      toast.error('Replay not available for this genre');
    }
  };

  return (
    <section
      className="relative px-4 sm:px-6 py-16 sm:py-20 min-h-screen"
      style={{
        backgroundImage: `url(${emojiPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px',
      }}
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm"></div>

      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto bg-white/90 dark:bg-black/80 rounded-3xl shadow-xl p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">📊 Quiz History</h1>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-6">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {[...new Set(user.history.map((h) => h.genre))].map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white w-full sm:w-auto"
          />
        </div>

        {filteredHistory.length ? (
          <AnimatePresence>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredHistory.map((game, idx) => (
                <motion.div
                  key={idx}
                  className="p-4 border rounded shadow-sm bg-white/80 dark:bg-gray-800/80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <p className="text-sm sm:text-base">
                    <strong>{game.genre}</strong> — {game.score}/{game.total}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {new Date(game.date).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleReplay(game.genre)}
                    className="mt-2 text-sm text-blue-500 underline"
                  >
                    Replay this quiz
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="text-sm text-gray-500 text-center italic">No matching history found.</p>
        )}

        <div className="h-64 sm:h-72 mt-8 bg-white/80 dark:bg-gray-900/80 rounded p-4 shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">📈 Score Over Time</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
