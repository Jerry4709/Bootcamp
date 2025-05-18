import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { activityService } from '@/services/activity.service';

// StatsCard Component
interface StatsCardProps {
  title: string;
  value: string;
  className?: string;
}

const StatsCard = ({ title, value, className = '' }: StatsCardProps) => (
  <div className={`
    p-6 rounded-xl 
    bg-gradient-to-br from-white/80 to-white/50
    dark:from-neutral-800/80 dark:to-neutral-800/50
    backdrop-blur-sm border border-white/50 
    dark:border-neutral-700/50 shadow-lg
    ${className}
  `}>
    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
      {title}
    </h3>
    <p className="text-3xl font-bold mt-2 text-neutral-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total_hours: 0,
    total_points: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await activityService.getMySummary();
        setSummary({
          total_hours: Number(data.total_hours) || 0,
          total_points: Number(data.total_points) || 0,
        });
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const CardSkeleton = () => (
    <div className="h-[96px] w-full rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-neutral-700 dark:to-neutral-800 animate-pulse" />
  );

  return (
    <main className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
        ยินดีต้อนรับ, {user?.firstname} {user?.lastname}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="ชั่วโมงสะสม"
              value={summary.total_hours.toFixed(2)}
            />
            <StatsCard
              title="คะแนนสะสม"
              value={summary.total_points.toFixed(2)}
            />
          </>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={() => navigate('/student/activities')}>ค้นหากิจกรรม</Button>
        <Button variant="outline" onClick={() => navigate('/student/profile')}>
          โปรไฟล์
        </Button>
      </div>
    </main>
  );
}
