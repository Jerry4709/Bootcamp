// src/pages/misc/Error.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

export default function ErrorPage() {
  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-gradient-to-br from-red-100 to-red-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <XCircle className="text-red-500 w-20 h-20 mx-auto mb-4" />
        <motion.h1
          className="text-6xl font-bold text-red-600 mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          500
        </motion.h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Something went wrong.</p>
        <motion.button
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry
        </motion.button>
      </div>
    </motion.div>
  );
}
