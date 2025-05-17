import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { facultyService } from '@/services/faculty.service';
import type { Faculty, Major } from '@/services/faculty.service';

// ตัวเลือกสถานะผู้ใช้
const statuses = [
  { label: 'นักศึกษา', value: 'STUDENT' },
  { label: 'อาจารย์', value: 'STAFF' },
  { label: 'บุคลากร', value: 'EMPLOYEE' },
];

interface AuthContextValue {
  signUp: (data: {
    firstname: string;
    lastname: string;
    studentId: string;
    faculty: string;
    field: string;
    status: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth() as AuthContextValue;

  // ข้อมูลผู้ใช้
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [studentId, setStudentId] = useState('');
  const [faculty, setFaculty] = useState('');
  const [field, setField] = useState('');
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  
  // สถานะการทำงาน
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ข้อมูลคณะและสาขา
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [allMajors, setAllMajors] = useState<Major[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);

  // ดึงข้อมูลคณะและสาขาเมื่อโหลดหน้า
  useEffect(() => {
    const fetchData = async () => {
      setLoadingFaculties(true);
      try {
        // ดึงข้อมูลคณะทั้งหมด
        const facultiesData = await facultyService.getAllFaculties();
        setFaculties(facultiesData);
        
        // ดึงข้อมูลสาขาทั้งหมด
        const majorsData = await facultyService.getAllMajors();
        setAllMajors(majorsData);
      } catch (err) {
        console.error('Failed to fetch faculties or majors:', err);
        setError('ไม่สามารถโหลดข้อมูลคณะและสาขาได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoadingFaculties(false);
      }
    };
    
    fetchData();
  }, []);

  // กรองสาขาตามคณะที่เลือก
  useEffect(() => {
    if (faculty && allMajors.length > 0) {
      const facultyId = parseInt(faculty);
      const filteredMajors = allMajors.filter(m => m.faculty_id === facultyId);
      setMajors(filteredMajors);
      setField(''); // รีเซ็ตการเลือกสาขาเมื่อเปลี่ยนคณะ
    } else {
      setMajors([]);
    }
  }, [faculty, allMajors]);

  // เมื่อเลือกคณะใหม่ ให้ดึงข้อมูลสาขาของคณะนั้น
  const handleFacultyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const facultyId = e.target.value;
    setFaculty(facultyId);
    
    if (!facultyId) return;
    
    try {
      // ดึงข้อมูลสาขาตามคณะที่เลือก
      const majorsData = await facultyService.getMajorsByFacultyId(parseInt(facultyId));
      setMajors(majorsData);
      setField(''); // รีเซ็ตการเลือกสาขาเมื่อเปลี่ยนคณะ
    } catch (err) {
      console.error('Failed to fetch majors for faculty:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signUp({
        firstname,
        lastname,
        studentId,
        faculty,
        field,
        status,
        email,
        password,
      });
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'การลงทะเบียนไม่สำเร็จ โปรดลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

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
          Create Your Account
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
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
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
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">คณะ</label>
              <motion.select
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                value={faculty}
                onChange={handleFacultyChange}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="font-semibold text-neutral-700 dark:text-neutral-200">สาขา</label>
              <motion.select
                className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
                disabled={!faculty || majors.length === 0}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <option value="" disabled>
                  {!faculty ? 'กรุณาเลือกคณะก่อน' : majors.length === 0 ? 'ไม่พบข้อมูลสาขา' : 'เลือกสาขา'}
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