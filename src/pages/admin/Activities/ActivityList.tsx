import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import { usePaginate } from '@/hooks/usePaginate'
import { activityService } from '@/services/activity.service'
import type { Activity } from '@/types/activity'

export default function AdminActivityList() {
  const { page, limit, setPage } = usePaginate()
  const [data, setData] = useState<{ items: Activity[]; total: number }>({
    items: [],
    total: 0,
  })

  useEffect(() => {
    activityService.getAll({ page, limit }).then(setData)
  }, [page, limit])

  return (
    <main className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-semibold">กิจกรรมทั้งหมด</h2>
      <DataTable<Activity>
        columns={[
          { title: 'ชื่อกิจกรรม', key: 'title' },
          { title: 'ประเภท', key: 'type' },
          {
            title: 'วันที่',
            key: 'startDate',
            render: (a) => `${a.startDate} – ${a.endDate}`,
          },
          { title: 'สถานะ', key: 'status' },
          {
            title: 'Actions',
            key: 'id',
            render: (a) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.assign(`/admin/activities/${a.id}`)}
                >
                  รายละเอียด
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    window.location.assign(`/admin/activities/${a.id}/edit`)
                  }
                >
                  แก้ไข
                </Button>
              </div>
            ),
          },
        ]}
        data={data.items}
        className="bg-white rounded-xl shadow"
      />
      <Pagination page={page} total={data.total} limit={limit} onChange={setPage} />
    </main>
  )
}
