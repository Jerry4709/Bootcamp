import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import type { ActivityType, ActivityPayload } from '@/types/activity';

const TYPE_OPTIONS = [
  { label: 'อาสา', value: 'VOLUNTEER' },
  { label: 'ช่วยงาน', value: 'WORK' },
  { label: 'อบรม', value: 'TRAINING' },
];

export interface ActivityFormProps {
  /** ข้อมูลเบื้องต้น (edit) */
  initialData?: ActivityPayload;
  /** เรียกเมื่อกด submit */
  onSubmit: (data: ActivityPayload) => Promise<void> | void;
  /** กำลังประมวลผล */
  isLoading?: boolean;
}

export default function ActivityForm({
  initialData,
  onSubmit,
  isLoading,
}: ActivityFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<ActivityType>(initialData?.type || 'VOLUNTEER');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [maxParticipants, setMaxParticipants] = useState<number>(
    initialData?.maxParticipants ?? 1
  );

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, description, type, startDate, endDate, maxParticipants });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-6 bg-white/80 dark:bg-neutral-800/80 p-6 rounded-xl shadow-md"
    >
      {/* Title */}
      <Input
        label="ชื่อกิจกรรม"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
          รายละเอียดกิจกรรม
        </label>
        <textarea
          className="mt-1 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          required
        />
      </div>

      {/* Type & Max Participants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="ประเภทกิจกรรม"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.currentTarget.value as ActivityType)}
          className="w-full"
        />
        <Input
          label="จำนวนรับสมัครสูงสุด"
          type="number"
          min={1}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(Number(e.currentTarget.value))}
          required
        />
      </div>

      {/* Start & End Date/Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="เริ่มต้น (ว/ด/ป เวลา)"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.currentTarget.value)}
          required
        />
        <Input
          label="สิ้นสุด (ว/ด/ป เวลา)"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.currentTarget.value)}
          required
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'กำลังบันทึก...' : initialData ? 'บันทึกการแก้ไข' : 'สร้างกิจกรรม'}
      </Button>
    </form>
  );
}
