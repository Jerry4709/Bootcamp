// src/pages/misc/Test.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <motion.h2
        className="text-4xl font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Test Page
      </motion.h2>
      <motion.button
        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md mb-2"
        onClick={() => setCount(count + 1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Click Me
      </motion.button>
      <motion.p
        className="text-xl text-gray-700"
        animate={{ x: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Count: {count}
      </motion.p>
    </div>
  );
}
