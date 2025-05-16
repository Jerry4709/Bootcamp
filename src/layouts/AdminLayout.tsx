// src/layouts/AdminLayout.tsx
import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, Home, ClipboardList, CheckSquare, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const menuItems = [
    { to: '/admin', icon: <Home size={20} />, label: 'แดชบอร์ด' },
    { to: '/admin/activities', icon: <ClipboardList size={20} />, label: 'กิจกรรมทั้งหมด' },
    { to: '/admin/approval', icon: <CheckSquare size={20} />, label: 'ศูนย์อนุมัติ' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'จัดการผู้ใช้' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Floating particles background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500/10 dark:bg-indigo-400/10"
            initial={{ scale: 0, x: Math.random() * 100, y: Math.random() * 100, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0],
              rotate: 360
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: Math.random() * 30 + 10,
              height: Math.random() * 30 + 10
            }}
          />
        ))}
      </div>

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="hidden md:flex flex-col w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(99,102,241,0.15)] rounded-r-3xl border-r border-white/20 dark:border-gray-700/20"
      >
        <div className="px-6 py-5 flex items-center gap-3 border-b border-indigo-200/30 dark:border-indigo-700/30">
          <motion.div whileHover={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.6 }}>
            <img
              src="/logo.png"
              alt="AdminHub"
              className="h-12 w-12 rounded-xl transform transition-transform duration-300 hover:scale-110"
            />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent animate-text">
            AdminHub
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600/90 to-blue-500/90 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300'}`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    className="z-10 flex items-center gap-4"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.div>

                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 bg-indigo-500/5 rounded-xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      className="absolute right-4 w-1.5 h-6 bg-white rounded-full"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.4, ease: "backOut" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-indigo-300/30 dark:border-indigo-700/30 flex justify-end">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-colors"
          >
            <motion.div animate={{ x: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <LogOut size={18} />
            </motion.div>
            <span>ออกจากระบบ</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-r-3xl border-r border-white/20 dark:border-gray-700/20 md:hidden"
            >
              <div className="px-6 py-5 flex items-center justify-between border-b border-indigo-200/30 dark:border-indigo-700/30">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  AdminHub
                </span>
                <motion.button onClick={() => setOpen(false)} whileHover={{ rotate: 90 }}>
                  <X size={28} className="text-gray-700 dark:text-gray-200" />
                </motion.button>
              </div>

              <nav className="px-4 space-y-1.5 mt-4">
                {menuItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-indigo-600/90 to-blue-500/90 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300'}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.icon}
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.div
                            className="absolute right-4 w-1.5 h-6 bg-white rounded-full"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.4, ease: "backOut" }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="px-4 py-4 border-t border-indigo-200/30 dark:border-indigo-700/30 flex justify-end">
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-colors"
                >
                  <LogOut size={18} />
                  <span>ออกจากระบบ</span>
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-6 py-4 shadow-sm shadow-indigo-100/30 dark:shadow-gray-800 border-b border-white/20 dark:border-gray-700/20"
        >
          <motion.button
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
          >
            <Menu size={26} className="text-indigo-600 dark:text-indigo-400" />
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.div
              className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-medium shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              {user?.firstname?.[0]}
            </motion.div>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {user?.firstname} {user?.lastname}
            </span>
          </div>
        </motion.header>

        {/* Page outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
