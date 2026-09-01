import { useEffect } from "react";
import { motion } from "framer-motion";

export default function LanguageToast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000); // Ocultar en 1s

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="fixed top-28 right-1 px-5 py-3 rounded-xl shadow-lg border border-light-accent dark:border-dark-accent bg-light-surface dark:bg-dark-surface text-light-accent dark:text-dark-accent dark:text-dark-accent z-[9999] text-sm font-medium"
    >
      {message}
    </motion.div>
  );
}
