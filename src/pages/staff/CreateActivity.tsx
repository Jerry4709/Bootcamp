// src/pages/staff/Activities/CreateActivity.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityForm from '@/components/forms/ActivityForm';
import Button from '@/components/ui/Button';
import type { ActivityPayload } from '@/types/activity';
import { activityService } from '@/services/activity.service';

export default function CreateActivity() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ActivityPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      await activityService.create(data);
      navigate('/staff/activities');
    } catch (err) {
      setError('ไม่สามารถสร้างกิจกรรมได้ กรุณาลองใหม่อีกครั้ง');
      console.error('Failed to create activity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          สร้างกิจกรรมใหม่
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/staff/activities')}
          disabled={isLoading}
        >
          ย้อนกลับ
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <ActivityForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </main>
  );
}
