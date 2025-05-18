import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import { userService } from '@/services/user.service'
import type { User } from '@/types/user'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bannedUsers, setBannedUsers] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // ใช้ axios โดยตรงเพื่อโหลดข้อมูลผู้ใช้ทั้งหมด
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('User data response:', data)

        // Handle different response formats
        let usersList: User[] = []
        
        if (data.success && Array.isArray(data.data)) {
          usersList = data.data
        } else if (Array.isArray(data.data)) {
          usersList = data.data
        } else if (Array.isArray(data)) {
          usersList = data
        } else {
          throw new Error('Invalid response format')
        }

        setUsers(usersList)
        
        // Track banned users
        const banned = new Set<number>()
        usersList.forEach(user => {
          if (user.is_banned) {
            banned.add(user.id)
          }
        })
        setBannedUsers(banned)

      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleBan = async (id: number, ban: boolean) => {
    try {
      setIsLoading(true)
      
      // Call ban API
      const response = await fetch('/api/user-ban', {
        method: ban ? 'POST' : 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          ban 
            ? { 
                user_id: id, 
                reason: 'แบนโดยผู้ดูแลระบบ' 
              }
            : { 
                email: users.find(u => u.id === id)?.email 
              }
        ),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Update local state
      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, is_banned: ban } : u)
      )

      // Update banned users set
      setBannedUsers(prev => {
        const newSet = new Set(prev)
        if (ban) {
          newSet.add(id)
        } else {
          newSet.delete(id)
        }
        return newSet
      })

    } catch (err) {
      console.error('Failed to update user ban status:', err)
      setError(`ไม่สามารถ${ban ? 'แบน' : 'ปลดแบน'}ผู้ใช้ได้: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const promoteToStaff = async (id: number) => {
    try {
      setIsLoading(true)
      
      // ใช้ userService แทน
      await userService.changeUserRole(id, 'STAFF')

      // Update local state
      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, role: 'STAFF' } : u)
      )

    } catch (err) {
      console.error('Failed to promote user:', err)
      setError(`ไม่สามารถเลื่อนสถานะผู้ใช้ได้: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (error && users.length === 0) {
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

  const RoleBadge = ({ role }: { role: string }) => {
    const getRoleColor = (role: string) => {
      switch (role) {
        case 'ADMIN':
          return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100'
        case 'STAFF':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100'
        case 'STUDENT':
          return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-100'
      }
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
        {role}
      </span>
    )
  }

  const StatusBadge = ({ isBanned }: { isBanned: boolean }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      isBanned 
        ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100'
        : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100'
    }`}>
      {isBanned ? 'ถูกแบน' : 'ปกติ'}
    </span>
  )

  return (
    <main className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          จัดการผู้ใช้
        </h2>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {users.length} ผู้ใช้ทั้งหมด ({bannedUsers.size} คนถูกแบน)
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                เกิดข้อผิดพลาด
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">ผู้ใช้ทั้งหมด</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">{users.length}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600 dark:text-green-400">ผู้ใช้ปกติ</div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {users.filter(u => !u.is_banned).length}
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg shadow">
          <div className="text-sm text-red-600 dark:text-red-400">ผู้ใช้ถูกแบน</div>
          <div className="text-2xl font-bold text-red-800 dark:text-red-200">
            {bannedUsers.size}
          </div>
        </div>
      </div>

      {/* User Table */}
      <DataTable<User>
        columns={[
          { 
            title: 'ID', 
            key: 'id',
            render: (user) => (
              <span className="font-mono text-sm">{user.id}</span>
            )
          },
          { 
            title: 'รหัสนิสิต', 
            key: 'student_id',
            render: (user) => (
              <span className="font-mono">
                {user.student_id || '-'}
              </span>
            )
          },
          { 
            title: 'ชื่อ-สกุล', 
            key: 'firstname',
            render: (user) => (
              <div>
                <div className="font-medium">{user.firstname} {user.lastname}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</div>
              </div>
            )
          },
          { 
            title: 'คณะ/สาขา', 
            key: 'faculty_name',
            render: (user) => (
              <div className="text-sm">
                <div>{user.faculty_name || '-'}</div>
                <div className="text-neutral-500 dark:text-neutral-400">
                  {user.major_name || '-'}
                </div>
              </div>
            )
          },
          { 
            title: 'บทบาท', 
            key: 'role',
            render: (user) => <RoleBadge role={user.role} />
          },
          {
            title: 'สถานะ',
            key: 'is_banned',
            render: (user) => <StatusBadge isBanned={user.is_banned} />
          },
          {
            title: 'เข้าร่วมเมื่อ',
            key: 'created_at',
            render: (user) => (
              <div className="text-sm">
                {new Date(user.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )
          },
          {
            title: 'จัดการ',
            key: 'id',
            render: (user) => (
              <div className="flex gap-2 flex-wrap">
                {/* Ban/Unban Button */}
                <Button
                  size="sm"
                  onClick={() => toggleBan(user.id, !user.is_banned)}
                  disabled={isLoading}
                  className={
                    user.is_banned 
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }
                >
                  {user.is_banned ? 'ปลดแบน' : 'แบน'}
                </Button>

                {/* Promote to Staff Button (only for students) */}
                {user.role === 'STUDENT' && !user.is_banned && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => promoteToStaff(user.id)}
                    disabled={isLoading}
                  >
                    เลื่อนเป็น Staff
                  </Button>
                )}

                {/* Admin badge (non-clickable) */}
                {user.role === 'ADMIN' && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                    ผู้ดูแลระบบ
                  </span>
                )}
              </div>
            ),
          },
        ]}
        data={users}
        isLoading={isLoading}
        className="bg-white/80 dark:bg-neutral-800/80 rounded-xl shadow-lg"
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span>กำลังดำเนินการ...</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}