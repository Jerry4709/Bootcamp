import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const totalPages = Math.max(1, total);

  // สร้าง array ของเลขหน้าที่จะแสดง
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5; // จำนวนปุ่มที่จะแสดงสูงสุด

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // แทน ...
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-lg"
    >
      {/* ปุ่มก่อนหน้า */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* ปุ่มเลขหน้า */}
      {getPageNumbers().map((num, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => num !== -1 && onChange(num)}
          disabled={num === -1}
          className={`
            min-w-[36px] h-9 px-3 rounded-lg font-medium
            transition-colors duration-200
            ${num === page
              ? 'bg-violet-500 text-white'
              : num === -1
                ? 'text-neutral-400 dark:text-neutral-600 cursor-default'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-violet-50 dark:hover:bg-violet-900/30'
            }
          `}
        >
          {num === -1 ? '...' : num}
        </motion.button>
      ))}

      {/* ปุ่มถัดไป */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}