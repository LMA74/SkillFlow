import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import type { UserProgress, Course, CourseModule, UserSkill, Skill } from '../lib/types';
import { BarChart3, TrendingUp, BookOpen, Clock, CheckCircle, Star } from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [progressRes, coursesRes, modulesRes, userSkillsRes, skillsRes] = await Promise.all([
        supabase.from('user_progress').select('*').eq('user_id', user.id),
        supabase.from('courses').select('*'),
        supabase.from('course_modules').select('*').order('module_order'),
        supabase.from('user_skills').select('*').eq('user_id', user.id),
        supabase.from('skills').select('*'),
      ]);
      setProgress(progressRes.data || []);
      setCourses(coursesRes.data || []);
      setModules(modulesRes.data || []);
      setUserSkills(userSkillsRes.data || []);
      setSkills(skillsRes.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const moduleMap = new Map(modules.map((m) => [m.id, m]));
  const skillMap = new Map(skills.map((s) => [s.id, s]));

  const totalModules = progress.length;
  const completedModules = progress.filter((p) => p.status === 'completed').length;
  const inProgressModules = progress.filter((p) => p.status === 'in_progress').length;
  const totalTime = progress.reduce((sum, p) => sum + p.time_spent_minutes, 0);
  const avgScore = progress.filter((p) => p.score > 0).reduce((sum, p, _, arr) => sum + p.score / arr.length, 0);

  const courseProgress = new Map<string, UserProgress[]>();
  progress.forEach((p) => {
    const list = courseProgress.get(p.course_id) || [];
    list.push(p);
    courseProgress.set(p.course_id, list);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('progress.title')}</h1>
        <p className="text-gray-500 mt-1">{t('progress.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle, label: t('progress.completed'), value: completedModules, color: 'green' },
          { icon: BookOpen, label: t('progress.inProgress'), value: inProgressModules, color: 'blue' },
          { icon: Clock, label: t('progress.timeSpent'), value: `${Math.round(totalTime / 60)}h`, color: 'blue' },
          { icon: TrendingUp, label: t('progress.avgScore'), value: `${Math.round(avgScore)}%`, color: 'green' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              color === 'blue' ? 'bg-blue-50' : 'bg-green-50'
            }`}>
              <Icon className={`w-5 h-5 ${color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{t('progress.overallProgress')}</h2>
        <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-green-500 h-4 rounded-full transition-all"
            style={{ width: `${totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {completedModules} {t('progress.modulesCompleted')}
          {totalModules > 0 && ` (${Math.round((completedModules / totalModules) * 100)}%)`}
        </p>
      </div>

      <div>
        <h2 className="font-semibold text-gray-900 mb-4">{t('progress.courseProgress')}</h2>
        <div className="space-y-3">
          {Array.from(courseProgress.entries()).map(([courseId, items]) => {
            const course = courseMap.get(courseId);
            const completed = items.filter((i) => i.status === 'completed').length;
            const total = items.length;
            const percent = Math.round((completed / total) * 100);

            return (
              <div key={courseId} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{course?.title || 'Unknown Course'}</h3>
                  <span className="text-sm font-semibold text-blue-600">{percent}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {items.map((item) => {
                    const mod = moduleMap.get(item.module_id);
                    return (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.status === 'completed' ? 'bg-green-100' :
                          item.status === 'in_progress' ? 'bg-blue-100' :
                          'bg-gray-100'
                        }`}>
                          {item.status === 'completed' ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : item.status === 'in_progress' ? (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                          )}
                        </div>
                        <span className={`flex-1 ${
                          item.status === 'completed' ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {mod?.title || 'Module'}
                        </span>
                        {item.score > 0 && (
                          <span className="text-gray-400">{item.score}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {userSkills.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">{t('progress.skillsProgress')}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {userSkills.map((us) => {
              const skill = skillMap.get(us.skill_id);
              const levelPercent = us.proficiency_level === 'beginner' ? 33 :
                us.proficiency_level === 'intermediate' ? 66 : 100;
              return (
                <div key={us.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    us.is_learning ? 'bg-blue-50' : 'bg-gray-50'
                  }`}>
                    <Star className={`w-5 h-5 ${us.is_learning ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{skill?.name || 'Skill'}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${levelPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{t(`resources.${us.proficiency_level}`)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {progress.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">{t('progress.noProgress')}</p>
          <p className="text-sm text-gray-400">{t('progress.startCourse')}</p>
        </div>
      )}
    </div>
  );
}
