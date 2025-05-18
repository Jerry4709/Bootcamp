// src/pages/misc/NotFound.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <ArrowLeft
          className="w-12 h-12 text-blue-600 mx-auto mb-4 cursor-pointer"
          onClick={() => window.history.back()}
        />
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">Page not found.</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            Go Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
