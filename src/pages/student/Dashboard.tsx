import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/charts/StatsCard';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { activityService } from '@/services/activity.service';
import { DataTable } from '@/components/ui/Table';
import { ROUTES } from '@/constants/routes';
import type { Activity } from '@/types/activity';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, Award } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    registered: 0,
    hours: 0,
    points: 0,
    totalActivities: 0
  });

  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // โหลดข้อมูลสรุป
    const loadSummary = async () => {
      try {
        const summaryData = await activityService.getMySummary();
        setSummary(summaryData);
      } catch (error) {
        console.error('Error loading summary:', error);
      }
    };

    // โหลดกิจกรรมล่าสุด 5 รายการ
    const loadRecentActivities = async () => {
      try {
        setLoading(true);
        const response = await activityService.getApproved({ 
          page: 1, 
          limit: 5
        });
        setRecentActivities(response.items);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
    loadRecentActivities();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.main 
      className="p-4 md:p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          ยินดีต้อนรับ, {user?.firstname} {user?.lastname}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          ระบบจัดการกิจกรรมอาสาและกิจกรรมมหาวิทยาลัย
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        <StatsCard 
          title="กิจกรรมที่เข้าร่วม" 
          value={summary.registered.toString()} 
          icon={<Calendar className="w-8 h-8 text-violet-500" />}
        />
        <StatsCard 
          title="ชั่วโมงสะสม" 
          value={summary.hours.toString()} 
          icon={<Clock className="w-8 h-8 text-blue-500" />}
        />
        <StatsCard 
          title="คะแนนสะสม" 
          value={summary.points.toString()} 
          icon={<Award className="w-8 h-8 text-yellow-500" />}
        />
        <StatsCard 
          title="กิจกรรมทั้งหมด" 
          value={summary.totalActivities.toString()} 
          icon={<Users className="w-8 h-8 text-green-500" />}
        />
      </motion.div>

      <motion.div className="space-y-4" variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Calendar size={20} className="text-violet-500" />
            กิจกรรมล่าสุด
          </h2>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate(ROUTES.STUDENT_ACTIVITIES)}
              className="flex-1 sm:flex-none flex items-center gap-2"
            >
              <Search size={16} />
              ค้นหากิจกรรม
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(ROUTES.STUDENT_MY_ACTIVITIES)}
              className="flex-1 sm:flex-none"
            >
              กิจกรรมของฉัน
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          </div>
        ) : (
          <DataTable<Activity>
            columns={[
              { title: 'ชื่อกิจกรรม', key: 'title' },
              { title: 'ประเภท', key: 'type' },
              { 
                title: 'วันที่', 
                key: 'startDate',
                render: (item) => `${item.startDate} - ${item.endDate}`
              },
              { 
                title: 'สถานะ', 
                key: 'status',
                render: (item) => (
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    item.isRegistered 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {item.isRegistered ? 'สมัครแล้ว' : 'เปิดรับสมัคร'}
                  </span>
                )
              },
            ]}
            data={recentActivities}
            onRowClick={(row) => navigate(ROUTES.STUDENT_ACTIVITY_DETAIL(row.id))}
            className="bg-white/80 dark:bg-neutral-800/80 rounded-xl shadow-md"
          />
        )}

        <div className="flex justify-center mt-4">
          <Button 
            variant="outline"
            onClick={() => navigate(ROUTES.STUDENT_ACTIVITIES)}
          >
            ดูกิจกรรมทั้งหมด
          </Button>
        </div>
      </motion.div>
    </motion.main>
  );
}

// Component ที่ไม่มีในไฟล์ที่ให้มา แต่ใช้ในโค้ด
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}