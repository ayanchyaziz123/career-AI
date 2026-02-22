import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, TrendingUp, CheckCircle2, AlertCircle,
  GraduationCap, Clock, ExternalLink, Bookmark, BookmarkCheck, Star
} from 'lucide-react';
import { useCareer, Skill, RoadmapPhase, Resource } from '../context/CareerContext';

function SkillBar({ skill, careerId }: { skill: Skill; careerId: string }) {
  const { updateSkillLevel } = useCareer();
  const gap = skill.required - skill.level;
  const progress = Math.min((skill.level / skill.required) * 100, 100);

  const gapColor = gap <= 1 ? 'text-emerald-400' : gap <= 3 ? 'text-amber-400' : 'text-rose-400';
  const barColor = gap <= 1 ? 'from-emerald-500 to-teal-500' : gap <= 3 ? 'from-amber-500 to-yellow-500' : 'from-rose-500 to-pink-500';

  return (
    <div className="bg-slate-800/30 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h5 className="font-semibold text-slate-200">{skill.name}</h5>
          <p className="text-xs text-slate-500 mt-0.5">{skill.category}</p>
        </div>
        <div className="flex items-center gap-2">
          {gap <= 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
          <span className={`text-sm font-bold ${gapColor}`}>
            {gap > 0 ? `+${gap} needed` : 'Ready'}
          </span>
        </div>
      </div>

      {/* Interactive slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Your Level: {skill.level}/10</span>
          <span>Required: {skill.required}/10</span>
        </div>

        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full bg-gradient-to-r ${barColor} transition-all duration-500 rounded-full`}
            style={{ width: `${progress}%` }}
          />
          {/* Required marker */}
          <div
            className="absolute top-0 w-0.5 h-full bg-slate-300/60"
            style={{ left: `${(skill.required / 10) * 100}%` }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={10}
          value={skill.level}
          onChange={e => updateSkillLevel(careerId, skill.name, parseInt(e.target.value))}
          className="w-full h-1 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:shadow-lg"
        />
        <p className="text-[11px] text-slate-600">Drag to adjust your self-assessment</p>
      </div>
    </div>
  );
}

function RoadmapSection({ phases, careerId }: { phases: RoadmapPhase[]; careerId: string }) {
  const { toggleRoadmapPhase } = useCareer();

  return (
    <div className="space-y-4">
      {phases.map((phase, idx) => (
        <div
          key={idx}
          className={`relative pl-8 ${idx < phases.length - 1 ? 'pb-6' : ''}`}
        >
          {/* Timeline line */}
          {idx < phases.length - 1 && (
            <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-700" />
          )}

          {/* Timeline dot */}
          <div
            className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
              phase.completed
                ? 'bg-emerald-500 border-emerald-400'
                : 'bg-slate-800 border-slate-600 hover:border-indigo-400'
            }`}
            onClick={() => toggleRoadmapPhase(careerId, idx)}
          >
            {phase.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
          </div>

          <div className={`bg-slate-800/30 rounded-xl p-5 transition-all ${phase.completed ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-bold text-lg ${phase.completed ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                {phase.title}
              </h4>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                {phase.duration}
              </span>
            </div>
            <ul className="space-y-2">
              {phase.skills.map((skill, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-indigo-400 mt-1">-</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourceCardComponent({ resource }: { resource: Resource }) {
  const difficultyColor = {
    Beginner: 'bg-emerald-500/15 text-emerald-400',
    Intermediate: 'bg-amber-500/15 text-amber-400',
    Advanced: 'bg-rose-500/15 text-rose-400',
  }[resource.difficulty];

  return (
    <div className="bg-slate-800/30 rounded-xl p-5 hover:bg-slate-800/50 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h5 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{resource.name}</h5>
          <p className="text-xs text-slate-500 mt-1">{resource.platform}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${difficultyColor}`}>
          {resource.difficulty}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          {resource.duration}
        </span>
        {resource.free ? (
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/15 text-emerald-400">FREE</span>
        ) : (
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-700/50 text-slate-400">PAID</span>
        )}
        <span className="px-2 py-0.5 text-[11px] rounded-full bg-indigo-500/10 text-indigo-400">{resource.skillTag}</span>
      </div>
    </div>
  );
}

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { careers, toggleSaved } = useCareer();
  const navigate = useNavigate();

  const career = careers.find(c => c.id === id);

  if (!career) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-slate-400 text-lg mb-4">Career not found.</p>
        <Link to="/results" className="text-indigo-400 hover:text-indigo-300 font-medium">Back to results</Link>
      </div>
    );
  }

  const readiness = Math.round(career.skills.reduce((s, sk) => s + (sk.level / sk.required) * 100, 0) / career.skills.length);
  const completedPhases = career.roadmap.filter(p => p.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fadeIn">
      {/* Back & Title */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Results
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">{career.title}</h1>
          <p className="text-slate-400 max-w-2xl">{career.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{career.matchScore}%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Match</div>
          </div>
          <div className="w-px h-12 bg-slate-700" />
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">{readiness}%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Ready</div>
          </div>
          <div className="w-px h-12 bg-slate-700" />
          <button
            onClick={() => toggleSaved(career.id)}
            className={`p-3 rounded-xl border transition-all ${
              career.saved ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {career.saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Salary Range', value: career.salary, icon: Star },
          { label: 'Job Growth', value: career.growth, icon: TrendingUp },
          { label: 'Skills Gap', value: `${career.skills.filter(s => s.required - s.level > 2).length} key areas`, icon: AlertCircle },
          { label: 'Roadmap Progress', value: `${completedPhases}/${career.roadmap.length} phases`, icon: GraduationCap },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-2">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
            <div className="text-lg font-bold text-slate-200">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Skill Assessment */}
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-100 mb-6">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Skill Gap Assessment
          </h2>
          <p className="text-sm text-slate-500 mb-4">Adjust sliders to update your self-assessment in real-time.</p>
          <div className="space-y-4">
            {career.skills.map(skill => (
              <SkillBar key={skill.name} skill={skill} careerId={career.id} />
            ))}
          </div>
        </div>

        {/* Right: Learning Roadmap */}
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-100 mb-6">
            <GraduationCap className="w-6 h-6 text-purple-400" />
            Learning Roadmap
          </h2>
          <p className="text-sm text-slate-500 mb-4">Click phase circles to mark as completed.</p>
          <RoadmapSection phases={career.roadmap} careerId={career.id} />
        </div>
      </div>

      {/* Resources */}
      <div className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-100 mb-6">
          <BookOpen className="w-6 h-6 text-amber-400" />
          Recommended Resources
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {career.resources.map((resource, i) => (
            <ResourceCardComponent key={i} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
}
