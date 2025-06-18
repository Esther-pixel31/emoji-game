// src/pages/Home.jsx
const genres = [
  { title: "Marvel Characters", emoji: "🦸‍♂️" },
  { title: "Guess the Song", emoji: "🎵" },
  { title: "Movie Characters", emoji: "🎬" },
  { title: "Emotion Quiz", emoji: "😊" },
];

export default function Home() {
  return (
    <div className="px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Welcome to the Emoji Quiz!</h1>
      <p className="text-center mb-10 text-gray-600">
        Choose a genre below to test your knowledge. Each one comes with emojis and excitement!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {genres.map((genre, index) => (
          <button
            key={index}
            className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold text-xl p-6 rounded-2xl shadow-lg transition"
          >
            <span className="text-3xl mr-3">{genre.emoji}</span>
            {genre.title}
          </button>
        ))}
      </div>
    </div>
  );
}
