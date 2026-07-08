import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import type { Certificate, Course } from '../lib/types';
import { Award, Download, ExternalLink, BookOpen } from 'lucide-react';

export default function CertificatesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [certsRes, coursesRes] = await Promise.all([
        supabase.from('certificates').select('*').eq('user_id', user.id).order('issued_at', { ascending: false }),
        supabase.from('courses').select('*'),
      ]);
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

  const courseMap = new Map(courses.map((c) => [c.id, c]));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('certificates.title')}</h1>
        <p className="text-gray-500 mt-1">{t('certificates.subtitle')}</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {certificates.map((cert) => {
            const course = courseMap.get(cert.course_id);
            return (
              <div
                key={cert.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-24 relative overflow-hidden">
                  {course?.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Award className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-semibold">Certificate Earned</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {course?.title || 'Course Certificate'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {t('certificates.issued')} {new Date(cert.issued_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 rounded-lg">
                      <Download className="w-4 h-4" />
                      {t('certificates.download')}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 px-3 py-1.5 bg-gray-50 rounded-lg">
                      <ExternalLink className="w-4 h-4" />
                      {t('certificates.share')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('certificates.none')}</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {t('certificates.none.desc')}
          </p>
          <a
            href="/resources"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            {t('certificates.browseCourses')}
          </a>
        </div>
      )}
    </div>
  );
}
