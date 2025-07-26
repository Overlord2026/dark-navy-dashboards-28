import { useState, useEffect, useCallback } from "react";

export interface ModuleProgress {
  id: string;
  completed: boolean;
  progress: number; // 0-100
  completedAt?: string;
  quizScore?: number;
  bookmarked: boolean;
  timeSpent: number; // minutes
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  modules: string[];
  completedModules: string[];
  totalProgress: number;
}

export function useEducationProgress() {
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>("");

  // Load progress from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('education-progress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setModuleProgress(data.moduleProgress || {});
        setLearningPaths(data.learningPaths || []);
        setSelectedPersona(data.selectedPersona || "");
      } catch (error) {
        console.error('Failed to parse education progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const data = {
      moduleProgress,
      learningPaths,
      selectedPersona
    };
    localStorage.setItem('education-progress', JSON.stringify(data));
  }, [moduleProgress, learningPaths, selectedPersona]);

  const updateModuleProgress = useCallback((moduleId: string, updates: Partial<ModuleProgress>) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: {
        id: moduleId,
        completed: false,
        progress: 0,
        bookmarked: false,
        timeSpent: 0,
        ...prev[moduleId],
        ...updates
      }
    }));
  }, []);

  const completeModule = useCallback((moduleId: string, quizScore?: number) => {
    updateModuleProgress(moduleId, {
      completed: true,
      progress: 100,
      completedAt: new Date().toISOString(),
      quizScore
    });
  }, [updateModuleProgress]);

  const bookmarkModule = useCallback((moduleId: string, bookmarked: boolean) => {
    updateModuleProgress(moduleId, { bookmarked });
  }, [updateModuleProgress]);

  const addTimeSpent = useCallback((moduleId: string, minutes: number) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: {
        id: moduleId,
        completed: false,
        progress: 0,
        bookmarked: false,
        timeSpent: 0,
        ...prev[moduleId],
        timeSpent: (prev[moduleId]?.timeSpent || 0) + minutes
      }
    }));
  }, []);

  const getModuleProgress = useCallback((moduleId: string): ModuleProgress => {
    return moduleProgress[moduleId] || {
      id: moduleId,
      completed: false,
      progress: 0,
      bookmarked: false,
      timeSpent: 0
    };
  }, [moduleProgress]);

  const getCompletedModules = useCallback(() => {
    return Object.values(moduleProgress).filter(p => p.completed);
  }, [moduleProgress]);

  const getBookmarkedModules = useCallback(() => {
    return Object.values(moduleProgress).filter(p => p.bookmarked);
  }, [moduleProgress]);

  const getTotalTimeSpent = useCallback(() => {
    return Object.values(moduleProgress).reduce((total, p) => total + p.timeSpent, 0);
  }, [moduleProgress]);

  const getOverallProgress = useCallback(() => {
    const modules = Object.values(moduleProgress);
    if (modules.length === 0) return 0;
    
    const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
    return Math.round(totalProgress / modules.length);
  }, [moduleProgress]);

  const createLearningPath = useCallback((persona: string, modules: string[]) => {
    const pathId = `path-${persona}`;
    const existingPath = learningPaths.find(p => p.id === pathId);
    
    if (!existingPath) {
      const newPath: LearningPath = {
        id: pathId,
        name: `${persona.replace('-', ' ')} Learning Path`,
        description: `Curated learning path for ${persona.replace('-', ' ')}`,
        modules,
        completedModules: [],
        totalProgress: 0
      };
      
      setLearningPaths(prev => [...prev, newPath]);
    }
    
    setSelectedPersona(persona);
  }, [learningPaths]);

  const updateLearningPathProgress = useCallback((pathId: string) => {
    setLearningPaths(prev => prev.map(path => {
      if (path.id === pathId) {
        const completedModules = path.modules.filter(moduleId => 
          moduleProgress[moduleId]?.completed
        );
        const totalProgress = path.modules.length > 0 
          ? Math.round((completedModules.length / path.modules.length) * 100)
          : 0;
        
        return {
          ...path,
          completedModules,
          totalProgress
        };
      }
      return path;
    }));
  }, [moduleProgress]);

  // Update learning path progress whenever module progress changes
  useEffect(() => {
    learningPaths.forEach(path => {
      updateLearningPathProgress(path.id);
    });
  }, [moduleProgress, learningPaths, updateLearningPathProgress]);

  const resetProgress = useCallback(() => {
    setModuleProgress({});
    setLearningPaths([]);
    setSelectedPersona("");
    localStorage.removeItem('education-progress');
  }, []);

  return {
    moduleProgress,
    learningPaths,
    selectedPersona,
    updateModuleProgress,
    completeModule,
    bookmarkModule,
    addTimeSpent,
    getModuleProgress,
    getCompletedModules,
    getBookmarkedModules,
    getTotalTimeSpent,
    getOverallProgress,
    createLearningPath,
    resetProgress
  };
}