import { useEffect, useState } from 'react';
import QuizTemplate from '../components/QuizTemplate';
import emotionData from '../data/emotion.json';
import emojiPattern from '../assets/emoji-pattern.png';

export default function EmotionQuiz() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Shuffle and optionally filter by difficulty
    const shuffled = [...emotionData].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
  }, []);

  return (
    <section
      className="relative px-4 py-16 min-h-screen"
      style={{
        backgroundImage: `url(${emojiPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px',
      }}
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-3xl mx-auto bg-white/90 dark:bg-black/80 rounded-3xl shadow-xl p-6">
        {questions.length > 0 ? (
          <QuizTemplate title="😄 Emotion Quiz" questions={questions} genreKey="emotion" />
        ) : (
          <p className="text-center mt-10 text-muted">Loading questions...</p>
        )}
      </div>
    </section>
  );
}
