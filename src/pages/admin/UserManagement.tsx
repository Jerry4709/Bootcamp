import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import { userService } from '@/services/user.service'
import type { User } from '@/types/user'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [userBans, setUserBans] = useState<Record<number, number>>({}) // เก็บจำนวนครั้งที่โดนแบนแยกต่างหาก
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        
        // นับจำนวนครั้งที่โดนแบนของแต่ละ user

        setUsers(users)
       
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้')
        console.error('Failed to fetch users:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleBan = async (id: number, ban: boolean) => {
    try {
      await userService.updateBanStatus(String(id), ban)
      // อัพเดท UI
      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, is_banned: ban } : u)
      )
      if (ban) {
        // เพิ่มจำนวนครั้งที่โดนแบน
        setUserBans(prev => ({
          ...prev,
          [id]: (prev[id] || 0) + 1
        }))
      }
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
          { title: 'รหัสนิสิต', key: 'student_id' },
          { 
            title: 'ชื่อ-สกุล', 
            key: 'firstname',
            render: (u) => `${u.firstname} ${u.lastname}`
          },
          { 
            title: 'คณะ', 
            key: 'faculty_name',
            render: (u) => u.faculty_name || '-'
          },
          { 
            title: 'สาขา', 
            key: 'major_name',
            render: (u) => u.major_name || '-'
          },
          { title: 'บทบาท', key: 'role' },
          {
            title: 'สถานะ',
            key: 'is_banned',
            render: (u) => (u.is_banned ? (
              <span className="text-red-500">
                ถูกแบน ({userBans[u.id] || 0} ครั้ง)
              </span>
            ) : (
              <span className="text-green-500">ปกติ</span>
            )),
          },
          {
            title: 'เข้าร่วมเมื่อ',
            key: 'created_at',
            render: (u) => new Date(u.created_at).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          },
          {
            title: 'Action',
            key: 'id',
            render: (u) => (
              <Button
                size="sm"
                variant={u.is_banned ? 'outline' : 'default'}
                onClick={() => toggleBan(u.id, !u.is_banned)}
                disabled={isLoading}
              >
                {u.is_banned ? 'ปลดแบน' : 'แบน'}
              </Button>
            ),
          },
        ]}
        data={users}
        isLoading={isLoading}
        className="bg-white rounded-xl shadow"
      />
    </main>
  )
}
