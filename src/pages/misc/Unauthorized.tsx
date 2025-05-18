// src/pages/misc/Unauthorized.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-100 to-yellow-300"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <Lock className="text-yellow-700 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-yellow-700 mb-4">401</h1>
        <p className="text-lg text-gray-800 mb-6">Unauthorized Access</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/login" className="px-6 py-2 bg-yellow-600 text-white rounded-lg">
            Login
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
