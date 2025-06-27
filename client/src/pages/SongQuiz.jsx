import { useEffect, useState } from 'react';
import QuizTemplate from '../components/QuizTemplate';
import songData from '../data/song.json';


export default function SongQuiz() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const shuffled = [...songData].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
  }, []);

  return questions.length > 0 ? (
    <QuizTemplate title="🎵 Guess the Song" questions={questions} genreKey="song" />
  ) : (
    <p className="text-center mt-10">Loading questions...</p>
  );
}
