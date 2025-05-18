import React, { useState, useMemo, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Users,
  ClipboardList,
  PlusSquare,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

type MenuItem = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isDivider?: boolean;
};

const SidebarLink: React.FC<{
  item: MenuItem;
  hoverBg: string;
  hoverOverlay: string;
  activeNavGradient: string;
  onClick?: () => void;
}> = ({ item, hoverBg, hoverOverlay, activeNavGradient, onClick }) => {
  if (item.isDivider) {
    return <hr className={`my-2 border-t ${hoverOverlay}`} />;
  }
  
  return (
    <NavLink
      to={item.to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300
        ${isActive ? activeNavGradient : `text-red-500 ${hoverBg}`}`
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
  );
};

export default function StaffLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // derive mode from pathname
  const isStaffMode = useMemo(
    () => /^\/staff(?:\/staff|\/activities)/.test(location.pathname),
    [location.pathname]
  );

  const menuItems: MenuItem[] = useMemo(
    () => [
      { to: '/staff', icon: <Home size={20} />, label: 'แดชบอร์ด (นิสิต)' },
      {
        to: '/staff/student/activities',
        icon: <ClipboardList size={20} />,
        label: 'กิจกรรมทั้งหมด',
      },
      {
        to: '/staff/student/my-activities',
        icon: <ClipboardList size={20} />,
        label: 'กิจกรรมของฉัน',
      },
      { to: '/staff/student/profile', icon: <Users size={20} />, label: 'โปรไฟล์' },
      { to: '', icon: null, label: '', isDivider: true },
      { to: '/staff/staff', icon: <Home size={20} />, label: 'แดชบอร์ด (Staff)' },
      {
        to: '/staff/activities',
        icon: <ClipboardList size={20} />,
        label: 'จัดการกิจกรรม',
      },
      {
        to: '/staff/activities/create',
        icon: <PlusSquare size={20} />,
        label: 'สร้างกิจกรรม',
      },
      { to: '/staff/profile', icon: <Users size={20} />, label: 'จัดการผู้ใช้' },
    ],
    []
  );

  const classes = useMemo(() => {
    const bgGradient = isStaffMode
      ? 'bg-gradient-to-br from-violet-100 to-orange-50 dark:from-neutral-900 dark:to-orange-900'
      : 'bg-gradient-to-br from-violet-100 to-violet-50 dark:from-neutral-900 dark:to-neutral-800';
    const navGradient = isStaffMode
      ? 'bg-gradient-to-r from-violet-600 to-orange-500 dark:from-violet-400 dark:to-orange-400'
      : 'bg-gradient-to-r from-violet-600 to-purple-500 dark:from-violet-400 dark:to-purple-400';
    const activeNavGradient = isStaffMode
      ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'
      : 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]';
    const hoverBg = isStaffMode
      ? 'hover:bg-orange-200/20 dark:hover:bg-orange-900/20 hover:text-orange-600'
      : 'hover:bg-violet-200/20 dark:hover:bg-violet-900/20 hover:text-violet-600';
    const hoverOverlay = isStaffMode ? 'bg-orange-400/20' : 'bg-violet-400/20';
    const borderColor = isStaffMode
      ? 'border-orange-300/30 dark:border-orange-900/30'
      : 'border-violet-300/30 dark:border-violet-900/30';

    return { bgGradient, navGradient, activeNavGradient, hoverBg, hoverOverlay, borderColor };
  }, [isStaffMode]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleSwitch = useCallback(() => {
    navigate(isStaffMode ? '/staff' : '/staff/staff');
    setOpen(false);
  }, [isStaffMode, navigate]);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  return (
    <div className={`flex h-screen ${classes.bgGradient} font-sans overflow-hidden transition-colors duration-300`}>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`hidden md:flex flex-col w-72 bg-white/10 dark:bg-neutral-950/10 backdrop-blur-xl shadow-2xl rounded-r-3xl border-r ${classes.borderColor}`}
      >
        <div className="px-6 py-5 flex items-center gap-3">
          <motion.img
            src="/logo.png"
            alt="StaffHub"
            className="h-10 w-10 rounded-full"
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
          <span className={`text-2xl font-extrabold bg-clip-text text-transparent ${classes.navGradient} animate-gradient`}>
            StaffHub
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item, i) => (
            <SidebarLink
              key={i}
              item={item}
              hoverBg={classes.hoverBg}
              hoverOverlay={classes.hoverOverlay}
              activeNavGradient={classes.activeNavGradient}
            />
          ))}
        </nav>

        {/* Mode Switch Button */}
        <div className={`p-4 border-t ${classes.borderColor}`}>
          <motion.button
            onClick={handleSwitch}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white ${classes.navGradient} rounded-xl transition-all shadow-md`}
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`สลับไปยังโหมด${isStaffMode ? 'นิสิต' : 'Staff'}`}
          >
            <RefreshCw size={20} /> โหมด: {isStaffMode ? 'Staff' : 'นิสิต'}
          </motion.button>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-100/20 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            aria-label="ออกจากระบบ"
          >
            <LogOut size={20} /> ออกจากระบบ
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md md:hidden"
            onClick={closeDrawer}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 120, damping: 20 }}
              className={`absolute left-0 top-0 h-full w-72 bg-white/10 dark:bg-neutral-950/10 backdrop-blur-xl shadow-2xl rounded-r-3xl border-r ${classes.borderColor}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 flex items-center justify-between">
                <span className={`text-2xl font-extrabold bg-clip-text text-transparent ${classes.navGradient} animate-gradient`}>
                  StaffHub
                </span>
                <motion.button
                  onClick={closeDrawer}
                  className="text-neutral-500 dark:text-neutral-100 hover:text-orange-600 transition-colors"
                  whileHover={{ rotate: 180, scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={28} />
                </motion.button>
              </div>

              <nav className="px-4 space-y-2">
                {menuItems.map((item, i) => (
                  <SidebarLink
                    key={i}
                    item={item}
                    hoverBg={classes.hoverBg}
                    hoverOverlay={classes.hoverOverlay}
                    activeNavGradient={classes.activeNavGradient}
                    onClick={closeDrawer}
                  />
                ))}
              </nav>

              <div className={`p-4 border-t ${classes.borderColor}`}>
                <motion.button
                  onClick={handleSwitch}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white ${classes.navGradient} rounded-xl transition-all shadow-md`}
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <RefreshCw size={20} /> โหมด: {isStaffMode ? 'Staff' : 'นิสิต'}
                </motion.button>
              </div>

              {/* Add Logout Button for Mobile */}
              <div className="p-4">
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-100/20 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="ออกจากระบบ"
                >
                  <LogOut size={20} /> ออกจากระบบ
                </motion.button>
              </div>

            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg shadow-lg px-6 py-4 flex items-center justify-between border-b ${classes.borderColor}`}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={openDrawer}
              className="md:hidden text-neutral-700 dark:text-neutral-100 hover:text-orange-600 transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={28} />
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.div
                className={`h-12 w-12 rounded-full ${classes.navGradient} flex items-center justify-center text-white font-semibold text-lg shadow-md`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </motion.div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  สวัสดี, {user?.firstname} {user?.lastname}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  รหัส: {user?.student_id}
                </div>
              </div>
            </div>
          </div>
          <motion.button
            onClick={handleSwitch}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white ${classes.navGradient} rounded-lg transition-all shadow-md`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={18} /> {isStaffMode ? 'Staff' : 'นิสิต'}
          </motion.button>
        </motion.header>

        <main className="flex-1 overflow-y-auto bg-violet-50/50 dark:bg-neutral-900/50 p-6 md:p-8 backdrop-blur-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
