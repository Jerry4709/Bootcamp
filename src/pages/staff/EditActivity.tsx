// src/pages/staff/Activities/EditActivity.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActivityForm from '@/components/forms/ActivityForm';
import Button from '@/components/ui/Button';
import type { ActivityDetail, ActivityPayload } from '@/types/activity';
import { activityService } from '@/services/activity.service';

export default function EditActivity() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ActivityDetail | null>(null);

  // โหลด ActivityDetail มาเก็บไว้
  useEffect(() => {
    if (id) {
      activityService.getById(id).then(setDetail);
    }
  }, [id]);

  // ยังไม่โหลดเสร็จ
  if (!detail) {
    return <p className="p-4">กำลังโหลดข้อมูล...</p>;
  }

  // ตัดเฉพาะฟิลด์ที่ฟอร์มต้องการ
  const initialData: ActivityPayload = {
    title: detail.title,
    description: detail.description,
    type: detail.type,
    startDate: detail.startDate,
    endDate: detail.endDate,
    maxParticipants: detail.maxParticipants,
  };

  // onSubmit รับเป็น ActivityPayload เท่านั้น
  const handleSubmit = async (data: ActivityPayload) => {
    if (!id) return;
    await activityService.update(id, data);
    navigate('/staff/activities');
  };

  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          แก้ไขกิจกรรม
        </h1>
        <Button variant="outline" onClick={() => navigate('/staff/activities')}>
          ย้อนกลับ
        </Button>
      </div>

      <ActivityForm
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
