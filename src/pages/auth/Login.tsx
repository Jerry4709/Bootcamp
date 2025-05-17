import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth'; // Hook สำหรับจัดการ auth state (เช่น token)
import { ROUTES } from '@/constants/routes';

// Type definition for AuthContextValue
interface AuthContextValue {
  login: (token: string) => void; // ฟังก์ชันสำหรับบันทึก token
  loginAction: (email: string, password: string) => Promise<{accessToken: string, user: User}>; // ฟังก์ชันสำหรับ login
  logout: () => void; // ฟังก์ชันสำหรับ logout
}

// Interface สำหรับข้อมูลผู้ใช้
interface User {
  id: string;
  sid: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  avatarUrl?: string;
  hours: number;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { loginAction } = useAuth() as AuthContextValue;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ใช้ loginAction จาก AuthContext แทนการเรียก API โดยตรง
      const { user } = await loginAction(email, password);
      
      // ตรวจสอบ role และนำทางไปยังหน้าที่เหมาะสม
      switch (user.role) {
        case 'STUDENT':
          navigate(ROUTES.STUDENT_DASHBOARD);
          break;
        case 'STAFF':
          navigate(ROUTES.STAFF_DASHBOARD);
          break;
        case 'ADMIN':
          navigate(ROUTES.ADMIN_DASHBOARD);
          break;
        default:
          // กรณีที่ไม่มี role ที่รองรับ
          navigate(ROUTES.STUDENT_DASHBOARD); // default fallback
      }
    } catch (err: any) {
      // จัดการข้อผิดพลาดที่เกิดขึ้น
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <motion.div 
            className="bg-red-50 text-red-500 p-4 rounded-lg mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">อีเมล</label>
              <motion.input
                type="email"
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="กรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="mt-4">
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">รหัสผ่าน</label>
              <div className="relative mt-2">
                <motion.input
                  type={showPwd ? 'text' : 'password'}
                  className="w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="กรอกรหัสผ่านของคุณ"
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
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
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