import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { userService } from '@/services/user.service';
import type { User } from '@/types/user';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getProfile();
      
      if (!response) {
        throw new Error('ไม่พบข้อมูลผู้ใช้');
      }

      const userData = {
        ...response,
        total_hours: Number(response.total_hours || 0),
        total_points: Number(response.total_points || 0),
      };

      setForm(userData);
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (key: keyof User, value: string) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    
    try {
      setSaving(true);
      setError(null);
      const updated = await userService.updateProfile(form);
      setForm(updated);
      setUser(updated);
      alert('บันทึกข้อมูลสำเร็จ');
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถบันทึกข้อมูลได้');
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-sky-50 dark:from-neutral-900 dark:to-violet-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-sky-50 dark:from-neutral-900 dark:to-violet-950 p-4">
        <p className="text-red-500 mb-6 text-lg font-medium">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-violet-500 hover:bg-violet-600 transition-colors">
          ลองใหม่
        </Button>
      </div>
    );
  }

  if (!form) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-sky-50 dark:from-neutral-900 dark:to-violet-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">โปรไฟล์</h2>
          {!isEditing && (
            <Button 
              onClick={handleEdit} 
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-md"
            >
              แก้ไขข้อมูล
            </Button>
          )}
        </div>
        
        <div className="bg-white/90 dark:bg-neutral-800/90 p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-white/30 dark:border-neutral-700/30 animate-fade-in">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="ชื่อจริง"
                  value={form.firstname}
                  onChange={(e) => handleChange('firstname', e.target.value)}
                  required
                  className="border-neutral-200 dark:border-neutral-700 focus:ring-violet-500 transition-all duration-200"
                />
                <Input
                  label="นามสกุล"
                  value={form.lastname}
                  onChange={(e) => handleChange('lastname', e.target.value)}
                  required
                  className="border-neutral-200 dark:border-neutral-700 focus:ring-violet-500 transition-all duration-200"
                />
              </div>

              <Input
                label="รหัสนิสิต"
                value={form.student_id || ''}
                disabled
                className="bg-neutral-100 dark:bg-neutral-700/50 border-neutral-200 dark:border-neutral-700"
              />

              

              <div className="flex gap-4 justify-end">
                <Button 
                  type="button" 
                  onClick={handleCancel}
                  className="bg-neutral-500 hover:bg-neutral-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  ยกเลิก
                </Button>
                <Button 
                  type="submit" 
                  className="min-w-[120px] bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                  disabled={saving}
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">ชื่อจริง</p>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{form?.firstname || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">นามสกุล</p>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{form?.lastname || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">รหัสนิสิต</p>
                <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{form?.student_id || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">อีเมล</p>
                <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{form?.email || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">คณะ</p>
                <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{form?.faculty_name || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">สาขา</p>
                <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{form?.major_name || '-'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-800 shadow-md hover:shadow-lg transition-all duration-300">
                  <p className="text-sm text-violet-700 dark:text-violet-300">ชั่วโมงสะสม</p>
                  <p className="text-3xl font-bold text-violet-900 dark:text-violet-100">
                    {form?.total_hours?.toFixed(2) || '0.00'} ชม.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 shadow-md hover:shadow-lg transition-all duration-300">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">คะแนนสะสม</p>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    {form?.total_points?.toFixed(2) || '0.00'} คะแนน
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}