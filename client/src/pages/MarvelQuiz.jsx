import { useEffect, useState } from 'react';
import QuizTemplate from '../components/QuizTemplate';
import marvelData from '../data/marvel.json';

export default function MarvelQuiz() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const shuffled = [...marvelData].sort(() => Math.random() - 0.5).slice(0, 30);
    setQuestions(shuffled);
  }, []);

  return questions.length > 0 ? (
    <QuizTemplate title="🦸 Marvel Characters Quiz" questions={questions} genreKey="marvel" />
  ) : (
    <p className="text-center mt-10">Loading questions...</p>
  );
}
