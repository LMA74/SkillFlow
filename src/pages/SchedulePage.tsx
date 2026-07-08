import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import type { UserSchedule, Course } from '../lib/types';
import { Calendar, Plus, Trash2, Clock, Save } from 'lucide-react';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00',
];

export default function SchedulePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState<UserSchedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    day_of_week: 'monday',
    start_time: '09:00',
    duration_minutes: 60,
    course_id: '',
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [schedRes, coursesRes] = await Promise.all([
        supabase.from('user_schedules').select('*').eq('user_id', user.id).order('day_of_week'),
        supabase.from('courses').select('*'),
      ]);
      setSchedules(schedRes.data || []);
      setCourses(coursesRes.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const addSchedule = async () => {
    if (!user || !newSchedule.course_id) return;
    const { data } = await supabase.from('user_schedules').insert({
      user_id: user.id,
      course_id: newSchedule.course_id,
      day_of_week: newSchedule.day_of_week,
      start_time: newSchedule.start_time,
      duration_minutes: newSchedule.duration_minutes,
      is_active: true,
    }).select();
    if (data) {
      setSchedules([...schedules, ...data]);
      setShowAdd(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    await supabase.from('user_schedules').delete().eq('id', id);
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from('user_schedules').update({ is_active: !isActive }).eq('id', id);
    setSchedules(schedules.map((s) => s.id === id ? { ...s, is_active: !isActive } : s));
  };

  const courseMap = new Map(courses.map((c) => [c.id, c]));

  const schedulesByDay = days.map((day) => ({
    day,
    items: schedules
      .filter((s) => s.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('schedule.title')}</h1>
          <p className="text-gray-500 mt-1">{t('schedule.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('schedule.addSession')}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">{t('schedule.newSession')}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('schedule.day')}</label>
              <select
                value={newSchedule.day_of_week}
                onChange={(e) => setNewSchedule({ ...newSchedule, day_of_week: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('schedule.startTime')}</label>
              <select
                value={newSchedule.start_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('schedule.duration')}</label>
              <select
                value={newSchedule.duration_minutes}
                onChange={(e) => setNewSchedule({ ...newSchedule, duration_minutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {[30, 45, 60, 90, 120].map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('schedule.course')}</label>
              <select
                value={newSchedule.course_id}
                onChange={(e) => setNewSchedule({ ...newSchedule, course_id: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">{t('schedule.selectCourse')}</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={addSchedule}
              disabled={!newSchedule.course_id}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              {t('schedule.saveSession')}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {t('schedule.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {schedulesByDay.map(({ day, items }) => (
          <div key={day} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </h3>
            </div>
            {items.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {items.map((item) => {
                  const course = courseMap.get(item.course_id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 px-4 py-3 ${!item.is_active ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-500 w-28 flex-shrink-0">
                        <Clock className="w-4 h-4" />
                        {item.start_time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {course?.title || 'Study Session'}
                        </div>
                        <div className="text-xs text-gray-500">{item.duration_minutes} min</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            item.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.is_active ? t('schedule.active') : t('schedule.paused')}
                        </button>
                        <button
                          onClick={() => deleteSchedule(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">{t('schedule.noSessions')}</div>
            )}
          </div>
        ))}
      </div>

      {schedules.length === 0 && !showAdd && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">{t('schedule.noSchedule')}</p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            {t('schedule.createSchedule')}
          </button>
        </div>
      )}
    </div>
  );
}
