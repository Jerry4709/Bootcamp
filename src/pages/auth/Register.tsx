import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { facultyService } from '@/services/faculty.service';
import type { Faculty, Major } from '@/services/faculty.service';
import type { AuthContextType } from '@/contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth() as AuthContextType;
  const { user, isAuthReady } = useAuth();
  const location = useLocation();
  // Form states
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    student_id: '',
    faculty_id: '',
    major_id: '',
    email: '',
    password: '',
  });

  // UI states
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Faculty and Major data
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  useEffect(() => {
    if (isAuthReady && user && location.pathname === '/register') {
      navigate(`/${user.role.toLowerCase()}`, { replace: true });
    }
  }, [user, isAuthReady, location.pathname, navigate]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset major when faculty changes
    if (field === 'faculty_id') {
      setForm(prev => ({
        ...prev,
        major_id: ''
      }));
      loadMajors(parseInt(value));
    }
  };

  const loadMajors = async (facultyId: number) => {
    try {
      const majorsData = await facultyService.getMajorsByFacultyId(facultyId);
      setMajors(majorsData);
    } catch (err) {
      console.error('Failed to fetch majors:', err);
      setError('ไม่สามารถโหลดข้อมูลสาขาได้');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signUp({
        ...form,
        faculty_id: parseInt(form.faculty_id),
        major_id: parseInt(form.major_id),
        role: 'STUDENT'
      });
      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'การลงทะเบียนไม่สำเร็จ');
      } else {
        setError('การลงทะเบียนไม่สำเร็จ');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load faculties on mount
  useEffect(() => {
    const loadFaculties = async () => {
      setLoadingFaculties(true);
      try {
        const data = await facultyService.getAllFaculties();
        setFaculties(data);
      } catch (err) {
        console.error('Failed to fetch faculties:', err);
        setError('ไม่สามารถโหลดข้อมูลคณะได้');
      } finally {
        setLoadingFaculties(false);
      }
    };
    loadFaculties();
  }, []);

  // Animation variants for staggered effect
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
        className="w-full max-w-4xl bg-white dark:bg-neutral-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12"
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
          ลงทะเบียนสำหรับนักศึกษา {/* เปลี่ยนข้อความให้ชัดเจน */}
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

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <motion.div
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">ชื่อ</label>
              <motion.input
                type="text"
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="กรอกชื่อ"
                value={form.firstname}
                onChange={(e) => handleChange('firstname', e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">นามสกุล</label>
              <motion.input
                type="text"
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="กรอกนามสกุล"
                value={form.lastname}
                onChange={(e) => handleChange('lastname', e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">คณะ</label>
              <motion.select
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                value={form.faculty_id}
                onChange={(e) => handleChange('faculty_id', e.target.value)}
                required
                disabled={loadingFaculties}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <option value="" disabled>
                  {loadingFaculties ? 'กำลังโหลด...' : 'เลือกคณะ'}
                </option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id.toString()}>
                    {faculty.name}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">Email</label>
              <motion.input
                type="email"
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </motion.div>

          {/* Right column */}
          <motion.div
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">รหัสนักศึกษา</label>
              <motion.input
                type="text"
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="กรอกรหัสนักศึกษา"
                value={form.student_id}
                onChange={(e) => handleChange('student_id', e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">สาขา</label>
              <motion.select
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                value={form.major_id}
                onChange={(e) => handleChange('major_id', e.target.value)}
                required
                disabled={!form.faculty_id || majors.length === 0}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <option value="" disabled>
                  {!form.faculty_id ? 'กรุณาเลือกคณะก่อน' : majors.length === 0 ? 'ไม่พบข้อมูลสาขา' : 'เลือกสาขา'}
                </option>
                {majors.map((major) => (
                  <option key={major.id} value={major.id.toString()}>
                    {major.name}
                  </option>
                ))}
              </motion.select>
            </motion.div>

           

            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">รหัสผ่าน</label>
              <div className="relative mt-2">
                <motion.input
                  type={showPwd ? 'text' : 'password'}
                  className="w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="สร้างรหัสผ่าน"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
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
          <motion.div
            className="md:col-span-2 flex justify-center pt-4"
            variants={itemVariants}
          >
            <motion.button
              type="submit"
              disabled={loading || loadingFaculties}
              className={`w-48 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white font-semibold tracking-wide shadow-lg transform transition-all duration-300 ${(loading || loadingFaculties) ? 'opacity-70 cursor-not-allowed' : ''}`}
              whileHover={{ scale: (loading || loadingFaculties) ? 1 : 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: (loading || loadingFaculties) ? 1 : 0.95 }}
            >
              {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p
          className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400"
          variants={itemVariants}
        >
          มีบัญชีอยู่แล้ว?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200"
          >
            เข้าสู่ระบบ
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
}