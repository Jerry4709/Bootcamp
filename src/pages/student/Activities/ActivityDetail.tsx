import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { activityService } from '@/services/activity.service';
import type { ActivityDetail } from '@/types/activity';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, BadgeCheck, Award, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await activityService.getById(id);
        setActivity(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching activity details:', error);
        setError('ไม่สามารถโหลดข้อมูลกิจกรรมได้ โปรดลองอีกครั้งในภายหลัง');
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetail();
  }, [id]);

  const handleToggleRegistration = async () => {
    if (!activity) return;
    
    setSubmitting(true);
    try {
      await activityService.toggleRegistration(activity.id);
      // โหลดข้อมูลใหม่หลังจากสมัครหรือยกเลิกการสมัคร
      const updatedActivity = await activityService.getById(activity.id);
      setActivity(updatedActivity);
    } catch (error) {
      console.error('Error toggling registration:', error);
      setError('ไม่สามารถดำเนินการได้ โปรดลองอีกครั้งในภายหลัง');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-4">เกิดข้อผิดพลาด</h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            {error || 'ไม่พบข้อมูลกิจกรรม'}
          </p>
          <Button onClick={() => navigate(ROUTES.STUDENT_ACTIVITIES)}>
            กลับไปยังรายการกิจกรรม
          </Button>
        </Card>
      </div>
    );
  }

  // คำนวณจำนวนวันที่เหลือจนถึงวันเริ่มกิจกรรม
  const calculateDaysRemaining = () => {
    const startDate = new Date(activity.startDate);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.main 
      className="p-4 md:p-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(ROUTES.STUDENT_ACTIVITIES)}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          กลับ
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                  {activity.title}
                </h1>
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  activity.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : ''
                }`}>
                  {activity.status === 'PUBLISHED' ? 'อนุมัติ' : 
                   activity.status === 'CLOSED' ? 'ปิดรับสมัคร' : 
                   activity.status === 'DRAFT' ? 'แบบร่าง' : 
                   activity.status === 'CANCELLED' ? 'ยกเลิก' : activity.status}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Calendar size={16} className="text-violet-500" />
                <span>
                  {new Date(activity.startDate).toLocaleDateString('th-TH', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  {' - '}
                  {new Date(activity.endDate).toLocaleDateString('th-TH', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <BadgeCheck size={20} className="text-violet-500" />
              รายละเอียดกิจกรรม
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
              {activity.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
            </p>
          </Card>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 border-l-4 border-violet-500">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                  <Award size={24} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">คะแนนที่จะได้รับ</p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {activity.points || 0} คะแนน
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Clock size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">ชั่วโมงกิจกรรม</p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {activity.hours || 0} ชั่วโมง
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar - Right 1/3 */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              สถานะการสมัคร
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700 dark:text-neutral-300">ผู้เข้าร่วมปัจจุบัน</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {activity.currentParticipants}/{activity.maxParticipants}
                </span>
              </div>
              
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-violet-600 to-blue-500 h-2.5 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, (activity.currentParticipants / activity.maxParticipants) * 100)}%` 
                  }}
                ></div>
              </div>

              {daysRemaining > 0 && (
                <div className="flex items-center gap-2 mt-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm">
                  <Calendar size={16} className="text-blue-500" />
                  <span className="text-blue-700 dark:text-blue-300">
                    เริ่มในอีก {daysRemaining} วัน
                  </span>
                </div>
              )}

              {user?.role === 'STUDENT' && activity.isActive && (
                <Button
                  className={`w-full mt-4 ${
                    activity.isRegistered 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600'
                  }`}
                  onClick={handleToggleRegistration}
                  disabled={submitting}
                >
                  {submitting 
                    ? 'กำลังดำเนินการ...' 
                    : activity.isRegistered 
                      ? 'ยกเลิกการสมัคร' 
                      : 'สมัครเข้าร่วม'
                  }
                </Button>
              )}

              {!activity.isActive && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-sm text-yellow-700 dark:text-yellow-300">
                  ขณะนี้กิจกรรมไม่เปิดรับสมัคร
                </div>
              )}
            </div>
          </Card>

          {/* Additional Info Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              ข้อมูลเพิ่มเติม
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users size={18} className="text-violet-500 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">ประเภทกิจกรรม</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{activity.type}</p>
                </div>
              </div>

              {activity.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-violet-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">สถานที่</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{activity.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-violet-500 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">เวลาเริ่ม-สิ้นสุด</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(activity.startDate).toLocaleTimeString('th-TH', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                    {' - '}
                    {new Date(activity.endDate).toLocaleTimeString('th-TH', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.main>
  );
}