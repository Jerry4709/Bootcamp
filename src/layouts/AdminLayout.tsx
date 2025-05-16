// src/layouts/AdminLayout.tsx
import { useState, useMemo } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X, Home, ClipboardList, CheckSquare, Users, PlusSquare, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  // Check if current route is staff mode
  const isStaffMode = useMemo(
    () => /^\/admin\/staff-/.test(location.pathname),
    [location.pathname]
  )

  const menuItems = [
    // Admin Mode
    { to: '/admin', icon: <Home size={20} />, label: 'แดชบอร์ด (Admin)' },
    { to: '/admin/activities', icon: <ClipboardList size={20} />, label: 'กิจกรรมทั้งหมด' },
    { to: '/admin/approval', icon: <CheckSquare size={20} />, label: 'ศูนย์อนุมัติ' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'จัดการผู้ใช้' },
    { to: '', icon: null, label: '', isDivider: true },
    // Staff Mode
    { to: '/admin/staff-activities', icon: <ClipboardList size={20} />, label: 'จัดการกิจกรรม (Staff)' },
    { to: '/admin/staff-activities/create', icon: <PlusSquare size={20} />, label: 'สร้างกิจกรรม' },
  ]

  const classes = useMemo(() => ({
    bgGradient: isStaffMode
      ? 'bg-gradient-to-br from-violet-100 to-orange-50 dark:from-neutral-900 dark:to-orange-900'
      : 'bg-gradient-to-br from-blue-100 to-emerald-50 dark:from-slate-900 dark:to-emerald-900',
    navGradient: isStaffMode
      ? 'bg-gradient-to-r from-violet-600 to-orange-500'
      : 'bg-gradient-to-r from-blue-600 to-emerald-500',
    activeNavGradient: isStaffMode
      ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'
      : 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    hoverBg: isStaffMode
      ? 'hover:bg-orange-200/20 dark:hover:bg-orange-900/20 hover:text-orange-600'
      : 'hover:bg-emerald-200/20 dark:hover:bg-emerald-900/20 hover:text-emerald-600',
    borderColor: isStaffMode
      ? 'border-orange-300/30 dark:border-orange-900/30'
      : 'border-emerald-300/30 dark:border-emerald-900/30'
  }), [isStaffMode])

  const handleSwitch = () => {
    navigate(isStaffMode ? '/admin' : '/admin/staff-activities')
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`flex h-screen ${classes.bgGradient} overflow-hidden`}>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`hidden md:flex flex-col w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl shadow-2xl rounded-r-3xl border-r ${classes.borderColor}`}
      >
        {/* Logo section */}
        <div className="px-6 py-5 flex items-center gap-3">
          <motion.img
            src="/logo.png"
            alt="AdminHub"
            className="h-10 w-10 rounded-full"
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          />
          <span className={`text-2xl font-bold bg-clip-text text-transparent ${classes.navGradient}`}>
            AdminHub
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {menuItems.map((item, i) => (
            item.isDivider ? (
              <hr key={i} className={`my-2 border-t ${classes.borderColor}`} />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300
                  ${isActive ? classes.activeNavGradient : `text-gray-600 ${classes.hoverBg}`}`
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
            )
          ))}
        </nav>

        {/* Mode Switch Button */}
        <div className={`p-4 border-t ${classes.borderColor}`}>
          <motion.button
            onClick={handleSwitch}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white ${classes.navGradient} rounded-xl shadow-md`}
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
          >
            <RefreshCw size={20} />
            โหมด: {isStaffMode ? 'Staff' : 'Admin'}
          </motion.button>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-100/20 rounded-xl"
          >
            <LogOut size={20} />
            ออกจากระบบ
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
