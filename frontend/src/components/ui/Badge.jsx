import { motion } from 'framer-motion';

export default function Badge({ children, color = 'gray', className = '', animate = true }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    yellow: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const badgeContent = (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors[color] || colors.gray} ${className}`}>
      {children}
    </span>
  );

  if (animate) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
}