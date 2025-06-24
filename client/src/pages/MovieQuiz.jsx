import { useState } from 'react';
import allQuestions from '../data/movie-characters.json';
import QuizTemplate from '../components/QuizTemplate';

const filterQuestions = (level) => {
  return allQuestions
    .filter(q => level === 'all' || q.difficulty === level)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);
};

export default function MovieQuiz() {
  const [difficulty, setDifficulty] = useState('all');
  const [started, setStarted] = useState(false);

  const startQuiz = () => setStarted(true);

  if (!started) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-6">🎬 Movie Quiz</h1>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="border px-4 py-2 rounded mb-4"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <br />
        <button onClick={startQuiz} className="bg-primary text-white px-6 py-2 rounded">
          Start Quiz
        </button>
      </div>
    );
  }

  const questions = filterQuestions(difficulty);

  return (
    <QuizTemplate
      title="🎬 Guess the Movie Character"
      genreKey="movies"
      questions={questions}
    />
  );
}
