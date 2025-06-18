import { useState } from "react";
import GenreSelector from "./components/GenreSelector";
import QuizCard from "./components/QuizCard";
import ScoreBoard from "./components/ScoreBoard";
import Navbar from "./components/Navbar";

const data = {
  marvel: [
    { id: 1, emojis: "🕷️🧔", answer: "spiderman" },
    { id: 2, emojis: "🛡️🇺🇸", answer: "captain america" },
  ],
  songs: [
    { id: 3, emojis: "👨🎤🕺", answer: "man in the mirror" },
  ],
  movies: [
    { id: 4, emojis: "🦇👨", answer: "batman" },
  ],
  emotions: [
    { id: 5, emojis: "😢❤️", answer: "broken heart" },
  ],
};

export default function App() {
  const [genre, setGenre] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(new Set());
  const [wrongAnswers, setWrongAnswers] = useState(new Set());

  const handleSelectGenre = (selected) => {
    setGenre(selected);
    setQuizzes(data[selected]);
    setCurrentIndex(0);
    setAnswer("");
    setFeedback("");
    setCorrectAnswers(new Set());
    setWrongAnswers(new Set());
  };

  const handleSubmit = () => {
    const quiz = quizzes[currentIndex];
    const correct = quiz.answer.toLowerCase().trim();
    const userAnswer = answer.toLowerCase().trim();

    if (userAnswer === correct) {
      setFeedback("✅ Correct!");
      setCorrectAnswers((prev) => new Set(prev).add(quiz.id));
      setWrongAnswers((prev) => {
        const next = new Set(prev);
        next.delete(quiz.id);
        return next;
      });
    } else {
      setFeedback("❌ Wrong");
      setWrongAnswers((prev) => new Set(prev).add(quiz.id));
      setCorrectAnswers((prev) => {
        const next = new Set(prev);
        next.delete(quiz.id);
        return next;
      });
    }
  };

  const handleNext = () => {
    setFeedback("");
    setAnswer("");
    setCurrentIndex((i) => (i + 1) % quizzes.length);
  };

  return (
    <>
      <Navbar />
      {!genre ? (
        <GenreSelector onSelect={handleSelectGenre} />
      ) : (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-6">
          <QuizCard
            quiz={quizzes[currentIndex]}
            answer={answer}
            setAnswer={setAnswer}
            feedback={feedback}
            onSubmit={handleSubmit}
            onNext={handleNext}
          />
          <ScoreBoard
            correct={correctAnswers.size}
            wrong={wrongAnswers.size}
          />
          <button
            onClick={() => setGenre(null)}
            className="mt-6 text-sm text-red-500 underline"
          >
            ⬅️ Change Genre
          </button>
        </div>
      )}
    </>
  );
}
