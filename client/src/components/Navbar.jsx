import ProfileMenu from './ProfileMenu';
import { Link } from 'react-router-dom';
import emojiPattern from '../assets/emoji-pattern.png';


export default function Navbar({ darkMode, setDarkMode }) {
  return (
   <nav
  className="flex justify-between items-center px-6 py-4 bg-transparent text-nav-text shadow absolute top-0 left-0 w-full z-20"
>
  <div className="flex items-center gap-4">
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="w-8 h-8 flex items-center justify-center border border-gray-400 dark:border-gray-600 rounded-full text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
    <Link to="/" className="text-2xl font-bold hover:opacity-80 transition duration-200">
      Emoji Quiz
    </Link>
  </div>

  <div className="flex items-center gap-6 text-sm sm:text-base">
    <a href="/" className="hover:text-primary transition">Home</a>
    <a href="/about" className="hover:text-primary transition">About</a>
    <a href="/contact" className="hover:text-primary transition">Contact</a>
    <ProfileMenu />
  </div>
</nav>


  );
}
