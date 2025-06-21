export default function SongQuiz() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-6">🎵 Guess the Song</h1>
      <p className="text-muted text-lg mb-8">Can you name the song from emoji lyrics?</p>
      <div className="bg-card p-6 rounded-lg shadow">
        <div className="text-5xl mb-4">👶🕺🎶</div>
        <input type="text" placeholder="Your answer" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-background text-foreground" />
        <button className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Submit</button>
      </div>
    </section>
  );
}