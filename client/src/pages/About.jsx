import { motion } from "framer-motion";
import emojiPattern from "../assets/emoji-pattern.png";

const roadmapItems = [
  {
    title: "User Profiles",
    description: "Personalize your emoji identity and track your progress.",
  },
  {
    title: "Multiplayer Challenges",
    description: "Challenge friends in real-time emoji quiz battles.",
  },
  {
    title: "Leaderboards",
    description: "See how you rank against players around the world.",
  },
  {
    title: "Custom Quiz Builder",
    description: "Create and share your own emoji quizzes with the community.",
  },
];

export default function About() {
  return (
    <section
      className="relative px-4 sm:px-6 py-16 sm:py-20 min-h-screen"
      style={{
        backgroundImage: `url(${emojiPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "150px",
      }}
    >
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-2xl mx-auto bg-white/90 dark:bg-black/80 rounded-3xl shadow-xl p-6 sm:p-8 space-y-12 text-left">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">🧐 About Emoji Quiz Master</h2>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Emoji Quiz Master is a free, fun, and interactive quiz game designed for emoji lovers of all ages! Decode clever emoji clues in four exciting categories — Movie Characters, Emotion Quiz, Marvel Heroes, and Guess the Song. Perfect for playing solo or with friends!
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 tracking-tight">🎯 Key Features</h3>
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
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 tracking-tight">🛠️ Built With</h3>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            This app is developed using <strong>React</strong>, <strong>Tailwind CSS</strong>, and <strong>React Router</strong>. It’s modular and scalable — ready for new features!
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 tracking-tight">🚀 Future Vision</h3>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            We plan to add even more ways to play and connect. Here’s what’s on the horizon:
          </p>

          {/* Roadmap Timeline */}
          <div className="space-y-6 border-l-2 border-primary pl-6">
            {roadmapItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + idx * 0.2 }}
                className="relative"
              >
                <div className="absolute -left-3 top-1.5 w-3 h-3 rounded-full bg-primary"></div>
                <h4 className="text-lg sm:text-xl font-semibold">{item.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 + roadmapItems.length * 0.2 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 tracking-tight">👩‍💻 Developer Credits</h3>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Made with tears by <strong>Esther Mutua</strong>. Contributions, feedback, and ideas are always welcome!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
