import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Skill {
  name: string;
  level: number;
  required: number;
  category: string;
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  skills: string[];
  completed: boolean;
}

export interface Resource {
  name: string;
  platform: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  free: boolean;
  skillTag: string;
}

export interface CareerMatch {
  id: string;
  title: string;
  matchScore: number;
  salary: string;
  growth: string;
  skills: Skill[];
  description: string;
  roadmap: RoadmapPhase[];
  resources: Resource[];
  saved: boolean;
}

export interface UserProfile {
  skills: string[];
  interests: string;
  experience: string;
  education: string;
  workStyle: string;
}

interface CareerContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  careers: CareerMatch[];
  setCareers: (careers: CareerMatch[]) => void;
  analyzing: boolean;
  setAnalyzing: (v: boolean) => void;
  toggleSaved: (id: string) => void;
  updateSkillLevel: (careerId: string, skillName: string, newLevel: number) => void;
  toggleRoadmapPhase: (careerId: string, phaseIdx: number) => void;
  compareList: string[];
  toggleCompare: (id: string) => void;
}

const CareerContext = createContext<CareerContextType | null>(null);

export function CareerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    skills: [],
    interests: '',
    experience: '2-5',
    education: 'bachelors',
    workStyle: 'hybrid',
  });
  const [careers, setCareersState] = useState<CareerMatch[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const setCareers = useCallback((c: CareerMatch[]) => {
    setCareersState(c.map((career, i) => ({
      ...career,
      id: career.id || `career-${i}`,
      saved: career.saved ?? false,
    })));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setCareersState(prev => prev.map(c => c.id === id ? { ...c, saved: !c.saved } : c));
  }, []);

  const updateSkillLevel = useCallback((careerId: string, skillName: string, newLevel: number) => {
    setCareersState(prev => prev.map(c =>
      c.id === careerId
        ? { ...c, skills: c.skills.map(s => s.name === skillName ? { ...s, level: newLevel } : s) }
        : c
    ));
  }, []);

  const toggleRoadmapPhase = useCallback((careerId: string, phaseIdx: number) => {
    setCareersState(prev => prev.map(c =>
      c.id === careerId
        ? { ...c, roadmap: c.roadmap.map((p, i) => i === phaseIdx ? { ...p, completed: !p.completed } : p) }
        : c
    ));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }, []);

  return (
    <CareerContext.Provider value={{
      profile, setProfile, careers, setCareers, analyzing, setAnalyzing,
      toggleSaved, updateSkillLevel, toggleRoadmapPhase, compareList, toggleCompare,
    }}>
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const ctx = useContext(CareerContext);
  if (!ctx) throw new Error('useCareer must be used within CareerProvider');
  return ctx;
}
