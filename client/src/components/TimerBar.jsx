import { motion, AnimatePresence } from 'framer-motion';

export default function TimerBar({ time, max = 60 }) {
  const percent = (time / max) * 100;
  const isTimeout = time <= 0;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-1">
      {/* Label */}
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        Time Left: {time}s
      </span>

      {/* Bar with animation */}
      <AnimatePresence>
        <motion.div
          key={isTimeout ? 'timeout' : 'timer'}
          initial={{ scale: 1 }}
          animate={isTimeout ? { scale: [1, 1.1, 1, 0.9, 1] } : {}}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, repeat: 2 }}
          className="w-52 h-5 bg-gray-300 rounded overflow-hidden shadow-md"
        >
          <div
            className={`h-full transition-all duration-500 ${
              time <= 5 ? 'bg-red-500 animate-pulse' : 'bg-pink-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
