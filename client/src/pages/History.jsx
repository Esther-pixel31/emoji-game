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

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Quiz History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
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
          className="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* History List */}
      {filteredHistory.length ? (
        <div className="space-y-4">
          {filteredHistory.map((game, idx) => (
            <div
              key={idx}
              className="p-4 border rounded shadow-sm bg-white dark:bg-gray-800"
            >
              <p className="text-sm text-muted-foreground">
                <strong>{game.genre}</strong> — {game.score}/{game.total}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(game.date).toLocaleString()}
              </p>
              <button
                onClick={() => navigate(`/quiz/${game.genre}`)}
                className="mt-2 text-sm text-blue-500 underline"
              >
                Replay this quiz
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No matching history found.</p>
      )}

      {/* Score Chart */}
      <div className="h-64 mt-8 bg-white dark:bg-gray-900 rounded p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">📈 Score Over Time</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
