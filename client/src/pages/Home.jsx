import GenreCard from '../components/GenreCard';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const genres = [
  { emoji: '🎬', title: 'Movie Characters', description: 'Guess the film icons' },
  { emoji: '😄', title: 'Emotion Quiz', description: 'Name that feeling' },
  { emoji: '🦸', title: 'Marvel Characters', description: 'Which hero is this?' },
  { emoji: '🎵', title: 'Guess the Song', description: 'Decode the tune' }
];

export default function Home() {
  const scrollToGenres = () => {
    const section = document.getElementById('genre-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="relative bg-hero-gradient py-16 text-center flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-4 animate-bounce">
          🎉 Emoji Quiz Master 🎉
        </h1>

        <p className="text-xl max-w-xl mx-auto text-muted">
          Challenge yourself with fun emoji-based quizzes across 4 genres. Fast, funny, and family-friendly!
        </p>

        {/* Animated arrow */}
        <motion.div
          onClick={scrollToGenres}
          className="mt-10 cursor-pointer text-primary"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          whileHover={{ scale: 1.2 }}
        >
          <ChevronDown size={36} strokeWidth={2.5} />
        </motion.div>
      </section>

      <section id="genre-section" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose a Genre</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {genres.map((g, i) => (
            <GenreCard
              key={i}
              emoji={g.emoji}
              title={g.title}
              description={g.description}
            />
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-muted">
        &copy; 2025 Emoji Quiz Master. All rights reserved.
      </footer>
    </>
  );
}
