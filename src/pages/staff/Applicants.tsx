/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import type { Applicant } from '@/types/activity';
import { activityService } from '@/services/activity.service';

export default function Applicants() {
  const { id } = useParams<{ id: string }>();
  const [apps, setApps] = useState<Applicant[]>([]);

  useEffect(() => {
    if (id) activityService.getApplicants(id).then(setApps);
  }, [id]);

  const handleAction = async (appId: string, approve: boolean) => {
    if (!id) return;
    
    
    approve
      ? await activityService.approveApplicant(id, appId)
      : await activityService.rejectApplicant(id, appId);
    setApps((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status: approve ? 'APPROVED' : 'REJECTED' } : a
      )
    );
  };

  return (
    <main className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
        ผู้สมัครกิจกรรม
      </h2>

      <DataTable<Applicant>
        columns={[
          { title: 'รหัสนิสิต', key: 'sid' },
          {
            title: 'ชื่อ-สกุล',
            key: 'id',
            render: (a) => `${a.firstname} ${a.lastname}`,
          },
          { title: 'สถานะ', key: 'status' },
          {
            title: 'Action',
            key: 'id',
            render: (a) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  disabled={a.status === 'APPROVED'}
                  onClick={() => handleAction(a.id, true)}
                >
                  อนุมัติ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(a.id, false)}
                >
                  ปฏิเสธ
                </Button>
              </div>
            ),
          },
        ]}
        data={apps}
        className="bg-white/80 dark:bg-neutral-800/80 rounded-xl shadow"
      />
    </main>
);
}
