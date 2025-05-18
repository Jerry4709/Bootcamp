import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityService } from '@/services/activity.service';
import type { Activity } from '@/types/activity';
import { DataTable } from '@/components/ui/Table';

export default function MyActivities() {
  const navigate = useNavigate();
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    activityService.getMyActivities()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
        กิจกรรมของฉัน
      </h2>

      <DataTable<Activity>
        columns={[
          { 
            title: 'ชื่อกิจกรรม', 
            key: 'title' 
          },
          { 
            title: 'ประเภท', 
            key: 'category',
            render: (activity) => (
              <span className="px-2 py-1 rounded-full text-sm bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-100">
                {activity.category}
              </span>
            )
          },
          { 
            title: 'วันที่', 
            key: 'start_time',
            render: (activity) => (
              new Date(activity.start_time).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            )
          },
          {
            title: 'สถานะ',
            key: 'status',
            render: (activity) => (
              <span className={`px-2 py-1 rounded-full text-sm ${
                activity.status === 'อนุมัติ' ? 'bg-green-100 text-green-800' :
                activity.status === 'รออนุมัติ' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {activity.status}
              </span>
            )
          }
        ]}
        data={data}
        isLoading={loading}
        onRowClick={(row) => navigate(`/activities/${row.id}`)}
        className="bg-white/80 dark:bg-neutral-800/80 rounded-xl shadow-lg"
      />
    </main>
  );
}
