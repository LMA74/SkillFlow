import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import type { Skill, Profile } from '../lib/types';
import { Target, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Loader2, Lightbulb } from 'lucide-react';
import { calculateRecommendationScore, rankRecommendations } from '../lib/recommendationEngine';
import type { RecommendationScore } from '../lib/recommendationEngine';

interface Question {
  id: string;
  textKey: string;
  options: { value: string; labelKey?: string; label?: string; points: number }[];
}

const questions: Question[] = [
  {
    id: 'age_range',
    textKey: 'assessment.q.age',
    options: [
      { value: 'under_18', label: 'Under 18', points: 3 },
      { value: '18_24', label: '18-24', points: 3 },
      { value: '25_30', label: '25-30', points: 2 },
      { value: '31_35', label: '31-35', points: 1 },
      { value: 'over_35', label: 'Over 35', points: 0 },
    ],
  },
  {
    id: 'income_level',
    textKey: 'assessment.q.income',
    options: [
      { value: 'no_income', label: 'No income at all', points: 3 },
      { value: 'very_low', label: 'Very low - can barely afford basics', points: 3 },
      { value: 'low', label: 'Low income - struggle sometimes', points: 2 },
      { value: 'moderate', label: 'Moderate - can meet basic needs', points: 1 },
      { value: 'stable', label: 'Stable income', points: 0 },
    ],
  },
  {
    id: 'education_access',
    textKey: 'assessment.q.education',
    options: [
      { value: 'no_access', label: 'Dropped out / No school at all', points: 3 },
      { value: 'very_limited', label: 'Only some primary school', points: 3 },
      { value: 'some_access', label: 'Some secondary but did not finish', points: 2 },
      { value: 'adequate', label: 'Completed secondary or more', points: 0 },
    ],
  },
  {
    id: 'employment_barrier',
    textKey: 'assessment.q.employment',
    options: [
      { value: 'major_barriers', label: 'Major barriers (no connections, no qualifications, disability)', points: 3 },
      { value: 'some_barriers', label: 'Some barriers (limited experience, few opportunities)', points: 2 },
      { value: 'minor_barriers', label: 'Minor barriers', points: 1 },
      { value: 'no_barriers', label: 'No significant barriers', points: 0 },
    ],
  },
  {
    id: 'housing_situation',
    textKey: 'assessment.q.housing',
    options: [
      { value: 'homeless', label: 'Homeless or staying with others temporarily', points: 3 },
      { value: 'unstable', label: 'Unstable housing (may lose it soon)', points: 2 },
      { value: 'temporary', label: 'Temporary / rented room', points: 2 },
      { value: 'stable', label: 'Stable family home', points: 0 },
    ],
  },
  {
    id: 'support_system',
    textKey: 'assessment.q.support',
    options: [
      { value: 'none', label: 'No one - I am on my own', points: 3 },
      { value: 'minimal', label: 'Very little support', points: 2 },
      { value: 'some', label: 'Some family or friends', points: 1 },
      { value: 'strong', label: 'Strong support system', points: 0 },
    ],
  },
  {
    id: 'digital_access',
    textKey: 'assessment.q.digital',
    options: [
      { value: 'no_access', label: 'No phone or internet at all', points: 3 },
      { value: 'very_limited', label: 'Borrow a phone sometimes, no data', points: 2 },
      { value: 'limited', label: 'Have a basic phone with limited data', points: 1 },
      { value: 'good', label: 'Have a smartphone with regular data', points: 0 },
    ],
  },
  {
    id: 'caregiving',
    textKey: 'assessment.q.caregiving',
    options: [
      { value: 'full_time', label: 'Yes, I take care of children or family full-time', points: 3 },
      { value: 'significant', label: 'Yes, significant responsibilities', points: 2 },
      { value: 'some', label: 'Some responsibilities', points: 1 },
      { value: 'none', label: 'No caregiving duties', points: 0 },
    ],
  },
];

