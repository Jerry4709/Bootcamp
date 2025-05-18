// src/pages/admin/ApprovalCenter.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { activityService } from '@/services/activity.service'
import type { Activity } from '@/types/activity'

export default function ApprovalCenter() {
  const navigate = useNavigate()
  const [pending, setPending] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<Record<number, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPendingActivities = async () => {
      try {
        setLoading(true)
        setError(null)
        const activities = await activityService.getPendingActivities()
        setPending(activities)
      } catch (err) {
        console.error('Error fetching pending activities:', err)
        setError('ไม่สามารถโหลดข้อมูลกิจกรรมที่รออนุมัติได้')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingActivities()
  }, [])

  const handleApproval = async (id: number, approve: boolean) => {
    try {
      setProcessing(prev => ({ ...prev, [id]: true }))
      
      if (approve) {
        await activityService.approveActivity(id)
      } else {
        await activityService.rejectActivity(id)
      }

      // Remove from pending list
      setPending(prev => prev.filter(activity => activity.id !== id))
      
      // Show success message
      alert(approve ? 'อนุมัติกิจกรรมสำเร็จ' : 'ปฏิเสธกิจกรรมสำเร็จ')
    } catch (err) {
      console.error('Error updating activity status:', err)
      alert('ไม่สามารถอัพเดทสถานะกิจกรรมได้')
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }))
    }
  }

  if (loading) {
    return (
      <main className="p-4 md:p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          ศูนย์อนุมัติกิจกรรม
        </h2>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-neutral-500 dark:text-neutral-400">กำลังโหลด...</span>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-4 md:p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          ศูนย์อนุมัติกิจกรรม
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            ลองใหม่
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          ศูนย์อนุมัติกิจกรรม
        </h2>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {pending.length} กิจกรรมรออนุมัติ
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            ไม่มีกิจกรรมรออนุมัติ
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            กิจกรรมทั้งหมดได้รับการอนุมัติแล้ว
          </p>
          <Button
            onClick={() => navigate('/admin/activities')}
            className="mt-4"
            variant="outline"
          >
            ดูกิจกรรมทั้งหมด
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pending.map((activity) => (
            <div
              key={activity.id}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-2">
                    {activity.title}
                  </h3>
                  <span className="flex-shrink-0 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100 rounded-full text-xs font-medium">
                    รออนุมัติ
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.category === 'อาสาสมัคร'
                      ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-100'
                      : activity.category === 'กิจกรรมช่วยงาน'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100'
                  }`}>
                    {activity.category}
                  </span>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4">
                  {activity.description || 'ไม่มีรายละเอียด'}
                </p>
              </div>

              {/* Details */}
              <div className="px-6 pb-4 space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400 w-20">วันเริ่ม:</span>
                  <span className="text-neutral-900 dark:text-white">
                    {new Date(activity.start_time).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400 w-20">เวลา:</span>
                  <span className="text-neutral-900 dark:text-white">
                    {new Date(activity.start_time).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {new Date(activity.end_time).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} น.
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400 w-20">ผู้เข้าร่วม:</span>
                  <span className="text-neutral-900 dark:text-white">
                    สูงสุด {activity.max_participants} คน
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 border-t border-neutral-100 dark:border-neutral-700">
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate(`/admin/activities/${activity.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    ดูรายละเอียด
                  </Button>
                  <Button
                    onClick={() => handleApproval(activity.id, true)}
                    disabled={processing[activity.id]}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    {processing[activity.id] ? 'กำลังอนุมัติ...' : 'อนุมัติ'}
                  </Button>
                  <Button
                    onClick={() => handleApproval(activity.id, false)}
                    disabled={processing[activity.id]}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {processing[activity.id] ? 'กำลังปฏิเสธ...' : 'ปฏิเสธ'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}