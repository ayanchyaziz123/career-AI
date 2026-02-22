import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, BookmarkCheck, TrendingUp, Target, ArrowRight,
  CheckCircle2, AlertCircle, GraduationCap, Zap
} from 'lucide-react';
import { useCareer } from '../context/CareerContext';

function ProgressRing({ percent, size = 80, strokeWidth = 6, color = 'stroke-indigo-500' }: {
  percent: number; size?: number; strokeWidth?: number; color?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        className="text-slate-800" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth}
        className={color} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
}

export default function DashboardPage() {
  const { careers, profile } = useCareer();
  const savedCareers = careers.filter(c => c.saved);

  if (careers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <LayoutDashboard className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg mb-2">No data yet.</p>
        <p className="text-slate-500 text-sm mb-6">Complete a career analysis to populate your dashboard.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-medium">Get Started</Link>
      </div>
    );
  }

  // Aggregate stats
  const overallReadiness = Math.round(
    careers.reduce((s, c) => s + c.skills.reduce((ss, sk) => ss + (sk.level / sk.required) * 100, 0) / c.skills.length, 0) / careers.length
  );
  const totalPhases = careers.reduce((s, c) => s + c.roadmap.length, 0);
  const completedPhases = careers.reduce((s, c) => s + c.roadmap.filter(p => p.completed).length, 0);
  const topMatch = [...careers].sort((a, b) => b.matchScore - a.matchScore)[0];
  const allGaps = careers.flatMap(c => c.skills.filter(s => s.required - s.level > 2));
  const uniqueGapSkills = Array.from(new Set(allGaps.map(s => s.name)));

  // Category breakdown
  const categories = ['Technical', 'Soft Skills', 'Domain Knowledge'];
  const categoryStats = categories.map(cat => {
    const skills = careers.flatMap(c => c.skills.filter(s => s.category === cat));
    if (skills.length === 0) return { cat, avg: 0 };
    const avg = Math.round(skills.reduce((s, sk) => s + (sk.level / sk.required) * 100, 0) / skills.length);
    return { cat, avg };
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-7 h-7 text-indigo-400" />
        <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <ProgressRing percent={overallReadiness} color="stroke-indigo-500" />
            <span className="absolute text-sm font-bold text-slate-200">{overallReadiness}%</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Overall Readiness</div>
            <div className="text-lg font-bold text-slate-200">Across all careers</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-2">
            <Target className="w-3.5 h-3.5" />
            Best Match
          </div>
          <div className="text-lg font-bold text-slate-200">{topMatch.title}</div>
          <div className="text-2xl font-bold text-emerald-400">{topMatch.matchScore}%</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Roadmap Progress
          </div>
          <div className="text-2xl font-bold text-slate-200">{completedPhases}/{totalPhases}</div>
          <div className="text-sm text-slate-400">phases completed</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            Saved Careers
          </div>
          <div className="text-2xl font-bold text-slate-200">{savedCareers.length}</div>
          <div className="text-sm text-slate-400">of {careers.length} total</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column: Category readiness */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Category Readiness</h2>
          <div className="space-y-4">
            {categoryStats.map(({ cat, avg }) => {
              const colors: Record<string, string> = {
                Technical: 'stroke-indigo-500',
                'Soft Skills': 'stroke-emerald-500',
                'Domain Knowledge': 'stroke-amber-500',
              };
              const textColors: Record<string, string> = {
                Technical: 'text-indigo-400',
                'Soft Skills': 'text-emerald-400',
                'Domain Knowledge': 'text-amber-400',
              };
              return (
                <div key={cat} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                  <div className="relative flex items-center justify-center">
                    <ProgressRing percent={avg} size={60} strokeWidth={5} color={colors[cat]} />
                    <span className="absolute text-xs font-bold text-slate-300">{avg}%</span>
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${textColors[cat]}`}>{cat}</div>
                    <div className="text-xs text-slate-500">
                      {avg >= 80 ? 'Strong' : avg >= 60 ? 'Developing' : 'Needs work'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key gaps */}
          {uniqueGapSkills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Priority Skill Gaps
              </h3>
              <div className="flex flex-wrap gap-2">
                {uniqueGapSkills.slice(0, 8).map(name => (
                  <span key={name} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-300">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Career list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-200">
              {savedCareers.length > 0 ? 'Saved Careers' : 'All Careers'}
            </h2>
            <Link to="/results" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(savedCareers.length > 0 ? savedCareers : careers).map(career => {
              const readiness = Math.round(career.skills.reduce((s, sk) => s + (sk.level / sk.required) * 100, 0) / career.skills.length);
              const completed = career.roadmap.filter(p => p.completed).length;
              return (
                <Link
                  key={career.id}
                  to={`/career/${career.id}`}
                  className="block bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">{career.title}</h3>
                        {career.saved && <BookmarkCheck className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{career.salary}</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {career.growth}
                        </span>
                        <span>{completed}/{career.roadmap.length} phases done</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{career.matchScore}%</div>
                        <div className="text-[10px] text-slate-500">match</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${readiness >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{readiness}%</div>
                        <div className="text-[10px] text-slate-500">ready</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Profile summary */}
          <div className="mt-6 bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              Your Profile Summary
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-slate-500">Skills</div>
                <div className="text-slate-300">{profile.skills.length > 0 ? profile.skills.join(', ') : 'Not specified'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Experience</div>
                <div className="text-slate-300">{profile.experience} years</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Education</div>
                <div className="text-slate-300 capitalize">{profile.education.replace('-', ' ')}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Work Style</div>
                <div className="text-slate-300 capitalize">{profile.workStyle}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
