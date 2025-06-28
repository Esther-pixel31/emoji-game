import { motion } from "framer-motion";
import emojiPattern from "../assets/emoji-pattern.png";

export default function About() {
  return (
    <section
      className="relative px-4 md:px-6 py-20 min-h-screen"
      style={{
        backgroundImage: `url(${emojiPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "150px",
      }}
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-2xl mx-auto bg-white/90 dark:bg-black/80 rounded-3xl shadow-xl p-6 md:p-8 space-y-10 text-left">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">🧐 About Emoji Quiz Master</h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Emoji Quiz Master is a free, fun, and interactive quiz game designed for emoji lovers of all ages! Decode clever emoji clues in four exciting categories — Movie Characters, Emotion Quiz, Marvel Heroes, and Guess the Song. Perfect for playing solo or with friends!
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">🎯 Key Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>🎭 Emoji-based puzzles across 4 unique genres</li>
            <li>🌓 Theme toggle with light and dark modes</li>
            <li>⚡ Smooth animations and responsive design</li>
            <li>📱 Fully mobile and desktop optimized</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">🛠️ Built With</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This app is developed using <strong>React</strong>, <strong>Tailwind CSS</strong>, and <strong>React Router</strong>. It’s modular and scalable — ready for new features!
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">🚀 Future Vision</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We plan to add user profiles, multiplayer challenges, leaderboards, and custom quiz creation tools. Stay tuned for even more emoji fun!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">👩‍💻 Developer Credits</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Made with tears by <strong>Esther Mutua</strong>. Contributions, feedback, and ideas are always welcome!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
