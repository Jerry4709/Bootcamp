import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { activityService } from '@/services/activity.service';
import type { ActivityDetail } from '@/types/activity';

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    activityService
      .getById(id)
      .then((data) => setActivity(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size={48} />
      </div>
    );
  }

  if (!activity) {
    return <p className="p-4 text-center text-neutral-700 dark:text-neutral-300">ไม่พบข้อมูลกิจกรรม</p>;
  }

  return (
    <main className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          {activity.title}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/staff/activities')}>
            กลับ
          </Button>
          <Button onClick={() => navigate(`/staff/activities/${activity.id}/edit`)}>
            แก้ไข
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/staff/activities/${activity.id}/applicants`)}>
            ดูผู้สมัคร
          </Button>
        </div>
      </div>

      <section className="bg-white/80 dark:bg-neutral-800/80 p-6 rounded-xl shadow-md space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">รายละเอียด</h2>
          <p className="mt-1 text-neutral-800 dark:text-neutral-200">{activity.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-700 dark:text-neutral-300">
          <div>
            <dt className="font-medium">ประเภทกิจกรรม</dt>
            <dd className="mt-1">{activity.type}</dd>
          </div>
          <div>
            <dt className="font-medium">ช่วงเวลา</dt>
            <dd className="mt-1">
              {activity.startDate} – {activity.endDate}
            </dd>
          </div>
          <div>
            <dt className="font-medium">จำนวนรับสมัคร</dt>
            <dd className="mt-1">
              {activity.currentParticipants} / {activity.maxParticipants} คน
            </dd>
          </div>
          <div>
            <dt className="font-medium">สถานะ</dt>
            <dd className="mt-1">
              {activity.isActive ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
            </dd>
          </div>
        </div>
      </section>
    </main>
);
}
