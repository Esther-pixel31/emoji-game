export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 space-y-10">
      <div>
        <h2 className="text-4xl font-bold mb-4">About Emoji Quiz Master</h2>
        <p className="text-lg leading-7 text-muted">
          Emoji Quiz Master is a free, fun, and interactive quiz game designed for emoji lovers of all ages! The game challenges players to decode clever emoji clues in four exciting categories—Movie Characters, Emotion Quiz, Marvel Heroes, and Guess the Song. Whether you’re playing solo or with friends, it’s a perfect way to test your emoji IQ.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-2">🎯 Key Features</h3>
        <ul className="list-disc list-inside space-y-2 text-muted">
          <li>🎭 Emoji-based puzzles across 4 unique genres</li>
          <li>🌓 Theme toggle with light and dark modes</li>
          <li>⚡ Smooth animations and responsive design</li>
          <li>📱 Fully mobile and desktop optimized</li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-2">🛠️ Built With</h3>
        <p className="text-muted">
          This app is developed using modern frontend technologies including <strong>React</strong> for UI rendering, <strong>Tailwind CSS</strong> for styling, and <strong>React Router</strong> for navigation. It's a modular and scalable foundation ready for more features.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-2">🚀 Future Vision</h3>
        <p className="text-muted">
          We plan to add user profiles, multiplayer challenges, leaderboards, and custom quiz creation tools. Stay tuned for even more emoji fun!
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-2">👨‍💻 Developer Credits</h3>
        <p className="text-muted">
          Made with ❤️ by [Esther Mutua]. Contributions, feedback, and ideas are always welcome!
        </p>
      </div>
    </section>
  );
}
