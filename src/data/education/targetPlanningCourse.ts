export const targetPlanningCourse = {
  id: "target-planning-mastery",
  title: "Target Planning Mastery: The 12th Video Course",
  description: "Master the art of target-based financial planning. Learn how to set, track, and achieve specific financial goals with precision and accountability.",
  level: "Advanced" as const,
  duration: "4.5 hours",
  moduleCount: 12,
  isPaid: false,
  trackEligible: true,
  certificateEligible: true,
  instructor: "Michael Chen, CFP®, CFA",
  learningObjectives: [
    "Define SMART financial targets with measurable outcomes",
    "Create accountability systems for goal achievement",
    "Implement tracking methodologies for complex financial goals",
    "Design custom target-based investment strategies",
    "Build review cycles that ensure consistent progress"
  ],
  modules: [
    {
      id: "tp-1",
      title: "Target Setting Fundamentals",
      description: "Learn the science behind effective financial target setting",
      duration: "22 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      knowledgeCheck: {
        question: "What makes a financial target 'SMART'?",
        options: [
          "Specific, Measurable, Achievable, Relevant, Time-bound",
          "Simple, Manageable, Attainable, Realistic, Timely",
          "Strategic, Meaningful, Actionable, Reasonable, Trackable"
        ],
        correctAnswer: 0
      }
    },
    {
      id: "tp-2", 
      title: "Behavioral Finance in Target Planning",
      description: "Understanding psychological barriers to goal achievement",
      duration: "26 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      knowledgeCheck: {
        question: "Which bias most commonly derails long-term financial targets?",
        options: [
          "Confirmation bias",
          "Present bias (immediate gratification)",
          "Anchoring bias"
        ],
        correctAnswer: 1
      }
    },
    {
      id: "tp-3",
      title: "Multi-Generational Target Framework",
      description: "Planning targets that span generations and family structures",
      duration: "31 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      knowledgeCheck: {
        question: "What's the recommended review frequency for generational wealth targets?",
        options: [
          "Monthly",
          "Quarterly", 
          "Annually with major life events"
        ],
        correctAnswer: 2
      }
    },
    {
      id: "tp-4",
      title: "Target-Based Portfolio Construction",
      description: "Aligning investment strategy with specific target outcomes",
      duration: "28 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      knowledgeCheck: {
        question: "How should portfolio allocation change as you approach a target date?",
        options: [
          "Become more aggressive to maximize gains",
          "Gradually shift to more conservative allocations",
          "Maintain the same allocation throughout"
        ],
        correctAnswer: 1
      }
    },
    {
      id: "tp-5",
      title: "Risk Management for Target Planning",
      description: "Protecting your targets against market volatility and life changes",
      duration: "24 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "tp-6",
      title: "Tax-Efficient Target Strategies",
      description: "Maximizing after-tax returns in pursuit of your targets",
      duration: "29 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "tp-7",
      title: "Technology Tools for Target Tracking",
      description: "Leveraging modern tools and platforms for goal monitoring",
      duration: "19 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "tp-8",
      title: "Target Adjustment Strategies",
      description: "When and how to modify targets based on changing circumstances",
      duration: "27 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "tp-9",
      title: "Business Owner Target Planning",
      description: "Special considerations for entrepreneurs and business owners",
      duration: "33 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "tp-10",
      title: "Estate Planning Target Integration",
      description: "Incorporating estate and legacy goals into target planning",
      duration: "25 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "tp-11",
      title: "Stress Testing Your Targets",
      description: "Scenario planning and stress testing target feasibility",
      duration: "23 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "tp-12",
      title: "Implementation and Next Steps",
      description: "Putting it all together and creating your action plan",
      duration: "18 min",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      finalProject: {
        title: "Create Your Personal Target Plan",
        description: "Develop a comprehensive target plan using all course concepts",
        deliverables: [
          "3-5 SMART financial targets",
          "Implementation timeline",
          "Risk management strategy",
          "Review and adjustment schedule"
        ]
      }
    }
  ],
  prerequisites: ["financial-planning-fundamentals"],
  nextSteps: {
    cta: "Book a personalized target plan review",
    description: "Work with our CFP® team to refine and implement your target plan",
    buttonText: "Schedule My Target Plan Review"
  },
  ghlIntegration: {
    courseId: "target-planning-mastery-v1",
    completionTriggers: ["module_completed", "course_completed", "certificate_earned"],
    leadScoringEvents: {
      moduleCompletion: 5,
      knowledgeCheckPassed: 3,
      finalProjectSubmitted: 15,
      courseCompleted: 25
    }
  }
};