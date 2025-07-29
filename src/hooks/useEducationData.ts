import { useMemo, useCallback } from "react";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completed: boolean;
  videoUrl?: string;
  resources: string[];
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: number;
  completed: boolean;
  score?: number;
  timeLimit: number; // in minutes
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  progress: number; // percentage
}

export interface EducationAnalytics {
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
  streak: number;
  certificates: number;
  averageQuizScore: number;
}

// Mock data - replace with actual API calls
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Investment Banking',
    description: 'Learn the fundamentals of investment banking and financial markets',
    duration: 45,
    difficulty: 'beginner',
    category: 'finance',
    completed: true,
    videoUrl: 'https://example.com/video1',
    resources: ['Investment Banking Basics.pdf', 'Market Analysis Tools']
  },
  {
    id: '2',
    title: 'Portfolio Management Strategies',
    description: 'Advanced techniques for managing investment portfolios',
    duration: 60,
    difficulty: 'intermediate',
    category: 'finance',
    completed: false,
    resources: ['Portfolio Theory.pdf', 'Risk Management Guide']
  },
  {
    id: '3',
    title: 'Family Office Operations',
    description: 'Understanding the structure and operations of family offices',
    duration: 35,
    difficulty: 'beginner',
    category: 'family-office',
    completed: false,
    resources: ['Family Office Guide.pdf']
  }
];

const mockQuizzes: Quiz[] = [
  {
    id: '1',
    lessonId: '1',
    title: 'Investment Banking Fundamentals Quiz',
    questions: 10,
    completed: true,
    score: 85,
    timeLimit: 15
  },
  {
    id: '2',
    lessonId: '2',
    title: 'Portfolio Management Assessment',
    questions: 15,
    completed: false,
    timeLimit: 20
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Financial Advisor Certification',
    description: 'Complete certification program for financial advisors',
    lessons: ['1', '2', '3'],
    estimatedHours: 40,
    difficulty: 'intermediate',
    category: 'certification',
    progress: 33
  },
  {
    id: '2',
    title: 'Family Office Management',
    description: 'Comprehensive training for family office professionals',
    lessons: ['3'],
    estimatedHours: 25,
    difficulty: 'advanced',
    category: 'family-office',
    progress: 10
  }
];

export const useEducationData = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();

  // Memoized data
  const lessons = useMemo(() => mockLessons, []);
  const quizzes = useMemo(() => mockQuizzes, []);
  const learningPaths = useMemo(() => mockLearningPaths, []);

  // Memoized analytics
  const analytics = useMemo((): EducationAnalytics => {
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(lesson => lesson.completed).length;
    const totalHours = lessons.reduce((sum, lesson) => sum + (lesson.duration / 60), 0);
    const completedQuizzes = quizzes.filter(quiz => quiz.completed);
    const averageQuizScore = completedQuizzes.length > 0 
      ? completedQuizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / completedQuizzes.length
      : 0;

    return {
      totalLessons,
      completedLessons,
      totalHours,
      streak: 5, // Mock streak data
      certificates: 2, // Mock certificates
      averageQuizScore
    };
  }, [lessons, quizzes]);

  // Memoized filtered data
  const featuredLessons = useMemo(() => 
    lessons.filter(lesson => lesson.difficulty === 'beginner').slice(0, 3),
    [lessons]
  );

  const recentLessons = useMemo(() => 
    lessons.slice().reverse().slice(0, 5),
    [lessons]
  );

  const availableQuizzes = useMemo(() => 
    quizzes.filter(quiz => !quiz.completed),
    [quizzes]
  );

  // Callback functions
  const startLesson = useCallback((lessonId: string) => {
    console.info('Starting lesson:', lessonId);
    // In real app: track lesson start, update progress
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    console.info('Completing lesson:', lessonId);
    // In real app: mark lesson as complete, update progress
  }, []);

  const startQuiz = useCallback((quizId: string) => {
    console.info('Starting quiz:', quizId);
    // In real app: initialize quiz session
  }, []);

  const submitQuizAnswer = useCallback((quizId: string, questionId: string, answer: any) => {
    console.info('Quiz answer submitted:', { quizId, questionId, answer });
    // In real app: submit answer, calculate score
  }, []);

  const downloadResource = useCallback((resourceName: string) => {
    console.info('Downloading resource:', resourceName);
    // In real app: handle resource download
  }, []);

  const searchLessons = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(lowercaseQuery) ||
      lesson.description.toLowerCase().includes(lowercaseQuery) ||
      lesson.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [lessons]);

  const getLessonsByCategory = useCallback((category: string) => {
    return lessons.filter(lesson => lesson.category === category);
  }, [lessons]);

  const getLearningPathProgress = useCallback((pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return 0;
    
    const pathLessons = lessons.filter(lesson => path.lessons.includes(lesson.id));
    const completedPathLessons = pathLessons.filter(lesson => lesson.completed);
    
    return pathLessons.length > 0 ? (completedPathLessons.length / pathLessons.length) * 100 : 0;
  }, [lessons, learningPaths]);

  // Feature access checks
  const hasAdvancedCourses = useMemo(() => 
    checkFeatureAccess('premium'), [checkFeatureAccess]
  );

  const hasCertifications = useMemo(() => 
    checkFeatureAccess('premium'), [checkFeatureAccess]
  );

  const hasPersonalizedLearning = useMemo(() => 
    checkFeatureAccess('premium'), [checkFeatureAccess]
  );

  return {
    // Data
    lessons,
    quizzes,
    learningPaths,
    analytics,
    featuredLessons,
    recentLessons,
    availableQuizzes,
    
    // Actions
    startLesson,
    completeLesson,
    startQuiz,
    submitQuizAnswer,
    downloadResource,
    searchLessons,
    getLessonsByCategory,
    getLearningPathProgress,
    
    // Feature flags
    hasAdvancedCourses,
    hasCertifications,
    hasPersonalizedLearning,
    
    // Loading states (for real API integration)
    isLoading: false,
    error: null
  };
};