import { motion } from "framer-motion";
import emojiPattern from "../assets/emoji-pattern.png"; 

export default function Contact() {
  return (
    <section
      className="relative px-6 py-20 min-h-screen"
      style={{
        backgroundImage: `url(${emojiPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "150px",
      }}
    >
      
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-sm"></div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl mx-auto bg-white/90 dark:bg-black/80 rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-4xl font-bold mb-8 tracking-tight text-left">📬 Contact Us</h2>
        <form className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-card text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-card text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-card text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            ></textarea>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition shadow-sm"
            >
              Send
            </button>
          </motion.div>
        </form>
      </motion.div>
    </section>
  );
}
