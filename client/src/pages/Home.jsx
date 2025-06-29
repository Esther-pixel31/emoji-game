import GenreCard from '../components/GenreCard';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import emojiPattern from '../assets/emoji-pattern.png';

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
      <section
        className="relative overflow-hidden py-16 sm:py-20 text-center flex flex-col items-center"
        style={{
          backgroundImage: `url(${emojiPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px',
          animation: 'moveBg 40s linear infinite',
        }}
      >
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <h1 className="pt-24 text-3xl sm:text-5xl font-extrabold mb-4 animate-bounce relative z-10">
          🎉 Emoji Quiz Master 🎉
        </h1>
        <p className="text-base sm:text-xl max-w-xl mx-auto text-gray-600 dark:text-gray-300 relative z-10">
          Challenge yourself with fun emoji-based quizzes across 4 genres. Fast, funny, and family-friendly!
        </p>

        <motion.div
          onClick={scrollToGenres}
          className="mt-10 cursor-pointer text-primary relative z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          whileHover={{ scale: 1.2 }}
        >
          <ChevronDown size={36} strokeWidth={2.5} />
        </motion.div>
      </section>

      <section id="genre-section" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Choose a Genre</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {genres.map((g, i) => (
            <GenreCard
              key={i}
              emoji={g.emoji}
              title={g.title}
              description={g.description}
              className="hover:shadow-lg transition"
            />
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-gray-500 dark:text-gray-400">
        &copy; 2025 Emoji Quiz Master. All rights reserved.
      </footer>
    </>
  );
}
