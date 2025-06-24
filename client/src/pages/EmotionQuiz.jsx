import { useEffect, useState } from 'react';
import QuizTemplate from '../components/QuizTemplate';
import emotionData from '../data/emotion.json';

export default function EmotionQuiz() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Shuffle and optionally filter by difficulty here if needed
    const shuffled = [...emotionData].sort(() => Math.random() - 0.5).slice(0, 30);
    setQuestions(shuffled);
  }, []);

  return questions.length > 0 ? (
    <QuizTemplate title="😄 Emotion Quiz" questions={questions} genreKey="emotion" />
  ) : (
    <p className="text-center mt-10">Loading questions...</p>
  );
}
