import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL;

export default function ProfileMenu() {
  const { user, login, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState('login'); // 'login' or 'register'

  const handleSubmit = async () => {
    const endpoint = tab === 'register' ? '/register' : '/login';

    const payload = {
      email: form.email,
      password: form.password,
      ...(tab === 'register' && { username: form.username }),
    };

    if (!payload.email || !payload.password || (tab === 'register' && !payload.username)) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');

      login({ ...data.user, token: data.token });
      localStorage.setItem('auth_token', data.token);
      toast.success(tab === 'login' ? `Welcome back, ${data.user.username}!` : `Account created! 🎉`);

      setForm({ email: '', password: '', username: '' });
      setShowModal(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="relative text-sm text-right">
        {user ? (
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-xl text-primary" />
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs text-muted">⭐ {user.points} pts</p>
            </div>
            <button
              onClick={() => {
                logout();
                toast('Logged out');
              }}
              className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded"
            >
              Logout
            </button>
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
              {/* Toggle Tabs */}
              <div className="flex justify-between mb-4 border-b">
                {['login', 'register'].map((t) => (
                  <button
                    key={t}
                    className={`w-1/2 py-2 font-semibold ${
                      tab === t ? 'border-b-2 border-primary text-primary' : 'text-muted'
                    }`}
                    onClick={() => setTab(t)}
                  >
                    {t === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>

              {/* Dynamic Fields */}
              {tab === 'register' && (
                <input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full mb-2 px-3 py-2 border rounded text-sm bg-background text-foreground"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mb-2 px-3 py-2 border rounded text-sm bg-background text-foreground"
              />

              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark text-sm"
              >
                {tab === 'login' ? 'Login' : 'Register'}
              </button>

              <div className="text-xs text-center text-muted mt-3">
                <button
                  className="underline"
                  onClick={() => {
                    window.location.href = 'http://localhost:5000/login/google';
                  }}
                >
                  Login with Google
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
