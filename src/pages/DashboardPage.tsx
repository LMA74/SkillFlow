import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import type { Profile, UserSkill, UserProgress, Certificate, Course } from '../lib/types';
import {
  BookOpen, Target, Award, Briefcase,
  Clock, CheckCircle, ArrowRight, Star
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, skillsRes, progressRes, certsRes, coursesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_skills').select('*, skill:skills(*)').eq('user_id', user.id),
        supabase.from('user_progress').select('*').eq('user_id', user.id),
        supabase.from('certificates').select('*, course:courses(*)').eq('user_id', user.id),
        supabase.from('courses').select('*').limit(4),
      ]);
      setProfile(profileRes.data);
      setSkills(skillsRes.data || []);
      setProgress(progressRes.data || []);
      setCertificates(certsRes.data || []);
      setCourses(coursesRes.data || []);
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

  const completedModules = progress.filter((p) => p.status === 'completed').length;
  const inProgressModules = progress.filter((p) => p.status === 'in_progress').length;
  const learningSkills = skills.filter((s) => s.is_learning).length;
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('dashboard.greeting')}, {firstName}!</h1>
        <p className="mt-2 text-blue-100">
          {profile?.is_eligible
            ? t('dashboard.eligibleMsg')
            : t('dashboard.notEligibleMsg')}
        </p>
        {!profile?.onboarding_completed && (
          <Link
            to="/onboarding"
            className="mt-4 inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors"
          >
            {t('dashboard.completeProfile')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        {profile?.onboarding_completed && !profile?.is_eligible && (
          <Link
            to="/assessment"
            className="mt-4 inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors"
          >
            {t('dashboard.takeAssessment')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: t('dashboard.skillsLearning'), value: learningSkills, color: 'blue' },
          { icon: CheckCircle, label: t('dashboard.completed'), value: completedModules, color: 'green' },
          { icon: Clock, label: t('dashboard.inProgress'), value: inProgressModules, color: 'blue' },
          { icon: Award, label: t('dashboard.certificates'), value: certificates.length, color: 'green' },
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/assessment"
          className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t('dashboard.skillAssessment')}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">{t('dashboard.skillAssessment.desc')}</p>
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
            {t('dashboard.startAssessment')} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          to="/resources"
          className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t('dashboard.learningResources')}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">{t('dashboard.learningResources.desc')}</p>
          <span className="text-sm font-medium text-green-600 group-hover:text-green-700 flex items-center gap-1">
            {t('dashboard.browseResources')} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          to="/opportunities"
          className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{t('dashboard.opportunities')}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">{t('dashboard.opportunities.desc')}</p>
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
            {t('dashboard.viewOpportunities')} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {courses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recommendedCourses')}</h2>
            <Link to="/resources" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              {t('dashboard.viewAll')}
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <Link key={course.id} to="/resources" className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-28 relative overflow-hidden">
                  {course.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-blue-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {course.is_free && (
                    <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-green-500 text-white">Free</span>
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
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  <p className="text-xs text-gray-500">{course.estimated_hours} hours</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.yourSkills')}</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((us) => (
              <div
                key={us.id}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
              >
                <Star className={`w-4 h-4 ${us.is_learning ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {us.skill?.name || 'Skill'}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  us.proficiency_level === 'beginner' ? 'bg-green-50 text-green-700' :
                  us.proficiency_level === 'intermediate' ? 'bg-blue-50 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {t(`resources.${us.proficiency_level}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
