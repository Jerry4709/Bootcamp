import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { activityService } from '@/services/activity.service';
import type { ActivityDetail } from '@/types/activity';
import { useAuth } from '@/hooks/useAuth';

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) activityService.getById(id).then(setActivity);
  }, [id]);

  const handleToggle = async () => {
    if (!activity) return;
    setLoading(true);
    try {
      await activityService.toggleRegistration(activity.id);
      if (!activity.is_registered) {
        navigate('/student/my-activities');
        return;
      }
      const updated = await activityService.getById(String(activity.id));
      setActivity(updated);
    } catch (error) {
      console.error('Error toggling registration:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!activity) return <p className="p-4">กำลังโหลดข้อมูล...</p>;

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {activity.title}
          </h1>
          <span className="inline-block mt-2 px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-100 rounded-full text-sm">
            {activity.category}
          </span>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">รายละเอียดกิจกรรม</h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {activity.description}
            </p>
          </div>

          <ul className="space-y-4 mb-6">
            <li className="flex items-center space-x-2">
              <span className="text-violet-500">📅</span>
              <span className="font-semibold">วันที่:</span>
              <span>{new Date(activity.start_time).toLocaleDateString('th-TH')}</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-violet-500">⏰</span>
              <span className="font-semibold">เวลา:</span>
              <span>
                {new Date(activity.start_time).toLocaleTimeString('th-TH')} - 
                {new Date(activity.end_time).toLocaleTimeString('th-TH')}
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-violet-500">👥</span>
              <span className="font-semibold">ผู้เข้าร่วม:</span>
              <span>{activity.current_participants}/{activity.max_participants} คน</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-violet-500">🏷️</span>
              <span className="font-semibold">สถานะ:</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                activity.is_registered 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
              }`}>
                {activity.is_registered ? 'สมัครแล้ว' : 'ยังไม่สมัคร'}
              </span>
            </li>
          </ul>

          {user?.role === 'STUDENT' && (
            <div className="flex gap-4">
              <Button
                onClick={handleToggle}
                disabled={loading}
                className={`flex-1 sm:flex-none sm:w-40 ${
                  activity.is_registered 
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-violet-500 hover:bg-violet-600'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    กำลังดำเนินการ
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {activity.is_registered ? '❌ ยกเลิกการสมัคร' : '✅ สมัครเข้าร่วม'}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none sm:w-32"
              >
                ย้อนกลับ
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}