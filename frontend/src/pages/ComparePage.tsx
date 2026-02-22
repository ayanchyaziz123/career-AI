import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, CheckCircle2, AlertCircle, Star, GitCompareArrows } from 'lucide-react';
import { useCareer, CareerMatch } from '../context/CareerContext';

function RadarChart({ careers }: { careers: CareerMatch[] }) {
  // CSS-only radar-style comparison using category averages
  const categories = ['Technical', 'Soft Skills', 'Domain Knowledge'];
  const colors = ['text-indigo-400', 'text-emerald-400', 'text-amber-400'];
  const bgColors = ['bg-indigo-500/20', 'bg-emerald-500/20', 'bg-amber-500/20'];

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-slate-200 mb-5">Skill Category Comparison</h3>
      <div className="space-y-6">
        {categories.map((cat, ci) => {
          return (
            <div key={cat}>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{cat}</div>
              <div className="space-y-2">
                {careers.map((career, i) => {
                  const catSkills = career.skills.filter(s => s.category === cat);
                  if (catSkills.length === 0) return null;
                  const avgReadiness = Math.round(catSkills.reduce((s, sk) => s + (sk.level / sk.required) * 100, 0) / catSkills.length);
                  const barColors = ['from-indigo-500 to-blue-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500'];
                  return (
                    <div key={career.id} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-40 truncate">{career.title}</span>
                      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${barColors[i % barColors.length]} rounded-full transition-all duration-700`}
                          style={{ width: `${avgReadiness}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300 w-10 text-right">{avgReadiness}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const { careers, compareList, toggleCompare } = useCareer();
  const selected = careers.filter(c => compareList.includes(c.id));

  if (selected.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <GitCompareArrows className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg mb-2">Select at least 2 careers to compare.</p>
        <p className="text-slate-500 text-sm mb-6">Go to Results and click the compare icon on career cards.</p>
        <Link to="/results" className="text-indigo-400 hover:text-indigo-300 font-medium">Back to Results</Link>
      </div>
    );
  }

  const allSkillNames = Array.from(new Set(selected.flatMap(c => c.skills.map(s => s.name))));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fadeIn">
      <Link to="/results" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Results
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <GitCompareArrows className="w-7 h-7 text-purple-400" />
        <h1 className="text-3xl font-bold text-slate-100">Career Comparison</h1>
      </div>

      {/* Overview cards */}
      <div className={`grid gap-4 mb-8 ${selected.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {selected.map(career => {
          const readiness = Math.round(career.skills.reduce((s, sk) => s + (sk.level / sk.required) * 100, 0) / career.skills.length);
          return (
            <div key={career.id} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 relative group">
              <button
                onClick={() => toggleCompare(career.id)}
                className="absolute top-3 right-3 text-slate-600 hover:text-rose-400 text-xs transition-colors opacity-0 group-hover:opacity-100"
              >
                Remove
              </button>
              <h3 className="text-xl font-bold text-slate-200 mb-3">{career.title}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500">Match</div>
                  <div className="text-2xl font-bold text-white">{career.matchScore}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Readiness</div>
                  <div className={`text-2xl font-bold ${readiness >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{readiness}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Salary</div>
                  <div className="text-sm font-semibold text-slate-300">{career.salary}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Growth</div>
                  <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {career.growth}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar-style chart */}
      <RadarChart careers={selected} />

      {/* Skill comparison table */}
      <div className="mt-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-200">Skill-by-Skill Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-3 text-left text-xs text-slate-500 uppercase tracking-wider">Skill</th>
                {selected.map(c => (
                  <th key={c.id} className="px-6 py-3 text-left text-xs text-slate-500 uppercase tracking-wider">{c.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allSkillNames.map(name => (
                <tr key={name} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-6 py-3 text-sm font-medium text-slate-300">{name}</td>
                  {selected.map(career => {
                    const skill = career.skills.find(s => s.name === name);
                    if (!skill) return <td key={career.id} className="px-6 py-3 text-sm text-slate-600">N/A</td>;
                    const gap = skill.required - skill.level;
                    return (
                      <td key={career.id} className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          {gap <= 1 ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                          )}
                          <span className="text-sm text-slate-300">{skill.level}/{skill.required}</span>
                          <span className={`text-xs font-medium ${gap <= 1 ? 'text-emerald-400' : gap <= 3 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {gap > 0 ? `(+${gap})` : '(Ready)'}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
