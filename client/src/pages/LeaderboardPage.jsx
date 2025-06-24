import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justEnteredTopThree, setJustEnteredTopThree] = useState(false);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        return res.json();
      })
      .then(data => {
        setLeaders(data);
        setLoading(false);

        const username = localStorage.getItem('username');
        const topThreeNames = data.slice(0, 3).map(u => u.username);
        if (username && topThreeNames.includes(username)) {
          setJustEnteredTopThree(true);
        }
      })
      .catch(err => {
        console.error('Leaderboard error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getBadge = (index) => {
    const badges = ['🥇', '🥈', '🥉'];
    return badges[index] || `#${index + 1}`;
  };

  const getAvatar = (username) =>
    `https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`;

  const topThree = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      {justEnteredTopThree && <Confetti />}
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

      {loading && <p className="text-muted">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* Ladder animation for top 3 */}
          <div className="flex justify-center items-end gap-6 mb-12">
            {topThree.map((u, i) => (
              <motion.div
                key={i}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className={`flex flex-col items-center justify-end bg-card shadow-md rounded-lg p-4 w-24 h-${28 - i * 2}`}
              >
                <img src={getAvatar(u.username)} alt={u.username} className="w-10 h-10 rounded-full shadow mb-1" />
                <div className="text-2xl">{getBadge(i)}</div>
                <div className="font-semibold mt-1 text-sm">{u.username}</div>
                <div className="text-xs text-muted">{u.points} pts</div>
              </motion.div>
            ))}
          </div>

          {/* Share Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('📤 Link copied to clipboard!');
            }}
            className="text-sm text-blue-600 underline mb-6"
          >
            Share this leaderboard
          </button>

          {/* Remaining leaderboard */}
          <ol className="space-y-4 text-left">
            {rest.length === 0 ? (
              <p className="text-muted">No leaderboard data yet.</p>
            ) : (
              rest.map((u, i) => (
                <li key={i + 3} className="flex justify-between items-center p-2 border-b">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">#{i + 4}</span>
                    <img src={getAvatar(u.username)} alt={u.username} className="w-6 h-6 rounded-full" />
                    <span>{u.username}</span>
                  </span>
                  <span className="font-bold text-primary">{u.points} pts</span>
                </li>
              ))
            )}
          </ol>
        </>
      )}
    </div>
  );
}
