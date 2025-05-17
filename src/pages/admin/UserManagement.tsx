import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import { userService } from '@/services/user.service'
import type { User } from '@/types/user'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const data = await userService.getAll()
        setUsers(data)
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้')
        console.error('Failed to fetch users:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const toggleBan = async (id: string, ban: boolean) => {
    try {
      await userService.updateBanStatus(id, ban)
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBanned: ban } : u))
      )
    } catch (err) {
      setError(`ไม่สามารถ${ban ? 'แบน' : 'ปลดแบน'}ผู้ใช้ได้`)
      console.error('Failed to update user:', err)
    }
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          ลองใหม่
        </Button>
      </div>
    )
  }

  return (
    <main className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-semibold">จัดการผู้ใช้</h2>
      <DataTable<User>
        columns={[
          { title: 'ID', key: 'id' },
          { title: 'รหัสนิสิต', key: 'sid' },
          { 
            title: 'ชื่อ-สกุล', 
            key: 'firstname',
            render: (u) => `${u.firstname} ${u.lastname}`
          },
          { title: 'บทบาท', key: 'role' },
          {
            title: 'สถานะ',
            key: 'isBanned',
            render: (u) => (u.isBanned ? 'ถูกแบน' : 'ปกติ'),
          },
          {
            title: 'Action',
            key: 'id',
            render: (u) => (
              <Button
                size="sm"
                variant={u.isBanned ? 'outline' : 'default'}  // เปลี่ยนจาก secondary เป็น outline
                onClick={() => toggleBan(u.id, !u.isBanned)}
                disabled={isLoading}
              >
                {u.isBanned ? 'ปลดแบน' : 'แบน'}
              </Button>
            ),
          },
        ]}
        data={users}
        isLoading={isLoading}  // เปลี่ยนจาก loading เป็น isLoading
        className="bg-white rounded-xl shadow"
      />
    </main>
  )
}