import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/charts/StatsCard'
import { activityService } from '@/services/activity.service'
import { userService } from '@/services/user.service'

interface AdminSummary {
  totalUsers: number
  totalActivities: number
  pendingActivities: number
}

export default function Dashboard() {
  const [summary, setSummary] = useState<AdminSummary>({
    totalUsers: 0,
    totalActivities: 0,
    pendingActivities: 0,
  })

  useEffect(() => {
    Promise.all([
      userService.getAll().then((u) => u.length),
      activityService.getAll({ page: 1, limit: 1 }).then((r) => r.total),
      activityService
        .getAll({ page: 1, limit: 1, status: 'PENDING' })
        .then((r) => r.total),
    ]).then(([totalUsers, totalActivities, pendingActivities]) => {
      setSummary({ totalUsers, totalActivities, pendingActivities })
    })
  }, [])

  return (
    <main className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">แดชบอร์ดผู้ดูแลระบบ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="ผู้ใช้ทั้งหมด" value={summary.totalUsers.toString()} />
        <StatsCard title="กิจกรรมทั้งหมด" value={summary.totalActivities.toString()} />
        <StatsCard
          title="รออนุมัติกิจกรรม"
          value={summary.pendingActivities.toString()}
        />
      </div>
    </main>
  )
}
