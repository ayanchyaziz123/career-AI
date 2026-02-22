import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Target, Award, Sparkles, ArrowRight, X, Briefcase, MapPin } from 'lucide-react';
import { useCareer } from '../context/CareerContext';
import { mockCareers } from '../data/mockData';

export default function HomePage() {
  const navigate = useNavigate();
  const { profile, setProfile, setCareers, analyzing, setAnalyzing } = useCareer();
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (value: string) => {
    const skill = value.trim();
    if (skill && !profile.skills.includes(skill)) {
      setProfile(p => ({ ...p, skills: [...p.skills, skill] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const analyzeCareer = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/api/analyze/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error('Backend error');

      const data = await res.json();

      // Merge ML scores/skills with static content from mockData
      const merged = data.careers.map((mlCareer: { id: string; matchScore: number; skills: any[] }) => {
        const staticData = mockCareers.find(m => m.id === mlCareer.id);
        if (!staticData) return null;
        return { ...staticData, matchScore: mlCareer.matchScore, skills: mlCareer.skills };
      }).filter(Boolean);

      setCareers(merged);
    } catch {
      // Backend unreachable — fall back to mock data
      setCareers(mockCareers);
    }
    setAnalyzing(false);
    navigate('/results');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <header className="text-center mb-16 animate-fadeIn">
        <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full backdrop-blur-sm">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium text-indigo-300 tracking-wide">AI-POWERED CAREER INTELLIGENCE</span>
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent tracking-tight"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          Career Pathfinder
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Discover your ideal career path with AI-driven matching, personalized skill gap analysis, and curated learning roadmaps.
        </p>
      </header>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fadeIn">
        {[
          { icon: Target, label: 'Career Matching' },
          { icon: Zap, label: 'Skill Gap Analysis' },
          { icon: MapPin, label: 'Learning Roadmaps' },
          { icon: Briefcase, label: 'Resource Suggestions' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 border border-slate-700/40 rounded-full text-sm text-slate-300">
            <Icon className="w-4 h-4 text-indigo-400" />
            {label}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto animate-slideUp">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="space-y-8">
            {/* Skills Input with chips */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-indigo-400" />
                Your Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-sm text-indigo-300"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => skillInput && addSkill(skillInput)}
                placeholder="Type a skill and press Enter (e.g., JavaScript, React, Python)"
                className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                <Target className="w-4 h-4 text-purple-400" />
                Interests & Goals
              </label>
              <textarea
                value={profile.interests}
                onChange={e => setProfile(p => ({ ...p, interests: e.target.value }))}
                placeholder="e.g., Building user interfaces, solving complex problems, working with data"
                rows={3}
                className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Row: Experience, Education, Work Style */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-pink-400" />
                  Experience
                </label>
                <select
                  value={profile.experience}
                  onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="0-2">0–2 years</option>
                  <option value="2-5">2–5 years</option>
                  <option value="5-10">5–10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  Education
                </label>
                <select
                  value={profile.education}
                  onChange={e => setProfile(p => ({ ...p, education: e.target.value }))}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="self-taught">Self-Taught</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="associates">Associate's</option>
                  <option value="bachelors">Bachelor's</option>
                  <option value="masters">Master's</option>
                  <option value="phd">PhD</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Work Style
                </label>
                <select
                  value={profile.workStyle}
                  onChange={e => setProfile(p => ({ ...p, workStyle: e.target.value }))}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={analyzeCareer}
              disabled={analyzing}
              className="w-full mt-4 px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/50 hover:shadow-xl hover:shadow-indigo-900/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Your Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Career Matches
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
