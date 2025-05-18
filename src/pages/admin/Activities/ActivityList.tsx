// src/pages/admin/Activities/ActivityList.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import { usePaginate } from '@/hooks/usePaginate'
import { activityService } from '@/services/activity.service'
import type { Activity, ActivityCategory, ActivityStatus } from '@/types/activity'

const STATUS_OPTIONS = [
  { label: 'ทุกสถานะ', value: '' },
  { label: 'รออนุมัติ', value: 'รออนุมัติ' },
  { label: 'อนุมัติ', value: 'อนุมัติ' },
  { label: 'ปฏิเสธ', value: 'ปฏิเสธ' },
  { label: 'เสร็จสิ้น', value: 'เสร็จสิ้น' },
  { label: 'ยกเลิก', value: 'ยกเลิก' },
]

const CATEGORY_OPTIONS = [
  { label: 'ทุกประเภท', value: '' },
  { label: 'อาสา', value: 'อาสา' },
  { label: 'ช่วยงาน', value: 'ช่วยงาน' },
  { label: 'อบรม', value: 'อบรม' },
]

export default function AdminActivityList() {
  const navigate = useNavigate()
  const { page, limit, setPage } = usePaginate()
  const [status, setStatus] = useState<ActivityStatus | ''>('')
  const [category, setCategory] = useState<ActivityCategory | ''>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState<{ items: Activity[]; total: number }>({
    items: [],
    total: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch activities - แสดงทุกกิจกรรมไม่กรองตาม role
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching all activities with params:', {
          page,
          limit,
          status: status || undefined,
          category: category || undefined,
          search: searchQuery || undefined,
        })
        
        // แก้ไข: ใช้ getAll แทน getApproved เพื่อให้ Admin เห็นทุกกิจกรรม
        const result = await activityService.getAll({
          page,
          limit,
          status: status || undefined,
          category: category || undefined,
          search: searchQuery || undefined,
        })
        
        console.log('API response:', result)
        setData(result)
      } catch (err) {
        console.error('Error fetching activities:', err)
        setError('ไม่สามารถโหลดข้อมูลกิจกรรมได้: ' + (err instanceof Error ? err.message : 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [page, limit, status, category, searchQuery])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [status, category, searchQuery, setPage])

  // Handle approval/rejection
  const handleApproval = async (id: number, approve: boolean) => {
    try {
      if (approve) {
        await activityService.approveActivity(id)
      } else {
        await activityService.rejectActivity(id)
      }
      
      // Refresh data after approval/rejection
      const result = await activityService.getAll({
        page,
        limit,
        status: status || undefined,
        category: category || undefined,
        search: searchQuery || undefined,
      })
      setData(result)
      
      // Show success message
      alert(approve ? 'อนุมัติกิจกรรมสำเร็จ' : 'ปฏิเสธกิจกรรมสำเร็จ')
    } catch (err) {
      console.error('Error updating activity status:', err)
      alert('ไม่สามารถอัพเดทสถานะกิจกรรมได้')
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'อนุมัติ':
          return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100'
        case 'รออนุมัติ':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100'
        case 'ปฏิเสธ':
          return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100'
        case 'เสร็จสิ้น':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100'
        case 'ยกเลิก':
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-100'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-100'
      }
    }

    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    )
  }

  // Category badge component
  const CategoryBadge = ({ category }: { category: string }) => {
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'อาสา':
          return 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-100'
        case 'ช่วยงาน':
          return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100'
        case 'อบรม':
          return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-100'
      }
    }

    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
        {category}
      </span>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          กิจกรรมทั้งหมด
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                เชื่อมต่อ API ไม่สำเร็จ
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  size="sm"
                >
                  ลองใหม่
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          กิจกรรมทั้งหมด (Administrator)
        </h2>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          แสดง {data.items.length} จาก {data.total} รายการ
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white/50 dark:bg-neutral-800/50 rounded-xl backdrop-blur-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            ค้นหา
          </label>
          <input
            type="text"
            placeholder="ค้นหากิจกรรม..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <Select
          label="สถานะ"
          value={status}
          onChange={(e) => setStatus(e.target.value as ActivityStatus | '')}
          options={STATUS_OPTIONS}
        />

        <Select
          label="ประเภทกิจกรรม"
          value={category}
          onChange={(e) => setCategory(e.target.value as ActivityCategory | '')}
          options={CATEGORY_OPTIONS}
        />

        <div className="flex items-end">
          <Button
            onClick={() => {
              setStatus('')
              setCategory('')
              setSearchQuery('')
            }}
            variant="outline"
            className="w-full"
          >
            ล้างตัวกรอง
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<Activity>
        columns={[
          { 
            title: 'ชื่อกิจกรรม', 
            key: 'title',
            render: (activity) => (
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {activity.title}
              </div>
            )
          },
          { 
            title: 'ผู้สร้าง',
            key: 'creator_name',
            render: (activity) => (
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {activity.creator_name || '-'}
              </div>
            )
          },
          { 
            title: 'ประเภท', 
            key: 'category',
            render: (activity) => <CategoryBadge category={activity.category} />
          },
          {
            title: 'วันที่เริ่ม',
            key: 'start_time',
            render: (activity) => (
              <div className="text-sm">
                <div>{new Date(activity.start_time).toLocaleDateString('th-TH')}</div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  {new Date(activity.start_time).toLocaleTimeString('th-TH', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            )
          },
          {
            title: 'ผู้เข้าร่วม',
            key: 'max_participants',
            render: (activity) => (
              <div className="text-sm">
                <div className="font-medium">
                  {activity.current_participants || 0} / {activity.max_participants}
                </div>
                <div className="text-neutral-500 dark:text-neutral-400">คน</div>
              </div>
            )
          },
          { 
            title: 'สถานะ', 
            key: 'status',
            render: (activity) => <StatusBadge status={activity.status} />
          },
          {
            title: 'จัดการ',
            key: 'id',
            render: (activity) => (
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/activities/${activity.id}`)}
                >
                  ดูรายละเอียด
                </Button>
                
                {/* เฉพาะกิจกรรมที่รออนุมัติเท่านั้นที่จะแสดงปุ่ม อนุมัติ/ปฏิเสธ */}
                {activity.status === 'รออนุมัติ' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApproval(activity.id, true)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      อนุมัติ
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproval(activity.id, false)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      ปฏิเสธ
                    </Button>
                  </>
                )}
                
                {/* แสดงข้อมูลผู้สมัครสำหรับกิจกรรมที่อนุมัติแล้ว */}
                {activity.status === 'อนุมัติ' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/admin/activities/${activity.id}/applicants`)}
                  >
                    ผู้สมัคร
                  </Button>
                )}
              </div>
            ),
          },
        ]}
        data={data.items}
        isLoading={loading}
        className="bg-white/80 dark:bg-neutral-800/80 rounded-xl shadow-lg"
      />

      {/* Pagination */}
      {data.total > limit && (
        <div className="flex justify-center">
          <Pagination 
            page={page} 
            total={data.total} 
            limit={limit} 
            onChange={setPage} 
          />
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">ทั้งหมด</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">{data.total}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg shadow">
          <div className="text-sm text-yellow-600 dark:text-yellow-400">รออนุมัติ</div>
          <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
            {data.items.filter(item => item.status === 'รออนุมัติ').length}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600 dark:text-green-400">อนุมัติแล้ว</div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {data.items.filter(item => item.status === 'อนุมัติ').length}
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow">
          <div className="text-sm text-blue-600 dark:text-blue-400">เสร็จสิ้น</div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {data.items.filter(item => item.status === 'เสร็จสิ้น').length}
          </div>
        </div>
      </div>
    </main>
  )
}