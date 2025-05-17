import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/Table';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import { usePaginate } from '@/hooks/usePaginate';
import { useDebounce } from '@/hooks/useDebounce';
import { activityService } from '@/services/activity.service';
import type { Activity, ActivityType } from '@/types/activity';
import { Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants/routes';

const TYPE_OPTIONS = [
  { label: 'ทุกประเภท', value: '' },
  { label: 'อาสา', value: 'VOLUNTEER' },
  { label: 'ช่วยงาน', value: 'WORK' },
  { label: 'อบรม', value: 'TRAINING' },
];

export default function ActivityList() {
  const navigate = useNavigate();
  const { page, limit, setPage, setLimit } = usePaginate();
  const [type, setType] = useState<ActivityType | ''>('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  
  const [data, setData] = useState<{ items: Activity[]; total: number }>({
    items: [],
    total: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await activityService.getApproved({ 
          page, 
          limit, 
          type,
          search: debouncedSearch 
        });
        setData(response);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [page, limit, type, debouncedSearch]);

  const handleViewDetails = (id: string) => {
    navigate(ROUTES.STUDENT_ACTIVITY_DETAIL(id));
  };

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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Calendar className="text-violet-500" />
          รายการกิจกรรมที่เปิดรับ
        </h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={18} />
            ตัวกรอง
            <ChevronDown size={16} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-300 ${
          showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <Select
          label="ประเภทกิจกรรม"
          value={type}
          onChange={(e) => {
            setType(e.currentTarget.value as ActivityType | '');
            setPage(1);
          }}
          options={TYPE_OPTIONS}
        />
        
        <Input
          label="คำค้นหา"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="ค้นหาตามชื่อกิจกรรม..."
          className="w-full"
        />
        
        <Select
          label="แสดง"
          value={limit.toString()}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          options={[
            { label: '5 รายการ', value: '5' },
            { label: '10 รายการ', value: '10' },
            { label: '20 รายการ', value: '20' },
            { label: '50 รายการ', value: '50' },
          ]}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          </div>
        ) : data.items.length === 0 ? (
          <div className="bg-white/80 dark:bg-neutral-800/80 rounded-xl shadow p-8 text-center">
            <p className="text-neutral-700 dark:text-neutral-300 text-lg">
              {debouncedSearch || type 
                ? 'ไม่พบกิจกรรมที่ตรงกับเงื่อนไขการค้นหา' 
                : 'ไม่มีกิจกรรมที่เปิดรับสมัครในขณะนี้'}
            </p>
            {(debouncedSearch || type) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setType('');
                  setPage(1);
                }}
              >
                ล้างตัวกรอง
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items.map((activity) => (
                <motion.div 
                  key={activity.id}
                  className="bg-white/80 dark:bg-neutral-800/80 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-40 bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {activity.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                      {activity.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {activity.type}
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {activity.startDate.split('T')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.isRegistered 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {activity.isRegistered ? 'สมัครแล้ว' : 'เปิดรับสมัคร'}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={() => handleViewDetails(activity.id)}
                      >
                        รายละเอียด
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Pagination
              page={page}
              total={data.total}
              limit={limit}
              onChange={setPage}
            />
          </>
        )}
      </motion.div>
    </motion.main>
  );
}