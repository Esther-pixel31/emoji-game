import ProfileMenu from './ProfileMenu';
import { Link } from 'react-router-dom';

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="flex flex-wrap justify-between items-center px-4 sm:px-6 py-4 bg-transparent text-nav-text shadow absolute top-0 left-0 w-full z-20">
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-0">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 flex items-center justify-center border border-gray-400 dark:border-gray-600 rounded-full text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <Link to="/" className="text-xl sm:text-2xl font-bold hover:opacity-80 transition duration-200">
          Emoji Quiz
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <Link to="/about" className="hover:text-primary transition">About</Link>
        <Link to="/contact" className="hover:text-primary transition">Contact</Link>
        <ProfileMenu />
      </div>
    </nav>
  );
}
