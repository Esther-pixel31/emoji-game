import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import badgeList from '../data/achievements';

export default function AchievementsPage() {
  const { fetchWithAutoRefresh } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [justUnlocked, setJustUnlocked] = useState([]);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const res = await fetchWithAutoRefresh('/profile');
        if (!res.ok) throw new Error('Failed to fetch profile achievements');

        const data = await res.json();
        const unlocked = data.achievements.map((a) => a.title);
        setUnlockedIds(unlocked);

        const previouslyUnlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
        const newlyUnlocked = unlocked.filter((t) => !previouslyUnlocked.includes(t));
        setJustUnlocked(newlyUnlocked);
        localStorage.setItem('achievements', JSON.stringify(unlocked));

        if (newlyUnlocked.length > 0) {
          newlyUnlocked.forEach((badge) => toast.success(`🏆 New achievement: ${badge}`));
        }

        setAchievements(badgeList);
      } catch (err) {
        console.error('Achievement load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAchievements();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Achievements</h1>
      {loading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {achievements.map((a, idx) => {
            const unlocked = unlockedIds.includes(a.title);
            const highlight = justUnlocked.includes(a.title);
            return (
              <motion.div
                key={idx}
                className={`p-4 rounded-xl border shadow-md transition-all ${
                  unlocked
                    ? `bg-white dark:bg-gray-800 border-green-500 ${highlight ? 'ring-2 ring-yellow-400' : ''}`
                    : 'bg-gray-100 dark:bg-gray-900 text-muted border-gray-300 dark:border-gray-700 opacity-50'
                }`}
                initial={{ opacity: 0, y: 10, scale: highlight ? 1.1 : 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
              >
                <div className="text-xl font-semibold mb-1">
                  {unlocked ? '🏆 ' : '🔒 '}
                  {a.title}
                </div>
                <p className="text-sm">{a.description}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
