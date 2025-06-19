export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-nav text-nav-text shadow">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <span className="text-lg font-bold">EmojiQuiz</span>
      </div>
      <ul className="flex gap-6 font-medium">
        <li><a href="#" className="hover:text-primary">Home</a></li>
        <li><a href="#about" className="hover:text-primary">About</a></li>
        <li><a href="#contact" className="hover:text-primary">Contact</a></li>
      </ul>
    </nav>
  );
}
