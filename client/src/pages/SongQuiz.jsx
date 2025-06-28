import { useEffect, useState } from 'react';
import QuizTemplate from '../components/QuizTemplate';
import songData from '../data/song.json';
import emojiPattern from '../assets/emoji-pattern.png';

export default function SongQuiz() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const shuffled = [...songData].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
  }, []);

  return (
    <section
      className="relative px-4 md:px-6 py-16 min-h-screen"
      style={{
        backgroundImage: `url(${emojiPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px',
      }}
    >
      {/* Overlay for blur and opacity */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm"></div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/90 dark:bg-black/80 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8">
        {questions.length > 0 ? (
          <QuizTemplate title="🎵 Guess the Song" questions={questions} genreKey="song" />
        ) : (
          <p className="text-center mt-10">Loading questions...</p>
        )}
      </div>
    </section>
  );
}
