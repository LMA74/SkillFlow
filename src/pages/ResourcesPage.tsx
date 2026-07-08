import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import type { Course, Skill, CourseModule, UserProgress, Resource } from '../lib/types';
import { BookOpen, Filter, Clock, Star, CheckCircle, Play, FileText, ExternalLink, HelpCircle, Youtube, Globe, GraduationCap, Award } from 'lucide-react';

function getSourceInfo(url: string) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return { icon: Youtube, label: 'YouTube', color: 'text-red-600 bg-red-50' };
  if (url.includes('freecodecamp.org')) return { icon: Code, label: 'freeCodeCamp', color: 'text-green-700 bg-green-50' };
  if (url.includes('coursera.org')) return { icon: GraduationCap, label: 'Coursera', color: 'text-blue-600 bg-blue-50' };
  if (url.includes('alison.com')) return { icon: Award, label: 'Alison', color: 'text-blue-700 bg-blue-50' };
  if (url.includes('google.com') || url.includes('withgoogle.com')) return { icon: Globe, label: 'Google', color: 'text-green-600 bg-green-50' };
  return { icon: ExternalLink, label: 'External', color: 'text-gray-600 bg-gray-50' };
}

function Code(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [coursesRes, skillsRes, modulesRes, progressRes, resourcesRes] = await Promise.all([
        supabase.from('courses').select('*'),
        supabase.from('skills').select('*').order('market_demand', { ascending: false }),
        supabase.from('course_modules').select('*').order('module_order'),
        user ? supabase.from('user_progress').select('*').eq('user_id', user.id) : { data: [] },
        supabase.from('resources').select('*'),
      ]);
      setCourses(coursesRes.data || []);
      setSkills(skillsRes.data || []);
      setModules(modulesRes.data || []);
      setProgress((progressRes.data as UserProgress[]) || []);
      setResources(resourcesRes.data || []);
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

  const categories = ['all', ...new Set(skills.map((s) => s.category))];
  const skillMap = new Map(skills.map((s) => [s.id, s]));
  const resourceMap = new Map(resources.map((r) => [r.id, r]));

  const filteredCourses = courses.filter((c) => {
    const skill = skillMap.get(c.skill_id);
    if (selectedCategory !== 'all' && skill?.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const getModuleProgress = (courseId: string, moduleId: string) => {
    return progress.find((p) => p.course_id === courseId && p.module_id === moduleId);
  };

  const getCourseProgress = (courseId: string) => {
    const courseModules = modules.filter((m) => m.course_id === courseId);
    const completed = courseModules.filter(
      (m) => getModuleProgress(courseId, m.id)?.status === 'completed'
    ).length;
    return { completed, total: courseModules.length, percent: courseModules.length > 0 ? Math.round((completed / courseModules.length) * 100) : 0 };
  };

  const startModule = async (courseId: string, moduleId: string) => {
    if (!user) return;
    await supabase.from('user_progress').upsert({
      user_id: user.id,
      course_id: courseId,
      module_id: moduleId,
      status: 'in_progress',
    }, { onConflict: 'user_id,module_id' });
    const { data } = await supabase.from('user_progress').select('*').eq('user_id', user.id);
    setProgress(data || []);
  };

  const completeModule = async (courseId: string, moduleId: string) => {
    if (!user) return;
    await supabase.from('user_progress').upsert({
      user_id: user.id,
      course_id: courseId,
      module_id: moduleId,
      status: 'completed',
      score: 80 + Math.floor(Math.random() * 20),
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,module_id' });
    const { data } = await supabase.from('user_progress').select('*').eq('user_id', user.id);
    setProgress(data || []);
    const courseModules = modules.filter((m) => m.course_id === courseId);
    const allCompleted = courseModules.every(
      (m) => data?.some((p) => p.module_id === m.id && p.status === 'completed')
    );
    if (allCompleted) {
      await supabase.from('certificates').insert({ user_id: user.id, course_id: courseId });
    }
  };

  const getModuleIcon = (moduleOrder: number) => {
    if (moduleOrder <= 2) return <Play className="w-4 h-4" />;
    if (moduleOrder <= 3) return <FileText className="w-4 h-4" />;
    if (moduleOrder === 4) return <ExternalLink className="w-4 h-4" />;
    return <HelpCircle className="w-4 h-4" />;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('resources.title')}</h1>
        <p className="text-gray-500 mt-1">{t('resources.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? t('resources.all') : cat}
            </button>
          ))}
        </div>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">{t('resources.allLevels')}</option>
          <option value="beginner">{t('resources.beginner')}</option>
          <option value="intermediate">{t('resources.intermediate')}</option>
          <option value="advanced">{t('resources.advanced')}</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => {
          const skill = skillMap.get(course.skill_id);
          const courseProgress = getCourseProgress(course.id);
          const isExpanded = expandedCourse === course.id;
          const courseModules = modules.filter((m) => m.course_id === course.id);
          const courseResources = resources.filter((r) => r.skill_id === course.skill_id);

          return (
            <div key={course.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-32 relative overflow-hidden">
                {course.image_url ? (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-blue-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {course.is_free && (
                  <span className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full bg-green-500 text-white shadow-md">{t('resources.free')}</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    course.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
                    course.difficulty === 'intermediate' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {t(`resources.${course.difficulty}`)}
                  </span>
                  {skill && <span className="text-xs text-gray-500">{skill.category}</span>}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.estimated_hours}h</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{skill?.market_demand}/10 {t('resources.demand')}</span>
                </div>

                {courseProgress.total > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">{courseProgress.completed}/{courseProgress.total} modules</span>
                      <span className="font-medium text-blue-600">{courseProgress.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${courseProgress.percent}%` }} />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                  className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 py-2"
                >
                  {isExpanded ? t('resources.hideModules') : t('resources.viewModules')}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                    {courseModules.map((mod) => {
                      const mp = getModuleProgress(course.id, mod.id);
                      const resource = mod.resource_id ? resourceMap.get(mod.resource_id) : null;
                      const sourceInfo = resource?.url ? getSourceInfo(resource.url) : null;

                      return (
                        <div key={mod.id} className="p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3 mb-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              mp?.status === 'completed' ? 'bg-green-100 text-green-600' :
                              mp?.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {mp?.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : getModuleIcon(mod.module_order)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-700 truncate">{mod.title}</div>
                            </div>
                          </div>

                          {resource && sourceInfo && (
                            <div className="ml-10 mt-1.5">
                              <a href={resource.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700">
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${sourceInfo.color}`}>
                                  <sourceInfo.icon className="w-3 h-3" />
                                  {sourceInfo.label}
                                </span>
                                <span className="truncate">{resource.title}</span>
                              </a>
                            </div>
                          )}

                          <div className="ml-10 mt-1.5 flex items-center gap-2">
                            {user && !mp?.status && (
                              <button onClick={() => startModule(course.id, mod.id)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1">
                                {t('resources.start')}
                              </button>
                            )}
                            {user && mp?.status === 'in_progress' && (
                              <button onClick={() => completeModule(course.id, mod.id)}
                                className="text-xs font-medium text-green-600 hover:text-green-700 px-2 py-1">
                                {t('resources.complete')}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {courseResources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Learning Resources</h4>
                        <div className="space-y-1.5">
                          {courseResources.map((res) => {
                            const si = getSourceInfo(res.url);
                            const SiIcon = si.icon;
                            return (
                              <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors group">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded ${si.color}`}>
                                  <SiIcon className="w-3.5 h-3.5" />
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-gray-700 group-hover:text-blue-600 truncate">{res.title}</div>
                                  <div className="text-xs text-gray-400">{si.label} · {res.duration_minutes} min</div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('resources.noCourses')}</p>
        </div>
      )}
    </div>
  );
}
