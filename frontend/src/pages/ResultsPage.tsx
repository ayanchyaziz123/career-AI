import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Bookmark, BookmarkCheck, GitCompareArrows, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCareer, CareerMatch } from '../context/CareerContext';

function getMatchColor(score: number) {
  if (score >= 85) return 'from-emerald-500 to-teal-600';
  if (score >= 75) return 'from-blue-500 to-indigo-600';
  return 'from-amber-500 to-orange-600';
}

function getMatchBg(score: number) {
  if (score >= 85) return 'bg-emerald-500/10 border-emerald-500/30';
  if (score >= 75) return 'bg-blue-500/10 border-blue-500/30';
  return 'bg-amber-500/10 border-amber-500/30';
}

function CareerCard({ career }: { career: CareerMatch }) {
  const { toggleSaved, toggleCompare, compareList } = useCareer();
  const navigate = useNavigate();
  const avgGap = career.skills.reduce((s, sk) => s + (sk.required - sk.level), 0) / career.skills.length;
  const readiness = Math.round(career.skills.reduce((s, sk) => s + (sk.level / sk.required) * 100, 0) / career.skills.length);
  const isComparing = compareList.includes(career.id);
  const topGaps = career.skills.filter(s => s.required - s.level > 2).slice(0, 3);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-300 group">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-slate-100">{career.title}</h3>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getMatchBg(career.matchScore)}`}>
                {career.matchScore >= 85 ? 'Great Match' : career.matchScore >= 75 ? 'Good Match' : 'Possible'}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{career.description}</p>
          </div>

          <div className={`flex-shrink-0 w-28 h-28 rounded-2xl bg-gradient-to-br ${getMatchColor(career.matchScore)} p-[3px]`}>
            <div className="w-full h-full bg-slate-900 rounded-[13px] flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white">{career.matchScore}%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Match</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300"><span className="font-semibold text-emerald-400">{career.growth}</span> growth</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm">
            <span className="text-slate-300 font-semibold">{career.salary}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm">
            <span className="text-slate-400">Readiness:</span>
            <span className={`font-semibold ${readiness >= 80 ? 'text-emerald-400' : readiness >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
              {readiness}%
            </span>
          </div>
        </div>

        {/* Skill preview */}
        <div className="mb-5">
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
            <span>SKILL SNAPSHOT</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {career.skills.map(skill => {
              const gap = skill.required - skill.level;
              return (
                <div key={skill.name} className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg">
                  {gap <= 1 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  )}
                  <span className="text-xs text-slate-300 truncate">{skill.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top gaps callout */}
        {topGaps.length > 0 && (
          <div className="mb-5 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <p className="text-xs text-amber-400/80 font-medium mb-1">Key areas to develop:</p>
            <p className="text-sm text-amber-200/70">{topGaps.map(s => s.name).join(', ')}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
          <button
            onClick={() => navigate(`/career/${career.id}`)}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group/btn"
          >
            View Details & Roadmap
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => toggleSaved(career.id)}
            className={`p-3 rounded-xl border transition-all ${
              career.saved
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title={career.saved ? 'Unsave' : 'Save'}
          >
            {career.saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
          <button
            onClick={() => toggleCompare(career.id)}
            className={`p-3 rounded-xl border transition-all ${
              isComparing
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title={isComparing ? 'Remove from compare' : 'Add to compare'}
          >
            <GitCompareArrows className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { careers, compareList } = useCareer();
  const navigate = useNavigate();

  if (careers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-slate-400 text-lg mb-4">No analysis results yet.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-medium">Go to Home to analyze your profile</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Your Career Matches</h2>
          <p className="text-slate-400 text-sm mt-1">{careers.length} careers analyzed based on your profile</p>
        </div>
        <div className="flex items-center gap-3">
          {compareList.length >= 2 && (
            <button
              onClick={() => navigate('/compare')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <GitCompareArrows className="w-4 h-4" />
              Compare ({compareList.length})
            </button>
          )}
          <Link
            to="/"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            New Analysis
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {careers.map(career => (
          <CareerCard key={career.id} career={career} />
        ))}
      </div>
    </div>
  );
}
