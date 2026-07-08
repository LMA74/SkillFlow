import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/useTranslation';
import { Target, BookOpen, TrendingUp, Award, Users, Smartphone, ArrowRight, CheckCircle, Globe } from 'lucide-react';

export default function LandingPage() {
  const { t, lang, changeLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Language Selector - Fixed Top */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-md border border-gray-200 p-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              lang === 'en'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            English
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button
            onClick={() => changeLanguage('lg')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              lang === 'lg'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Luganda
          </button>
        </div>
      </div>

      <nav className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SkillFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2"
          >
            {t('auth.signInBtn')}
          </Link>
          <Link
            to="/login?mode=signup"
            className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg transition-colors"
          >
            {t('landing.hero.cta').split(' ').slice(0, 2).join(' ')}
          </Link>
        </div>
      </nav>

      <section className="px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <TrendingUp className="w-4 h-4" />
              {t('landing.hero.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              {t('landing.hero.title1')}{' '}
              <span className="text-blue-600">{t('landing.hero.titleHighlight')}</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                {t('landing.hero.cta')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                {t('auth.signInBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('landing.howItWorks')}</h2>
            <p className="mt-3 text-gray-600 text-lg">{t('landing.howItWorks.subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, titleKey: 'landing.step.assess', descKey: 'landing.step.assess.desc', color: 'blue' },
              { icon: BookOpen, titleKey: 'landing.step.learn', descKey: 'landing.step.learn.desc', color: 'green' },
              { icon: TrendingUp, titleKey: 'landing.step.track', descKey: 'landing.step.track.desc', color: 'blue' },
              { icon: Award, titleKey: 'landing.step.earn', descKey: 'landing.step.earn.desc', color: 'green' },
            ].map(({ icon: Icon, titleKey, descKey, color }) => (
              <div
                key={titleKey}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    color === 'blue' ? 'bg-blue-50' : 'bg-green-50'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' : 'text-green-600'}`}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(titleKey)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('landing.builtForYou')}</h2>
              <div className="space-y-4">
                {[
                  'landing.benefit.free',
                  'landing.benefit.lowData',
                  'landing.benefit.flexible',
                  'landing.benefit.personalized',
                  'landing.benefit.certificates',
                  'landing.benefit.jobs',
                ].map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Smartphone, label: 'Mobile First', value: 'Low Data' },
                { icon: Users, label: 'Youth Focused', value: 'Uganda' },
                { icon: BookOpen, label: 'Free Courses', value: '50+' },
                { icon: Award, label: 'Certificates', value: 'Recognized' },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100"
                >
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{value}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('landing.cta.title')}</h2>
          <p className="text-blue-100 text-lg mb-8">
            {t('landing.cta.subtitle')}
          </p>
          <Link
            to="/login?mode=signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-base"
          >
            {t('landing.cta.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">SkillFlow</span>
          </div>
          <p className="text-sm text-gray-400">Empowering Uganda's youth through skills.</p>
        </div>
      </footer>
    </div>
  );
}