export default function AssessmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentQ, setCurrentQ] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommendationScores, setRecommendationScores] = useState<RecommendationScore[]>([]);
  const [result, setResult] = useState<{ eligible: boolean; score: number; factors: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
    supabase.from('skills').select('*').order('market_demand', { ascending: false })
      .then(({ data }) => setSkills(data || []));
  }, [user]);

  const handleAnswer = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateEligibility = () => {
    let totalPoints = 0;
    const factors: string[] = [];

    questions.forEach((q) => {
      const answer = responses[q.id];
      if (answer) {
        const option = q.options.find((o) => o.value === answer);
        if (option) {
          totalPoints += option.points;
          if (option.points >= 2) {
            factors.push(t(q.textKey).replace('?', '').trim());
          }
        }
      }
    });

    const maxPoints = questions.length * 3;
    const scorePercent = Math.round((totalPoints / maxPoints) * 100);
    const eligible = totalPoints >= 6;

    return { eligible, score: scorePercent, factors };
  };

  const calculateVulnerabilityScore = () => {
    let score = 0;
    const weights: Record<string, number> = {
      no_income: 3,
      very_low: 3,
      low: 2,
      no_access: 3,
      very_limited: 3,
      some_access: 2,
      homeless: 3,
      unstable: 2,
      temporary: 2,
      none: 3,
      minimal: 2,
      no_access_digital: 3,
      very_limited_digital: 2,
      limited_digital: 1,
      full_time: 3,
      significant: 2,
      some: 1,
    };

    Object.keys(responses).forEach((key) => {
      const value = responses[key];
      score += weights[value] || 0;
    });

    return Math.min(score, 24);
  };

  const getRecommendedSkillScores = (): RecommendationScore[] => {
    if (!profile || skills.length === 0) return [];

    const vulnerabilityScore = calculateVulnerabilityScore();
    const currentSkillNames = profile.current_skills || [];

    const scores = skills.map((skill) =>
      calculateRecommendationScore(
        {
          id: skill.id,
          name: skill.name,
          category: skill.category,
          market_demand: skill.market_demand,
        },
        {
          current_job: profile.current_job || '',
          employment_status: profile.employment_status || '',
          education_level: profile.education_level || '',
          current_skills: currentSkillNames,
          interests: profile.interests || [],
          free_time_hours_per_week: profile.free_time_hours_per_week || 5,
          vulnerability_score: vulnerabilityScore,
        },
        currentSkillNames
      )
    );

    return rankRecommendations(scores).slice(0, 5);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    const { eligible, score, factors } = calculateEligibility();
    const topRecommendations = getRecommendedSkillScores();
    const recommendedSkillIds = topRecommendations.map((r) => r.skill_id);

    setRecommendationScores(topRecommendations);

    try {
      await supabase.from('user_assessments').upsert({
        user_id: user.id,
        responses,
        eligibility_score: score,
        is_eligible: eligible,
        vulnerability_factors: factors,
        recommended_skill_ids: recommendedSkillIds,
      }, { onConflict: 'user_id' });

      await supabase.from('profiles').update({
        is_eligible: eligible,
      }).eq('user_id', user.id);

      if (eligible) {
        const skillInserts = topRecommendations.map((rec) => ({
          user_id: user.id,
          skill_id: rec.skill_id,
          source: 'recommended',
          is_learning: true,
          proficiency_level: 'beginner',
        }));
        await supabase.from('user_skills').upsert(skillInserts, { onConflict: 'user_id,skill_id' });

        const days = ['monday', 'wednesday', 'friday'] as const;
        const freeHours = profile?.free_time_hours_per_week || 10;
        const duration = Math.min(Math.max(Math.round(freeHours / 3) * 15, 30), 120);

        for (const day of days) {
          await supabase.from('user_schedules').insert({
            user_id: user.id,
            day_of_week: day,
            start_time: '09:00',
            duration_minutes: duration,
            is_active: true,
          });
        }
      }

      setResult({ eligible, score, factors });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          {result.eligible ? (
            <>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('assessment.eligible.title')}</h1>
              <p className="text-gray-600 mb-6">{t('assessment.eligible.desc')}</p>
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="text-sm text-green-700 font-medium mb-1">{t('assessment.eligibilityScore')}</div>
                <div className="text-3xl font-bold text-green-700">{result.score}%</div>
              </div>
              {result.factors.length > 0 && (
                <div className="text-left mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('assessment.identifiedFactors')}</h3>
                  <ul className="space-y-1">
                    {result.factors.map((f) => (
                      <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {recommendationScores.length > 0 && (
                <div className="text-left mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    Top Recommended Skills
                  </h3>
                  <div className="space-y-3">
                    {recommendationScores.map((rec) => (
                      <div key={rec.skill_id} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{rec.skill_name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{rec.explanation}</p>
                          </div>
                          <div className="ml-3 text-right flex-shrink-0">
                            <div className="text-lg font-bold text-blue-600">{rec.score}%</div>
                            <p className="text-xs text-gray-500">Match Score</p>
                          </div>
                        </div>
                        {rec.required_skills.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-blue-100">
                            <p className="text-xs text-gray-600 font-medium mb-1">Prerequisites:</p>
                            <div className="flex flex-wrap gap-1">
                              {rec.required_skills.map((skill) => (
                                <span key={skill} className="inline-block bg-white text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {t('assessment.goDashboard')}
                </button>
                <button
                  onClick={() => navigate('/resources')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {t('assessment.startLearning')}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('assessment.notEligible.title')}</h1>
              <p className="text-gray-600 mb-6">{t('assessment.notEligible.desc')}</p>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-sm text-blue-700 font-medium mb-1">{t('assessment.yourScore')}</div>
                <div className="text-3xl font-bold text-blue-700">{result.score}%</div>
              </div>
              <button
                onClick={() => navigate('/resources')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {t('assessment.browseResources')}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">{t('assessment.title')}</h1>
        </div>
        <p className="text-sm text-gray-500">{t('assessment.subtitle')}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">{currentQ + 1}/{questions.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">{t(question.textKey)}</h2>
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(question.id, option.value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                responses[question.id] === option.value
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label || (option.labelKey ? t(option.labelKey) : option.value)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          {currentQ > 0 ? (
            <button
              onClick={() => setCurrentQ(currentQ - 1)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('onboarding.back')}
            </button>
          ) : (
            <div />
          )}
          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              disabled={!responses[question.id]}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              {t('assessment.next')}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!responses[question.id] || loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {t('assessment.submit')}
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
