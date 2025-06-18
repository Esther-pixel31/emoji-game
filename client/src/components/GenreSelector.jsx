// src/components/GenreSelector.jsx
import Navbar from "./Navbar";

export default function GenreSelector({ onSelect }) {
  const genres = [
    { key: "marvel", name: "Marvel Characters", emoji: "🦸‍♂️" },
    { key: "songs", name: "Guess the Song", emoji: "🎶" },
    { key: "movies", name: "Movie Characters", emoji: "🎬" },
    { key: "emotions", name: "Emotion Quiz", emoji: "😄" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-purple-100 text-gray-800">
      <Navbar />

      {/* Hero Section: Game Types */}
      <section className="py-16 px-6 text-center bg-gradient-to-br from-purple-50 to-blue-50">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-purple-800">
          🎮 Emoji Quiz Challenge
        </h1>
        <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto text-gray-700">
          Four fun genres. Unlimited fun. Can you guess them all?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-6">
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <div className="text-5xl mb-3">🦸‍♂️</div>
            <h3 className="text-xl font-bold mb-1">Marvel Characters</h3>
            <p className="text-gray-600 text-sm">Decode emojis of superheroes like Spider-Man or Iron Man.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <div className="text-5xl mb-3">🎶</div>
            <h3 className="text-xl font-bold mb-1">Guess the Song</h3>
            <p className="text-gray-600 text-sm">Recognize famous songs using only emoji lyrics.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <div className="text-5xl mb-3">🎬</div>
            <h3 className="text-xl font-bold mb-1">Movie Characters</h3>
            <p className="text-gray-600 text-sm">Test your movie knowledge with character clues.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-md">
            <div className="text-5xl mb-3">😄</div>
            <h3 className="text-xl font-bold mb-1">Emotion Quiz</h3>
            <p className="text-gray-600 text-sm">Can you read emotions from just a couple of emojis?</p>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="max-w-3xl mx-auto mb-10 bg-white rounded-3xl shadow-lg p-6 text-left">
        <h2 className="text-2xl font-bold mb-2 text-purple-800">🧠 How to Play</h2>
        <ul className="list-disc pl-5 space-y-1 text-base">
          <li>Pick your favorite genre from the choices below.</li>
          <li>Look at the emoji clue and type your guess.</li>
          <li>Get instant feedback on your answers.</li>
          <li>Track your score and beat your high score!</li>
        </ul>
      </section>

      {/* Genre Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
        {genres.map((genre) => (
          <button
            key={genre.key}
            onClick={() => onSelect(genre.key)}
            className="bg-white hover:bg-purple-100 p-8 rounded-3xl shadow-md transition-transform transform hover:scale-105 text-center text-xl font-semibold text-purple-900"
          >
            <span className="text-5xl block mb-4">{genre.emoji}</span>
            {genre.name}
          </button>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-gray-600 py-6">
        Made with 💜 by You — Emoji Quiz © 2025
      </footer>
    </div>
  );
}
