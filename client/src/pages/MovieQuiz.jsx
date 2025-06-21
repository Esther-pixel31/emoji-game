// pages/MovieQuiz.jsx
import QuizTemplate from '../components/QuizTemplate';

const movieQuestions = [
  { id: 1, question: '🧔🦇', answer: 'Batman' },
  { id: 2, question: '🧑⚡', answer: 'Harry Potter' },
  { id: 3, question: '🚢❄️💔', answer: 'Titanic' }
];

export default function MovieQuiz() {
  return (
    <QuizTemplate
      title="🎬 Movie Characters Quiz"
      questions={movieQuestions}
      genreKey="movie"
    />
  );
}
