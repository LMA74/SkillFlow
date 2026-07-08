import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import { ArrowRight, ArrowLeft, User, GraduationCap, Heart, Clock, Briefcase } from 'lucide-react';

const educationLevels = ['No formal education', 'Primary school (P1-P7)', 'Secondary school (S1-S4)', 'A-Level (S5-S6)', 'Diploma/Certificate', 'University degree'];
const employmentStatuses = ['Unemployed', 'Part-time / Casual work', 'Self-employed / Small business', 'Student', 'Volunteer', 'Boda boda rider', 'Farmer'];
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
const interestOptions = ['Technology & Digital', 'Business & Trade', 'Creative Arts & Crafts', 'Agriculture & Farming', 'Healthcare', 'Education & Teaching', 'Construction & Building', 'Fashion & Beauty', 'Mechanics & Repair', 'Food & Hospitality'];
const skillOptions = ['Phone / Mobile use', 'Computer basics', 'Social media', 'Writing / Reading', 'Math / Counting', 'Customer service', 'Selling / Trading', 'Cooking / Catering', 'Farming / Gardening', 'Art / Drawing', 'Sewing / Tailoring', 'Hairdressing', 'Mechanics / Repair', 'None'];
const studyTimes = ['Early morning (6-9am)', 'Morning (9-12pm)', 'Afternoon (12-5pm)', 'Evening (5-9pm)', 'Night (9pm+)'];

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    location: '',
    education_level: '',
    employment_status: '',
    current_job: '',
    current_job_custom: '',
    current_skills: [] as string[],
    interests: [] as string[],
    free_time_hours_per_week: 10,
    preferred_study_times: [] as string[],
  });

  const toggleArrayItem = (field: 'current_skills' | 'interests' | 'preferred_study_times', value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const getCurrentJobValue = () => {
    if (form.current_job === 'Formal employment' || form.current_job === 'Other') {
      return form.current_job_custom ? `${form.current_job}: ${form.current_job_custom}` : form.current_job;
    }
    return form.current_job;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: form.full_name,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender,
        location: form.location,
        education_level: form.education_level,
        employment_status: form.employment_status,
        current_job: getCurrentJobValue(),
        current_skills: form.current_skills,
        interests: form.interests,
        free_time_hours_per_week: form.free_time_hours_per_week,
        preferred_study_times: form.preferred_study_times,
        onboarding_completed: true,
      });
      if (!error) {
        navigate('/assessment');
      }
    } finally {
      setLoading(false);
    }
  };

  const showCustomJobInput = form.current_job === 'Formal employment' || form.current_job === 'Other';

  const steps = [
    // Step 0: Personal Info
    <div key="personal" className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('onboarding.personal.title')}</h2>
          <p className="text-sm text-gray-500">{t('onboarding.personal.subtitle')}</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('onboarding.fullName')}</label>
        <input
          type="text"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('onboarding.dob')}</label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('onboarding.gender')}</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">{t('common.select')}</option>
            <option value="Male">{t('common.male')}</option>
            <option value="Female">{t('common.female')}</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('onboarding.location')}</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder={t('onboarding.locationPlaceholder')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
    </div>,

    // Step 1: Education, Employment & Current Job
    <div key="education" className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('onboarding.education.title')}</h2>
          <p className="text-sm text-gray-500">{t('onboarding.education.subtitle')}</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('onboarding.educationLevel')}</label>
        <select
          value={form.education_level}
          onChange={(e) => setForm({ ...form, education_level: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">{t('common.select')}</option>
          {educationLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('onboarding.employmentStatus')}</label>
        <div className="grid grid-cols-2 gap-2">
          {employmentStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setForm({ ...form, employment_status: status })}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                form.employment_status === status
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-gray-400" />
          {t('onboarding.currentJob')}
        </label>
        <select
          value={form.current_job}
          onChange={(e) => setForm({ ...form, current_job: e.target.value, current_job_custom: '' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">{t('common.select')}</option>
          {currentJobOptions.map((job) => (
            <option key={job} value={job}>{job}</option>
          ))}
        </select>
        {showCustomJobInput && (
          <input
            type="text"
            value={form.current_job_custom}
            onChange={(e) => setForm({ ...form, current_job_custom: e.target.value })}
            placeholder={t('onboarding.currentJobPlaceholder')}
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        )}
      </div>
    </div>,

    // Step 2: Skills & Interests
    <div key="skills" className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('onboarding.skills.title')}</h2>
          <p className="text-sm text-gray-500">{t('onboarding.skills.subtitle')}</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('onboarding.currentSkills')}</label>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleArrayItem('current_skills', skill)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                form.current_skills.includes(skill)
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('onboarding.interests')}</label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleArrayItem('interests', interest)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                form.interests.includes(interest)
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 3: Schedule
    <div key="schedule" className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('onboarding.schedule.title')}</h2>
          <p className="text-sm text-gray-500">{t('onboarding.schedule.subtitle')}</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('onboarding.freeTime')} <span className="text-blue-600 font-bold">{form.free_time_hours_per_week} {t('onboarding.hours')}</span>
        </label>
        <input
          type="range"
          min="1"
          max="40"
          value={form.free_time_hours_per_week}
          onChange={(e) => setForm({ ...form, free_time_hours_per_week: parseInt(e.target.value) })}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 hr</span>
          <span>40 hrs</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('onboarding.preferredTimes')}</label>
        <div className="space-y-2">
          {studyTimes.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => toggleArrayItem('preferred_study_times', time)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
                form.preferred_study_times.includes(time)
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">{t('onboarding.step')} {step + 1} {t('onboarding.of')} {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((step + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {steps[step]}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('onboarding.back')}
              </button>
            ) : (
              <div />
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                {t('onboarding.continue')}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    {t('onboarding.completeSetup')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
