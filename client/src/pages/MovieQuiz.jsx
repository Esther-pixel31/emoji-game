import allQuestions from '../data/movie-characters.json';
import QuizTemplate from '../components/QuizTemplate';


const getRandomQuestions = () => {
  return allQuestions
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);
};

export default function MovieQuiz() {
  const questions = getRandomQuestions();

  return (
    <QuizTemplate
      title="🎬 Guess the Movie Character"
      genreKey="movies"
      questions={questions}
    />
  );
}
