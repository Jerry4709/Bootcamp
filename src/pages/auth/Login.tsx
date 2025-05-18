import { useState , useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link , useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';


export default function Login() {
  const navigate = useNavigate();
  const { loginWithCredentials, user, isAuthReady } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ตรวจสอบ user ที่มีอยู่แล้วเมื่อ component mount หรือ auth state เปลี่ยน
  useEffect(() => {
    if (isAuthReady && user && location.pathname === '/login') {
      let redirectPath = '/unauthorized';
      
      switch (user.role) {
        case 'STUDENT':
          redirectPath = '/student';
          break;
        case 'STAFF':
          redirectPath = '/staff';
          break;
        case 'ADMIN':
          redirectPath = '/admin';
          break;
      }
      
      // ใช้ replace: true เพื่อป้องกันการกลับมาที่หน้า login
      navigate(redirectPath, { replace: true });
    }
  }, [user, isAuthReady, location.pathname, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ใช้ loginWithCredentials จาก useAuth
      const result = await loginWithCredentials(email, password);
      
      // Route ตาม role ของผู้ใช้
      let redirectPath = '/unauthorized'; // default fallback
      
      switch (result.user.role) {
        case 'STUDENT':
          redirectPath = '/student';
          break;
        case 'STAFF':
          redirectPath = '/staff';
          break;
        case 'ADMIN':
          redirectPath = '/admin';
          break;
      }
      
      // ใช้ replace: true เพื่อป้องกันการกลับมาที่หน้า login
      navigate(redirectPath, { replace: true });
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
      } else {
        setError('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  // แสดง loading state ถ้า auth ยังไม่พร้อม
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-blue-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          <span className="text-neutral-600 dark:text-neutral-400">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-blue-100 dark:from-neutral-900 dark:to-neutral-800 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md bg-white dark:bg-neutral-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8">
          <motion.img
            src="/logo.svg"
            alt="VolunteerHub"
            className="h-10 w-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <motion.span
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            VolunteerHub
          </motion.span>
        </Link>

        <motion.h1
          className="text-4xl font-extrabold mb-6 text-neutral-900 dark:text-white tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          เข้าสู่ระบบ
        </motion.h1>

        {/* Error Message */}
        {error && (
          <motion.p
            className="text-red-500 text-sm text-center mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">อีเมล</label>
              <motion.input
                type="email"
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="กรอกอีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">รหัสผ่าน</label>
              <div className="relative mt-2">
                <motion.input
                  type={showPwd ? 'text' : 'password'}
                  className="w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 hover:text-violet-500 transition-colors duration-200"
                  onClick={() => setShowPwd((prev) => !prev)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {showPwd ? (
                      <motion.div
                        key="eye-off"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <EyeOff size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="eye"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Eye size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Submit button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white font-semibold tracking-wide shadow-lg transform transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: loading ? 1 : 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : 'เข้าสู่ระบบ'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p
          className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400"
          variants={itemVariants}
        >
          ยังไม่มีบัญชี?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200"
          >
            ลงทะเบียน
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}