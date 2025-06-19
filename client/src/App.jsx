import GenreCard from './components/GenreCard';
import Navbar from './components/Navbar';
import './index.css';
import { useState, useEffect } from 'react';

const genres = [
  { emoji: '🎬', title: 'Movie Characters', description: 'Guess the film icons' },
  { emoji: '😄', title: 'Emotion Quiz', description: 'Name that feeling' },
  { emoji: '🦸', title: 'Marvel Characters', description: 'Which hero is this?' },
  { emoji: '🎵', title: 'Guess the Song', description: 'Decode the tune' }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <section className="relative bg-hero-gradient py-16 text-center">
        <h1 className="text-5xl font-extrabold mb-4 animate-bounce">🎉 Emoji Quiz Master 🎉</h1>
        <p className="text-xl max-w-xl mx-auto text-muted">Challenge yourself with fun emoji-based quizzes across 4 genres. Fast, funny, and family-friendly!</p>
        <button className="mt-6 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition">Start Playing</button>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose a Genre</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {genres.map((g, i) => (
            <GenreCard key={i} emoji={g.emoji} title={g.title} description={g.description} />
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-muted">&copy; 2025 Emoji Quiz Master. All rights reserved.</footer>
    </div>
  );
}