import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';
import { User, Save, Mail, MapPin, GraduationCap, Briefcase, Clock, Heart, CheckCircle, Globe } from 'lucide-react';

const currentJobOptions = [
  'Unemployed',
  'Student',
  'Casual worker (general)',
  'Street vendor / Hawker',
  'Salon worker (hairdresser / barber)',
  'Tailor / tailoring assistant',
  'Motorcycle rider (Boda boda)',
  'Mechanic / garage assistant',
  'Construction worker / helper',
  'Domestic worker / house help',
  'Small business owner (kiosk / shop / market stall)',
  'Agricultural worker / farm worker',
  'Security guard',
  'Informal apprentice (any trade)',
  'Formal employment',
  'Other',
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { t, lang, changeLanguage } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    location: '',
    education_level: '',
    employment_status: '',
    current_job: '',
    bio: '',
    free_time_hours_per_week: 10,
  });

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        setProfile(data);
        if (data) {
          setForm({
            full_name: data.full_name || '',
            date_of_birth: data.date_of_birth || '',
            gender: data.gender || '',
            location: data.location || '',
            education_level: data.education_level || '',
            employment_status: data.employment_status || '',
            current_job: data.current_job || '',
            bio: data.bio || '',
            free_time_hours_per_week: data.free_time_hours_per_week || 10,
          });
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: form.full_name,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender,
        location: form.location,
        education_level: form.education_level,
        employment_status: form.employment_status,
        current_job: form.current_job,
        bio: form.bio,
        free_time_hours_per_week: form.free_time_hours_per_week,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id);

      if (!error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
        <p className="text-gray-500 mt-1">{t('profile.subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          {t('profile.language')}
        </h2>
        <p className="text-sm text-gray-500 mb-3">{t('profile.languageDesc')}</p>
        <div className="flex gap-3">
          <button
            onClick={() => changeLanguage('en')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
              lang === 'en' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('lg')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
              lang === 'lg' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Luganda
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          {t('profile.account')}
        </h2>
        <div className="text-sm text-gray-600">
          <span className="text-gray-400">{t('profile.email')}: </span>
          {user?.email}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-gray-400">{t('profile.status')}: </span>
          {profile?.is_eligible ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {t('profile.eligible')}
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {t('profile.notAssessed')}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          {t('profile.personalInfo')}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('profile.fullName')}</label>
          <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('profile.dob')}</label>
            <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('profile.gender')}</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">{t('common.select')}</option>
              <option value="Male">{t('common.male')}</option>
              <option value="Female">{t('common.female')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            {t('profile.location')}
          </label>
          <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              {t('profile.education')}
            </label>
            <select value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">{t('common.select')}</option>
              <option>No formal education</option>
              <option>Primary school (P1-P7)</option>
              <option>Secondary school (S1-S4)</option>
              <option>A-Level (S5-S6)</option>
              <option>Diploma/Certificate</option>
              <option>University degree</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-gray-400" />
              {t('profile.employment')}
            </label>
            <select value={form.employment_status} onChange={(e) => setForm({ ...form, employment_status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">{t('common.select')}</option>
              <option>Unemployed</option>
              <option>Part-time / Casual work</option>
              <option>Self-employed / Small business</option>
              <option>Student</option>
              <option>Volunteer</option>
              <option>Boda boda rider</option>
              <option>Farmer</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-gray-400" />
            {t('profile.currentJob')}
          </label>
          <select value={form.current_job} onChange={(e) => setForm({ ...form, current_job: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="">{t('common.select')}</option>
            {currentJobOptions.map((job) => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
          {(form.current_job === 'Formal employment' || form.current_job === 'Other') && (
            <input
              type="text"
              value={form.current_job.includes(': ') ? form.current_job.split(': ')[1] : ''}
              onChange={(e) => setForm({ ...form, current_job: `${form.current_job.split(':')[0].trim()}: ${e.target.value}` })}
              placeholder={t('onboarding.currentJobPlaceholder')}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-gray-400" />
            {t('profile.bio')}
          </label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            placeholder={t('profile.bioPlaceholder')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            {t('profile.freeTime')} <span className="text-blue-600 font-bold">{form.free_time_hours_per_week} {t('onboarding.hours')}</span>
          </label>
          <input type="range" min="1" max="40" value={form.free_time_hours_per_week}
            onChange={(e) => setForm({ ...form, free_time_hours_per_week: parseInt(e.target.value) })}
            className="w-full accent-blue-600" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
            {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
            {t('profile.saveChanges')}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {t('profile.saved')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
