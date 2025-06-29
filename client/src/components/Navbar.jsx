import { useState } from 'react';
import ProfileMenu from './ProfileMenu';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex flex-wrap justify-between items-center px-4 sm:px-6 py-4 bg-transparent text-nav-text shadow absolute top-0 left-0 w-full z-20">
      <div className="flex items-center gap-3 sm:gap-4">
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

      
      <div className="hidden md:flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <Link to="/about" className="hover:text-primary transition">About</Link>
        <Link to="/contact" className="hover:text-primary transition">Contact</Link>
        <ProfileMenu />
      </div>

      
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex items-center justify-center p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      
      {menuOpen && (
        <div className="w-full flex flex-col gap-3 text-base mt-4 md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-primary transition">Contact</Link>
          <ProfileMenu />
        </div>
      )}
    </nav>
  );
}
