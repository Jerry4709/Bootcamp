import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import type { User } from '@/types/user'

// เพิ่ม type สำหรับ confirmation modal
interface ConfirmationModal {
  isOpen: boolean
  type: 'ban' | 'unban' | 'promote'
  user: User | null
  onConfirm: () => void
  onCancel: () => void
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [bannedUsers, setBannedUsers] = useState<Set<number>>(new Set())
  const [confirmModal, setConfirmModal] = useState<ConfirmationModal>({
    isOpen: false,
    type: 'ban',
    user: null,
    onConfirm: () => {},
    onCancel: () => {}
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // เรียก API ไปที่ backend server (port 3000)
        const response = await fetch('http://localhost:3000/api/users', {
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

  const handleBanClick = (user: User, ban: boolean) => {
    setConfirmModal({
      isOpen: true,
      type: ban ? 'ban' : 'unban',
      user,
      onConfirm: () => {
        toggleBan(user.id, ban)
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
    })
  }

  const handlePromoteClick = (user: User) => {
    setConfirmModal({
      isOpen: true,
      type: 'promote',
      user,
      onConfirm: () => {
        promoteToStaff(user.id)
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
    })
  }

  const toggleBan = async (id: number, ban: boolean) => {
    try {
      setIsLoading(true)
      
      const user = users.find(u => u.id === id)
      if (!user) {
        throw new Error('ไม่พบข้อมูลผู้ใช้')
      }

      // Call ban API using existing endpoints
      const response = await fetch('http://localhost:3000/api/user-ban', {
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
                email: user.email 
              }
        ),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
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

      // Show success message
      const action = ban ? 'แบน' : 'ปลดแบน'
      setSuccessMessage(`${action}ผู้ใช้ ${user.firstname} ${user.lastname} สำเร็จ`)
      setTimeout(() => setSuccessMessage(null), 5000) // Clear after 5 seconds

    } catch (err) {
      console.error('Failed to update user ban status:', err)
      setError(`ไม่สามารถ${ban ? 'แบน' : 'ปลดแบน'}ผู้ใช้ได้: ${err instanceof Error ? err.message : 'ข้อผิดพลาดไม่ทราบสาเหตุ'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const promoteToStaff = async (id: number) => {
    try {
      setIsLoading(true)
      
      const user = users.find(u => u.id === id)
      if (!user) {
        throw new Error('ไม่พบข้อมูลผู้ใช้')
      }

      // Call role change API
      const response = await fetch(`http://localhost:3000/api/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'STAFF' }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      // Update local state
      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, role: 'STAFF' } : u)
      )

      // Show success message
      setSuccessMessage(`เลื่อนสถานะ ${user.firstname} ${user.lastname} เป็น Staff สำเร็จ`)
      setTimeout(() => setSuccessMessage(null), 5000) // Clear after 5 seconds

    } catch (err) {
      console.error('Failed to promote user:', err)
      setError(`ไม่สามารถเลื่อนสถานะผู้ใช้ได้: ${err instanceof Error ? err.message : 'ข้อผิดพลาดไม่ทราบสาเหตุ'}`)
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

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                สำเร็จ
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>{successMessage}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="inline-flex bg-green-50 dark:bg-green-900/20 rounded-md p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/40 focus:outline-none"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => handleBanClick(user, !user.is_banned)}
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
                    onClick={() => handlePromoteClick(user)}
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

      {/* Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {confirmModal.type === 'ban' && 'ยืนยันการแบนผู้ใช้'}
              {confirmModal.type === 'unban' && 'ยืนยันการปลดแบนผู้ใช้'}
              {confirmModal.type === 'promote' && 'ยืนยันการเลื่อนสถานะ'}
            </h3>
            
            <div className="mb-6">
              <p className="text-neutral-600 dark:text-neutral-300">
                {confirmModal.type === 'ban' && 
                  `คุณต้องการแบนผู้ใช้ "${confirmModal.user.firstname} ${confirmModal.user.lastname}" หรือไม่?`}
                {confirmModal.type === 'unban' && 
                  `คุณต้องการปลดแบนผู้ใช้ "${confirmModal.user.firstname} ${confirmModal.user.lastname}" หรือไม่?`}
                {confirmModal.type === 'promote' && 
                  `คุณต้องการเลื่อนสถานะ "${confirmModal.user.firstname} ${confirmModal.user.lastname}" เป็น Staff หรือไม่?`}
              </p>
              
              <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded">
                <div className="text-sm">
                  <strong>รหัสนิสิต:</strong> {confirmModal.user.student_id || '-'}
                </div>
                <div className="text-sm">
                  <strong>อีเมล:</strong> {confirmModal.user.email}
                </div>
                <div className="text-sm">
                  <strong>บทบาทปัจจุบัน:</strong> {confirmModal.user.role}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={confirmModal.onCancel}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={confirmModal.onConfirm}
                className={
                  confirmModal.type === 'ban' 
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : confirmModal.type === 'unban'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }
              >
                {confirmModal.type === 'ban' && 'แบน'}
                {confirmModal.type === 'unban' && 'ปลดแบน'}
                {confirmModal.type === 'promote' && 'เลื่อนสถานะ'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}