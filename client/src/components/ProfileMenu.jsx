import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ProfileMenu() {
  const { user, login, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSubmit = async () => {
    const endpoint = tab === 'register' ? '/api/register' : '/api/login';
    const payload = {
      email: form.email.trim(),
      password: form.password,
      ...(tab === 'register' && { username: form.username.trim() }),
    };

    if (!payload.email || !payload.password || (tab === 'register' && !payload.username)) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <== VERY IMPORTANT
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to authenticate');

      // Let the AuthContext handle the state
      await login(); // Fetch user from /api/me and set context

      toast.success(tab === 'login' ? `Welcome back, ${data.user?.username || 'User'}!` : 'Account created 🎉');
      setForm({ email: '', password: '', username: '' });
      setShowModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      <div className="relative text-sm text-right">
      {user ? (
        <div className="relative group">
          <div className="flex items-center gap-2 cursor-pointer">
            <FaUserCircle className="text-xl text-primary" />
            <p className="font-semibold text-sm flex items-center gap-2">
              {user.username}
              <span className="text-xs text-muted">⭐ {user.points} pts</span>
            </p>
          </div>

          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg w-64 p-4 hidden group-hover:block z-10 text-left">
            <p className="font-semibold mb-2 text-sm text-gray-700 dark:text-gray-200">Account</p>

            <a
              href="/history"
              className="block text-sm text-primary hover:underline mb-3"
            >
              View Full History →
            </a>

            <p className="font-semibold mb-2 text-sm text-gray-700 dark:text-gray-200">Recent Games</p>
            {user.history?.length ? (
              <ul className="text-sm space-y-1">
                {user.history.slice(0, 3).map((game, idx) => (
                  <li key={idx} className="text-muted-foreground">
                    {game.genre} – {game.score}/{game.total} on{" "}
                    {new Date(game.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">No history yet.</p>
            )}

            <button
              onClick={() => {
                logout();
                toast("Logged out");
              }}
              className="mt-3 w-full px-3 py-1 text-xs bg-red-500 text-white rounded"
            >
              Logout
            </button>


          </div>
        </div>
      ) : (
        <FaUserCircle
          className="text-2xl cursor-pointer text-gray-600 dark:text-gray-300 hover:text-primary"
          onClick={() => setShowModal(true)}
        />
      )}
    </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full shadow-lg relative"
            >
              {/* Tabs */}
              <div className="flex justify-between mb-4 border-b">
                {['login', 'register'].map((t) => (
                  <button
                    key={t}
                    className={`w-1/2 py-2 font-semibold ${
                      tab === t ? 'border-b-2 border-primary text-primary' : 'text-muted'
                    }`}
                    onClick={() => {
                      setTab(t);
                      setForm({ email: '', password: '', username: '' });
                    }}
                  >
                    {t === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>

              {tab === 'register' && (
                <input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full mb-2 px-3 py-2 border rounded text-sm bg-background text-foreground"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full mb-2 px-3 py-2 border rounded text-sm bg-background text-foreground"
              />

              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border rounded text-sm pr-10 bg-background text-foreground"
                />
                <span
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-primary text-white py-2 rounded text-sm ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                }`}
              >
                {loading ? 'Submitting...' : tab === 'login' ? 'Login' : 'Register'}
              </button>

              <div className="text-xs text-center text-muted mt-3">
                <button
                  className="underline"
                  onClick={() => window.open('/login/google', '_self')}
                >
                  ..
                </button>
              </div>

              <button
                className="absolute top-2 right-3 text-xl text-gray-400 hover:text-red-500"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
