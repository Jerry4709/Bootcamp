import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { activityService } from '@/services/activity.service'
import type { ActivityDetail } from '@/types/activity'

export default function AdminActivityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<ActivityDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    activityService
      .getById(id)
      .then((data) => setActivity(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size={48} />
      </div>
    )
  }

  if (!activity) {
    return (
      <p className="p-4 text-center text-neutral-700 dark:text-neutral-300">
        ไม่พบข้อมูลกิจกรรม
      </p>
    )
  }

  return (
    <main className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{activity.title}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/activities')}>
          กลับ
        </Button>
      </div>

      {/* Details */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <p>
          <strong>คำอธิบาย:</strong> {activity.description || '-'}
        </p>
        <p>
          <strong>ประเภท:</strong>{' '}
          <span className="px-2 py-1 rounded-full text-sm bg-violet-100 text-violet-800">
            {activity.category}
          </span>
        </p>
        <p>
          <strong>ช่วงเวลา:</strong>{' '}
          {new Date(activity.start_time).toLocaleString('th-TH')} –{' '}
          {new Date(activity.end_time).toLocaleString('th-TH')}
        </p>
        <p>
          <strong>จำนวนรับสมัคร:</strong>{' '}
          {activity.current_participants ?? 0} /{' '}
          {activity.max_participants} คน
        </p>
        <p>
          <strong>สถานะ:</strong>{' '}
          <span className={`px-2 py-1 rounded-full text-sm ${
            activity.status === 'อนุมัติ' 
              ? 'bg-green-100 text-green-800'
              : activity.status === 'รออนุมัติ'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {activity.status}
          </span>
        </p>
      </section>
    </main>
  )
}
