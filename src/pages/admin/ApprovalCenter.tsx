import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { activityService } from '@/services/activity.service'
import type { Activity } from '@/types/activity'

export default function ApprovalCenter() {
  const [pending, setPending] = useState<Activity[]>([])

  useEffect(() => {
    // เรียก getAll และกรองสถานะ “รออนุมัติ”
    activityService
      .getAll({ page: 1, limit: 9999, status: 'PENDING' })
      .then(({ items }) => setPending(items))
  }, [])

  const handle = async (id: string, approve: boolean) => {
    // ใช้ approveApplicant / rejectApplicant สำหรับ admin
    if (approve) await activityService.approveApplicant(id, id)
    else await activityService.rejectApplicant(id, id)

    setPending((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <main className="p-4 md:p-8 space-y-4">
      <h2 className="text-2xl font-semibold">กิจกรรมที่รออนุมัติ</h2>
      <ul className="space-y-3">
        {pending.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
          >
            <span>{a.title}</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handle(a.id, true)}>
                อนุมัติ
              </Button>
              <Button size="sm" variant="outline" onClick={() => handle(a.id, false)}>
                ปฏิเสธ
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
