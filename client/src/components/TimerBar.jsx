import { motion, AnimatePresence } from 'framer-motion';

export default function TimerBar({ time, max = 60 }) {
  const percent = (time / max) * 100;
  const isTimeout = time <= 0;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2 px-4 w-full max-w-xs sm:max-w-sm md:max-w-md">
      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-100 text-center">
        ⏳ Time Left: {time}s
      </span>

      <AnimatePresence>
        <motion.div
          key={isTimeout ? 'timeout' : 'timer'}
          initial={{ scale: 1 }}
          animate={isTimeout ? { scale: [1, 1.1, 1, 0.9, 1] } : {}}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, repeat: 2 }}
          className="w-full h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden shadow"
        >
          <div
            className={`h-full transition-all duration-500 ${
              time <= 5
                ? 'bg-red-500 animate-pulse'
                : 'bg-emerald-500 dark:bg-pink-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
