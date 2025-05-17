import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, User, Activity, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock useAuth hook (replace with your actual auth implementation)
const useAuth = () => ({
  user: {
    firstname: 'John',
    lastname: 'Doe',
    sid: '123456789',
  },
  logout: () => console.log('Logged out'),
});

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { to: '/student', icon: <Home size={20} />, label: 'แดชบอร์ด' },
    { to: '/student/activities', icon: <Activity size={20} />, label: 'กิจกรรมทั้งหมด' },
    { to: '/student/my-activities', icon: <Activity size={20} />, label: 'กิจกรรมของฉัน' },
    { to: '/student/profile', icon: <User size={20} />, label: 'โปรไฟล์' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-violet-100 to-violet-50 dark:from-neutral-900 dark:to-neutral-800 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden md:flex flex-col w-72 bg-white/10 dark:bg-neutral-950/10 backdrop-blur-xl shadow-2xl rounded-r-3xl border-r border-violet-300/30 dark:border-violet-900/30"
      >
        <div className="px-6 py-5 flex items-center gap-3">
          <motion.img
            src="/logo.png"
            alt="VolunteerHub"
            className="h-10 w-10 rounded-full"
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-500 dark:from-violet-400 dark:to-purple-400 animate-gradient">
            VolunteerHub
          </span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                  : 'text-gray-600 hover:bg-violet-200/20 dark:hover:bg-violet-900/20 hover:text-violet-600'}`
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
        <div className="p-4 border-t border-violet-300/30 dark:border-violet-900/30">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-100/20 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            aria-label="ออกจากระบบ"
          >
            <LogOut size={20} />
            ออกจากระบบ
          </motion.button>
        </div>
      </motion.aside>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 120, damping: 20 }}
              className="absolute left-0 top-0 h-full w-72 bg-white/10 dark:bg-neutral-950/10 backdrop-blur-xl shadow-2xl rounded-r-3xl border-r border-violet-300/30 dark:border-violet-900/30"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 flex items-center justify-between">
                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-500 dark:from-violet-400 dark:to-purple-400 animate-gradient">
                  VolunteerHub
                </span>
                <motion.button
                  onClick={() => setOpen(false)}
                  className="text-neutral-500 dark:text-neutral-100 hover:text-violet-600 transition-colors"
                  whileHover={{ rotate: 180, scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="ปิดเมนู"
                >
                  <X size={28} />
                </motion.button>
              </div>
              <nav className="px-4 space-y-2">
                {menuItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                        : 'text-gray-600 hover:bg-violet-200/20 dark:hover:bg-violet-900/20 hover:text-violet-600'}`
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
              <div className="p-4 border-t border-violet-300/30 dark:border-violet-900/30">
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-100/20 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="ออกจากระบบ"
                >
                  <LogOut size={20} />
                  ออกจากระบบ
                </motion.button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg shadow-lg px-6 py-4 flex items-center justify-between border-b border-violet-300/30 dark:border-violet-900/30"
        >
          <div className="flex items-center gap-4">
            <motion.button
              className="md:hidden text-neutral-700 dark:text-neutral-100 hover:text-violet-600 transition-colors"
              onClick={() => setOpen(true)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="เปิดเมนู"
            >
              <Menu size={28} />
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.div
                className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-md"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </motion.div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  {user?.firstname} {user?.lastname}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  รหัสนักศึกษา: {user?.sid}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-violet-50/50 dark:bg-neutral-900/50 p-6 md:p-8 backdrop-blur-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}