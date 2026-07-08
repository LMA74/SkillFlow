import { useEffect, useState } from 'react';
import { useTranslation } from '../lib/useTranslation';
import { supabase } from '../lib/supabase';
import type { Opportunity } from '../lib/types';
import { GraduationCap, MapPin, Building, Filter, ExternalLink, Users, Award, ArrowRight, Phone, Mail, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const typeConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  training: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: GraduationCap, label: 'Training' },
  internship: { color: 'bg-green-100 text-green-700 border-green-200', icon: Users, label: 'Apprenticeship' },
  scholarship: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Award, label: 'Scholarship' },
  volunteer: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Users, label: 'Mentorship' },
  job: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Building, label: 'Job' },
};

export default function OpportunitiesPage() {
  const { t } = useTranslation();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('opportunities').select('*').eq('is_active', true).order('deadline', { ascending: true })
      .then(({ data }) => {
        setOpportunities(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const types = ['all', ...new Set(opportunities.map((o) => o.opportunity_type))];
  const filtered = selectedType === 'all'
    ? opportunities
    : opportunities.filter((o) => o.opportunity_type === selectedType);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Closed';
    if (diffDays === 0) return 'Closes today';
    if (diffDays <= 7) return `${diffDays} days left`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold">Skills Training & Development</h1>
        </div>
        <p className="text-blue-100 max-w-2xl">
          Discover free training programs, apprenticeships, and learning opportunities across Uganda.
          Build practical skills that employers and customers value.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              selectedType === type
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {type === 'all' ? 'All Programs' : (typeConfig[type]?.label || type.charAt(0).toUpperCase() + type.slice(1))}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.map((opp) => {
          const config = typeConfig[opp.opportunity_type] || typeConfig.job;
          const Icon = config.icon;
          const deadlineText = formatDate(opp.deadline);
          const isExpanded = expandedId === opp.id;

          return (
            <div
              key={opp.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:border-blue-200"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${config.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </span>
                  {deadlineText && (
                    <span className={`text-xs font-medium ${deadlineText === 'Closed' ? 'text-red-600' : deadlineText.includes('days left') || deadlineText === 'Closes today' ? 'text-amber-600' : 'text-gray-500'}`}>
                      {deadlineText}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 text-lg mb-2">{opp.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{opp.description}</p>

                <div className="space-y-2 mb-4">
                  {opp.organization && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{opp.organization}</span>
                    </div>
                  )}
                  {opp.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{opp.location}</span>
                    </div>
                  )}
                </div>

                {(opp.phone || opp.email || opp.requirements) && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mb-3"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {isExpanded ? 'Hide details' : 'Show contact & requirements'}
                  </button>
                )}

                {isExpanded && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                    {(opp.phone || opp.email) && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Contact Information</h4>
                        <div className="space-y-1.5">
                          {opp.phone && (
                            <div className="flex items-center gap-2">
                              <a href={`tel:${opp.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Phone className="w-4 h-4" />
                                {opp.phone}
                              </a>
                            </div>
                          )}
                          {opp.email && (
                            <div className="flex items-center gap-2">
                              <a href={`mailto:${opp.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                <Mail className="w-4 h-4" />
                                {opp.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {opp.requirements && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Requirements</h4>
                        <p className="text-sm text-gray-600">{opp.requirements}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  {opp.url ? (
                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : opp.phone ? (
                    <a
                      href={`tel:${opp.phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2.5 rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call to Apply
                    </a>
                  ) : opp.email ? (
                    <a
                      href={`mailto:${opp.email}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email to Apply
                    </a>
                  ) : (
                    <button className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition-colors">
                      <GraduationCap className="w-4 h-4" />
                      View Program Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('opportunities.none')}</p>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Can't find what you're looking for?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Many training programs are also available through local community centers, NGOs, and vocational institutes.
          Check with your district youth office for additional opportunities.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="https://mglsd.go.ug/programs/skilling/" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <ExternalLink className="w-4 h-4" />
            Ministry of Gender - Skilling Programs
          </a>
        </div>
      </div>
    </div>
  );
}
