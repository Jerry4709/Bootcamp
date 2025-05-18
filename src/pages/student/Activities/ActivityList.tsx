import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
//import { usePaginate } from '@/hooks/usePaginate';
import { activityService } from '@/services/activity.service';
import type { Activity, ActivityCategory } from '@/types/activity';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Users, Heart, BookOpen } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // เพิ่ม import

/* ────────── utils ────────── */

interface Option {
  label: string;
  value: string;
}

const TYPE_OPTIONS: Option[] = [
  { label: 'ทุกประเภท', value: '' },
  { label: 'อาสา', value: 'อาสาสมัคร' },
  { label: 'ช่วยงาน', value: 'กิจกรรมช่วยงาน' },
  { label: 'อบรม', value: 'ฝึกอบรม' },
];

const getActivityIcon = (category: ActivityCategory) => {
  switch (category) {
    case 'อาสาสมัคร':
      return <Heart className="w-6 h-6 text-red-400" />;
    case 'กิจกรรมช่วยงาน':
      return <Users className="w-6 h-6 text-emerald-400" />;
    case 'ฝึกอบรม':
      return <BookOpen className="w-6 h-6 text-amber-400" />;
    default:
      return <Users className="w-6 h-6 text-gray-400" />;
  }
};

// Custom Toast Styles
const toastStyle = {
  style: {
    background: '#4C1D95',
    color: '#fff',
    padding: '16px',
    borderRadius: '10px',
  },
  success: {
    icon: '🎉',
    style: {
      background: '#059669',
    },
  },
  error: {
    icon: '⚠️',
    style: {
      background: '#DC2626',
    },
  },
};

/* ────────── component ────────── */

export default function ActivityList() {
  const navigate = useNavigate();

  const [type, setType] = useState<ActivityCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<{ items: Activity[]; total: number }>({
    items: [],
    total: 0,
  });
  const [filteredData, setFilteredData] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10; // จำนวนรายการต่อหน้า

  /* -------- fetch approved list -------- */
  useEffect(() => {
    activityService
      .getApproved({
        page: 1, 
        limit: 9999,
        status: 'อนุมัติ',
      })
      .then(setData)
      .catch(() => setData({ items: [], total: 0 }));
  }, []); // ลบ dependencies ที่ไม่จำเป็น

  /* -------- local filter & pagination -------- */
  useEffect(() => {
    let filtered = data.items;

    // กรองตามประเภท
    if (type) {
      filtered = filtered.filter((i) => i.category === type);
    }

    // กรองตามคำค้นหา
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) => 
          i.title.toLowerCase().includes(q) || 
          i.category.toLowerCase().includes(q)
      );
    }

    // อัพเดท total items หลังจากกรอง
    setData(prev => ({ ...prev, total: filtered.length }));

    // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtered.slice(startIndex, endIndex);

    setFilteredData(paginatedData);
  }, [data.items, type, searchQuery, page]);

  /* -------- join / unjoin -------- */
  const handleJoin = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await activityService.toggleRegistration(id);
      
      if (result.success) {
        // แสดง popup แจ้งเตือน
        toast.success('สมัครกิจกรรมสำเร็จ!', {
          ...toastStyle.success,
          duration: 2000,
          position: 'top-center',
        });

        // รอให้ popup แสดงเสร็จแล้วค่อย redirect
        setTimeout(() => {
          navigate('/student/my-activities');
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to join activity:', err);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', {
        ...toastStyle.error,
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  /* -------- handlers -------- */
  const handleTypeChange = (v: string) => {
    setType(v as ActivityCategory);
    setPage(1);
  };

  /* ────────── render ────────── */

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-sky-50 dark:from-neutral-900 dark:to-violet-950">
      <Toaster />
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
        {/* Hero */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            กิจกรรมทั้งหมด 
          </h1>
          
        </header>

        {/* Search / Filter */}
        <section className="backdrop-blur-md bg-white/30 dark:bg-neutral-800/30 p-6 rounded-2xl shadow-lg border border-white/50 dark:border-neutral-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ค้นหากิจกรรม..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-xl border border-white/50 bg-white/50 dark:bg-neutral-900/50 dark:border-neutral-700/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/50 text-neutral-900 dark:text-white placeholder-neutral-500 transition-all duration-300"
              />
              <span className="absolute right-4 top-3.5 text-neutral-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>

            <Select
              label="ประเภทกิจกรรม"
              value={type}
              onChange={(e) => handleTypeChange(e.currentTarget.value)}
              options={TYPE_OPTIONS}
              className="w-full sm:w-60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-white/50 dark:border-neutral-700/50 rounded-xl"
            />
          </div>
        </section>

        {/* List */}
        <section
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            gap-6 md:gap-8
          "
        >
          {filteredData.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{
                y: -6,
                scale: 1.03,
                rotateX: 3,
                rotateY: -3,
                boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
              }}
              className="
                group relative flex flex-col
                bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm
                rounded-2xl border border-white/50 dark:border-neutral-700/50
                shadow-lg hover:shadow-2xl
                transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]
                p-6 cursor-pointer
              "
              onClick={() => navigate(`/activities/${activity.id}`)}
            >
              {/* icon */}
              <div
                className="
                  flex items-center justify-center w-14 h-14
                  rounded-full bg-gradient-to-br
                  from-violet-100 to-indigo-100
                  dark:from-violet-900/40 dark:to-indigo-900/40
                  mb-4 transition-transform duration-300
                  group-hover:scale-110
                "
              >
                {getActivityIcon(activity.category)}
              </div>

              {/* title */}
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-1">
                {activity.title}
              </h3>

              {/* meta row */}
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${
                      activity.category === 'อาสาสมัคร'
                        ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-100'
                        : activity.category === 'กิจกรรมช่วยงาน'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100'
                    }
                  `}
                >
                  {activity.category}
                </span>

                <time className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Date(activity.start_time).toLocaleDateString('th-TH')}
                </time>
              </div>

              {/* participants & status */}
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  👥 {activity.current_participants ?? 0}/{activity.max_participants}
                </span>

                <span
                  className={`
                    px-2 py-0.5 rounded text-xs
                    ${
                      activity.status === 'อนุมัติ'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100'
                        : activity.status === 'รออนุมัติ'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100'
                    }
                  `}
                >
                  {activity.status}
                </span>
              </div>

              {/* join btn */}
              <Button
                onClick={(e) => handleJoin(activity.id, e)}
                disabled={activity.is_registered} // เพิ่ม disabled state
                className={`
                  mt-4 self-end px-4 py-2 text-xs
                  ${
                    activity.is_registered
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-violet-500 hover:bg-violet-600'
                  }
                `}
              >
                {activity.is_registered ? '✅ สมัครแล้ว' : '🎯 เข้าร่วม'}
              </Button>
            </motion.div>
          ))}
        </section>

        {/* Pagination */}
        {data.total > limit && (
          <div className="flex justify-center mt-8">
            <Pagination
              page={page}
              total={Math.ceil(data.total / limit)}
              limit={limit}
              onChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
