import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { activityService } from '@/services/activity.service'
import { userService } from '@/services/user.service'

interface AdminSummary {
  totalUsers: number
  totalActivities: number
  pendingActivities: number
}

// StatsCard Component
interface StatsCardProps {
  title: string
  value: string
  className?: string
}

const StatsCard = ({ title, value, className = '' }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`
      card hover:scale-105 transition-transform duration-300
      ${className}
    `}
  >
    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
      {title}
    </h3>
    <p className="text-3xl font-bold mt-2 text-gradient-primary">
      {value}
    </p>
  </motion.div>
)

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
        .getAll({ page: 1, limit: 1, status: 'รออนุมัติ' }) // แก้ไขจาก 'PENDING' เป็น 'รออนุมัติ'
        .then((r) => r.total),
    ]).then(([totalUsers, totalActivities, pendingActivities]) => {
      setSummary({ totalUsers, totalActivities, pendingActivities })
    })
  }, [])

  return (
    <main className="p-4 md:p-8 space-y-6">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gradient-primary"
      >
        แดชบอร์ดผู้ดูแลระบบ
      </motion.h1>
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
