import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { activityService } from '@/services/activity.service';
import { motion } from 'framer-motion';

interface StaffSummary {
  totalActivities: number;
  pendingApprovals: number;
  upcomingActivities: number;
}

// StatsCard Component
interface StatsCardProps {
  title: string;
  value: string;
  className?: string;
}

const StatsCard = ({ title, value, className = '' }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`
      card hover:scale-105 transition-transform duration-300
      ${className}
    `}
  >
    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
      {title}
    </h3>
    <p className="text-3xl font-bold mt-2 text-gradient-primary">
      {value}
    </p>
  </motion.div>
);

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<StaffSummary>({
    totalActivities: 0,
    pendingApprovals: 0,
    upcomingActivities: 0,
  });

  useEffect(() => {
    activityService.getStaffSummary().then(setSummary);
  }, []);

  return (
    <main className="p-4 md:p-8 space-y-6">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gradient-primary"
      >
        สรุปภาพรวม (Staff)
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="กิจกรรมทั้งหมด"
          value={summary.totalActivities.toString()}
        />
        <StatsCard
          title="รออนุมัติ"
          value={summary.pendingApprovals.toString()}
        />
        <StatsCard
          title="กิจกรรมกำลังจะมาถึง"
          value={summary.upcomingActivities.toString()}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 mt-6"
      >
        <Button 
          className="btn btn-primary"
          onClick={() => navigate('/staff/activities/create')}
        >
          สร้างกิจกรรมใหม่
        </Button>
        <Button 
          className="btn btn-outline"
          onClick={() => navigate('/staff/activities')}
        >
          จัดการกิจกรรม
        </Button>
      </motion.div>
    </main>
  );
}
