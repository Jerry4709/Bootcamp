import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import { usePaginate } from '@/hooks/usePaginate';
import { activityService } from '@/services/activity.service';
import type { Activity, ActivityType } from '@/types/activity';

const TYPE_OPTIONS = [
  { label: 'ทุกประเภท', value: '' },
  { label: 'อาสา', value: 'VOLUNTEER' },
  { label: 'ช่วยงาน', value: 'WORK' },
  { label: 'อบรม', value: 'TRAINING' },
];

export default function StaffActivityList() {
  const navigate = useNavigate();
  const { page, limit, setPage } = usePaginate();
  const [type, setType] = useState<ActivityType | ''>('');
  const [data, setData] = useState<{ items: Activity[]; total: number }>({
    items: [],
    total: 0,
  });

  useEffect(() => {
    activityService.getAll({ page, limit, type }).then(setData);
  }, [page, limit, type]);

  return (
    <main className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
        จัดการกิจกรรม
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Select
          label="ประเภทกิจกรรม"
          value={type}
          options={TYPE_OPTIONS}
          onChange={(e) => {
            setType(e.currentTarget.value as ActivityType);
            setPage(1);
          }}
          className="w-full sm:w-60"
        />
      </div>

      <DataTable<Activity>
        columns={[
          { title: 'ชื่อกิจกรรม', key: 'title' },
          { title: 'ประเภท', key: 'type' },
          {
            title: 'วันที่',
            key: 'startDate',
            render: (a) => `${a.startDate} – ${a.endDate}`,
          },
          {
            title: 'สถานะ',
            key: 'status',
            render: (a) => (
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                {a.status}
              </span>
            ),
          },
          {
            title: 'Action',
            key: 'id',
            render: (a) => (
              <div className="flex flex-wrap gap-2">
                <Button className=''
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/staff/activities/${a.id}`)}
                >
                  รายละเอียด
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    navigate(`/staff/activities/${a.id}/applicants`)
                  }
                >
                  ผู้สมัคร
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(`/staff/activities/${a.id}/edit`)
                  }
                >
                  แก้ไข
                </Button>
              </div>
            ),
          },
        ]}
        data={data.items}
        onRowClick={() => {}}
        className="bg-white/80 dark:bg-neutral-800/80 rounded-xl shadow"
      />

      <Pagination
        page={page}
        total={data.total}
        limit={limit}
        onChange={setPage}
      />
    </main>
  );
}
