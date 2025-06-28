import allQuestions from '../data/movie-characters.json';
import QuizTemplate from '../components/QuizTemplate';
import emojiPattern from '../assets/emoji-pattern.png';

const getRandomQuestions = () => {
  return allQuestions
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);
};

export default function MovieQuiz() {
  const questions = getRandomQuestions();

  return (
    <section
      className="relative px-4 md:px-6 py-16 min-h-screen"
      style={{
        backgroundImage: `url(${emojiPattern})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px',
      }}
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/90 dark:bg-black/80 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8">
        <QuizTemplate
          title="🎬 Guess the Movie Character"
          genreKey="movies"
          questions={questions}
        />
      </div>
    </section>
  );
}
