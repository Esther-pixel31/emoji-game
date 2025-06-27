import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

export default function ProfileMenu() {
  const { user, login, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState('login');
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && setShowModal(false);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (openMenu && user) {
      fetch('/api/leaderboard')
        .then((res) => res.json())
        .then((data) => setLeaderboard(data.slice(0, 3)))
        .catch((err) => console.error('Leaderboard fetch error:', err));
    }
  }, [openMenu, user]);

  const schema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Min 6 chars').required('Required'),
    username: tab === 'register' ? Yup.string().required('Required') : Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const endpoint = tab === 'register' ? '/api/register' : '/api/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to authenticate');

      await login();
      toast.success(tab === 'login' ? `Welcome back, ${data.user?.username || 'User'}!` : 'Account created 🎉');
      resetForm();
      setShowModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative text-sm text-right" ref={dropdownRef}>
        {user ? (
          <>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpenMenu((prev) => !prev)}
            >
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-primary transition"
              />
              <p className="font-semibold text-sm flex items-center gap-2">
                {user.username}
                <span className="text-xs text-muted">⭐ {user.points} pts</span>
              </p>
            </div>

            {openMenu && (
              <div className="absolute right-0 mt-2 bg-card text-foreground rounded-md shadow-lg w-72 p-4 z-10 text-left">
                <Link
                  to="/profile"
                  className="block mb-3 text-sm text-primary font-semibold hover:underline"
                  onClick={() => setOpenMenu(false)}
                >
                  View Profile
                </Link>

                {user.profile?.bio && (
                  <p className="text-sm text-muted-foreground mb-2">{user.profile.bio}</p>
                )}
                {user.profile?.avatar_url && (
                  <img
                    src={user.profile.avatar_url}
                    alt="avatar"
                    className="w-10 h-10 rounded-full mb-2"
                  />
                )}

                <p className="font-semibold mb-2 text-sm flex justify-between">
                  Achievements
                  <Link
                    to="/achievements"
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => setOpenMenu(false)}
                  >
                    View all
                  </Link>
                </p>
                {user.achievements?.length ? (
                  <ul className="text-sm space-y-1 mb-3">
                    {user.achievements.map((a, idx) => (
                      <li key={idx} className="text-xs text-green-700 dark:text-green-400">
                        🏆 <strong>{a.title}</strong> – {a.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted"></p>
                )}

                <p className="font-semibold mb-2 text-sm flex justify-between">
                  History
                  <Link
                    to="/history"
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => setOpenMenu(false)}
                  >
                    View all
                  </Link>
                </p>
                {user.history?.length ? (
                  <ul className="text-sm space-y-1">
                    {user.history.slice(0, 3).map((game, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        {game.genre} – {game.score}/{game.total} on{' '}
                        {new Date(game.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted">No history yet.</p>
                )}

                <p className="font-semibold mb-2 mt-4 text-sm flex justify-between">
                  Leaderboard
                  <Link
                    to="/leaderboard"
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => setOpenMenu(false)}
                  >
                    View all
                  </Link>
                </p>
                {leaderboard.length === 0 ? (
                  <p className="text-xs text-muted">No data yet.</p>
                ) : (
                  <ul className="text-sm space-y-1 mb-3">
                    {leaderboard.map((u, idx) => (
                      <li key={idx} className="flex justify-between text-muted-foreground">
                        <span>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {u.username}
                        </span>
                        <span className="text-primary font-semibold">{u.points}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => {
                    logout();
                    toast('Logged out');
                    setOpenMenu(false);
                  }}
                  className="mt-3 w-full px-3 py-1 text-xs bg-red-500 text-white rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=guest`}
            alt="Guest Avatar"
            className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300 hover:border-primary transition"
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
              className="bg-card text-foreground p-6 rounded-lg w-96 max-w-full shadow-lg relative"
            >
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

              <Formik
                initialValues={{ email: '', password: '', username: '' }}
                validationSchema={schema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-3">
                    {tab === 'register' && (
                      <div>
                        <Field
                          type="text"
                          name="username"
                          placeholder="Username"
                          className="w-full px-3 py-2 border border-default bg-background text-foreground"
                        />
                        <ErrorMessage name="username" component="div" className="text-xs text-red-500" />
                      </div>
                    )}

                    <div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-default bg-background text-foreground"
                      />
                      <ErrorMessage name="email" component="div" className="text-xs text-red-500" />
                    </div>

                    <div className="relative">
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border border-default bg-background text-foreground"
                      />
                      <span
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                      <ErrorMessage name="password" component="div" className="text-xs text-red-500" />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-primary text-white py-2 rounded text-sm ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : tab === 'login' ? 'Login' : 'Register'}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="text-xs text-center text-muted mt-3">
                <button className="underline" onClick={() => window.open('/login/google', '_self')}>
                  
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
