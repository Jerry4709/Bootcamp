import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityService } from '@/services/activity.service';
import type { Activity } from '@/types/activity';
import { DataTable } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, Clock, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function MyActivities() {
  const navigate = useNavigate();
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyActivities = async () => {
      setLoading(true);
      try {
        const activities = await activityService.getMyActivities();
        setData(activities);
        setError(null);
      } catch (error) {
        console.error('Error fetching my activities:', error);
        setError('ไม่สามารถโหลดข้อมูลกิจกรรมได้ โปรดลองอีกครั้งในภายหลัง');
      } finally {
        setLoading(false);
      }
    };

    fetchMyActivities();
  }, []);

  const handleViewDetails = (id: string) => {
    navigate(ROUTES.STUDENT_ACTIVITY_DETAIL(id));
  };

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

  // แบ่งกิจกรรมเป็นกิจกรรมที่กำลังจะมาถึงและกิจกรรมที่ผ่านไปแล้ว
  const now = new Date();
  const upcomingActivities = data.filter(activity => new Date(activity.startDate) > now);
  const pastActivities = data.filter(activity => new Date(activity.startDate) <= now);

  return (
    <motion.main 
      className="p-4 md:p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <UserCheck className="text-violet-500" />
          กิจกรรมของฉัน
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          รายการกิจกรรมที่คุณสมัครเข้าร่วม
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
        </div>
      ) : error ? (
        <motion.div variants={itemVariants}>
          <Card className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mx-auto"
            >
              ลองอีกครั้ง
            </Button>
          </Card>
        </motion.div>
      ) : data.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">ยังไม่มีกิจกรรมที่เข้าร่วม</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              คุณยังไม่ได้สมัครเข้าร่วมกิจกรรมใดๆ
            </p>
            <Button 
              onClick={() => navigate(ROUTES.STUDENT_ACTIVITIES)}
              className="mx-auto flex items-center gap-2"
            >
              <Search size={16} />
              ค้นหากิจกรรม
            </Button>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* กิจกรรมที่กำลังจะมาถึง */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="text-violet-500" size={18} />
              กิจกรรมที่กำลังจะมาถึง
            </h3>
            
            {upcomingActivities.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-neutral-600 dark:text-neutral-400">
                  ไม่มีกิจกรรมที่กำลังจะมาถึง
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingActivities.map((activity) => (
                  <motion.div 
                    key={activity.id}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="h-3 bg-gradient-to-r from-violet-500 to-blue-500"></div>
                    <div className="p-5">
                      <h4 className="font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-1">
                        {activity.title}
                      </h4>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-violet-500" />
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {new Date(activity.startDate).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-violet-500" />
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {new Date(activity.startDate).toLocaleTimeString('th-TH', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleViewDetails(activity.id)}
                        className="w-full"
                        size="sm"
                      >
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* กิจกรรมที่ผ่านไปแล้ว */}
          {pastActivities.length > 0 && (
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={18} />
                กิจกรรมที่ผ่านไปแล้ว
              </h3>
              
              <Card>
                <DataTable<Activity>
                  columns={[
                    { title: 'ชื่อกิจกรรม', key: 'title' },
                    { title: 'ประเภท', key: 'type' },
                    { 
                      title: 'วันที่', 
                      key: 'startDate',
                      render: (item) => new Date(item.startDate).toLocaleDateString('th-TH')
                    },
                    { 
                      title: 'สถานะ', 
                      key: 'status',
                      render: (item) => (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          เสร็จสิ้น
                        </span>
                      )
                    },
                    {
                      title: 'การดำเนินการ',
                      key: 'id',
                      render: (item) => (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(item.id)}
                        >
                          รายละเอียด
                        </Button>
                      )
                    }
                  ]}
                  data={pastActivities}
                  className="bg-white/80 dark:bg-neutral-800/80"
                />
              </Card>
            </motion.div>
          )}
        </>
      )}
    </motion.main>
  );
}