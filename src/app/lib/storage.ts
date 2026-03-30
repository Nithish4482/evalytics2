// LocalStorage utilities for data persistence

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'judge' | 'participant';
  name: string;
}

export interface CategoryWeightage {
  category: string;
  weight: number; // percentage (0-100)
}

export interface Event {
  id: string;
  name: string;
  type: 'hackathon' | 'quiz' | 'coding' | 'paper-presentation' | 'other';
  description: string;
  categories: string[];
  categoryWeights: CategoryWeightage[]; // NEW: Weightage for each category
  evaluationType: 'individual' | 'team';
  assignedJudges: string[]; // user IDs
  createdAt: string;
  status: 'active' | 'completed';
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  eventId: string;
  teamName?: string;
  userId: string;
}

export interface Evaluation {
  id: string;
  eventId: string;
  participantId: string;
  judgeId: string;
  scores: Record<string, number>; // category -> score
  comments: string;
  totalScore: number;
  weightedScore: number; // NEW: Weighted total score
  performanceLevel: 'red' | 'orange' | 'yellow' | 'green';
  readinessLevel: 'beginner' | 'intermediate' | 'advanced'; // NEW: Competition readiness
  weakestCategories: string[]; // NEW: Areas to improve
  submittedAt: string;
}

export const EVALUATION_CATEGORIES = [
  'Innovation & Creativity',
  'Technical Implementation',
  'Problem Solving',
  'Code Quality',
  'User Interface Design',
  'User Experience',
  'Presentation Skills',
  'Team Collaboration',
  'Project Completion',
  'Scalability',
  'Documentation',
  'Originality',
  'Business Viability',
  'Impact & Relevance',
  'Research Quality',
  'Data Analysis',
  'Communication',
  'Time Management',
  'Functionality',
  'Security & Best Practices'
];

// Initialize default data
export const initializeDefaultData = () => {
  if (!localStorage.getItem('evalytics_users')) {
    const defaultUsers: User[] = [
      {
        id: 'admin-1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User'
      },
      {
        id: 'judge-1',
        username: 'judge1',
        password: 'judge123',
        role: 'judge',
        name: 'Judge One'
      },
      {
        id: 'judge-2',
        username: 'judge2',
        password: 'judge123',
        role: 'judge',
        name: 'Judge Two'
      },
      {
        id: 'participant-1',
        username: 'participant1',
        password: 'part123',
        role: 'participant',
        name: 'John Doe'
      }
    ];
    localStorage.setItem('evalytics_users', JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem('evalytics_events')) {
    // Create a demo event
    const demoEvents: Event[] = [
      {
        id: 'event-demo-1',
        name: 'Spring Hackathon 2026',
        type: 'hackathon',
        description: 'Annual spring hackathon featuring innovative tech solutions',
        categories: [
          'Innovation & Creativity',
          'Technical Implementation',
          'Code Quality',
          'Presentation Skills',
          'User Interface Design'
        ],
        categoryWeights: [
          { category: 'Innovation & Creativity', weight: 20 },
          { category: 'Technical Implementation', weight: 20 },
          { category: 'Code Quality', weight: 20 },
          { category: 'Presentation Skills', weight: 20 },
          { category: 'User Interface Design', weight: 20 }
        ],
        evaluationType: 'team',
        assignedJudges: ['judge-1', 'judge-2'],
        createdAt: '2026-03-15T10:00:00.000Z',
        status: 'active'
      }
    ];
    localStorage.setItem('evalytics_events', JSON.stringify(demoEvents));
  }

  if (!localStorage.getItem('evalytics_participants')) {
    // Create demo participants
    const demoParticipants: Participant[] = [
      {
        id: 'part-demo-1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        eventId: 'event-demo-1',
        teamName: 'Tech Innovators',
        userId: 'user-demo-1'
      },
      {
        id: 'part-demo-2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        eventId: 'event-demo-1',
        teamName: 'Code Warriors',
        userId: 'user-demo-2'
      },
      {
        id: 'part-demo-3',
        name: 'John Doe',
        email: 'john@example.com',
        eventId: 'event-demo-1',
        teamName: 'Future Builders',
        userId: 'participant-1'
      }
    ];
    localStorage.setItem('evalytics_participants', JSON.stringify(demoParticipants));
  }

  if (!localStorage.getItem('evalytics_evaluations')) {
    // Create a demo evaluation
    const demoEvaluations: Evaluation[] = [
      {
        id: 'eval-demo-1',
        eventId: 'event-demo-1',
        participantId: 'part-demo-1',
        judgeId: 'judge-1',
        scores: {
          'Innovation & Creativity': 85,
          'Technical Implementation': 78,
          'Code Quality': 82,
          'Presentation Skills': 90,
          'User Interface Design': 88
        },
        comments: 'Excellent work! The team showed great creativity and technical skills. The presentation was clear and engaging. Minor improvements could be made in code documentation.',
        totalScore: 84.6,
        weightedScore: 84.6, // NEW: Weighted total score
        performanceLevel: 'green',
        readinessLevel: 'advanced', // NEW: Competition readiness
        weakestCategories: ['Technical Implementation', 'Code Quality', 'Innovation & Creativity'], // NEW: Areas to improve
        submittedAt: '2026-03-20T14:30:00.000Z'
      },
      {
        id: 'eval-demo-2',
        eventId: 'event-demo-1',
        participantId: 'part-demo-2',
        judgeId: 'judge-1',
        scores: {
          'Innovation & Creativity': 72,
          'Technical Implementation': 85,
          'Code Quality': 88,
          'Presentation Skills': 65,
          'User Interface Design': 70
        },
        comments: 'Strong technical implementation and good code quality. The presentation could be improved with better storytelling and visual aids.',
        totalScore: 76,
        weightedScore: 76,
        performanceLevel: 'yellow',
        readinessLevel: 'intermediate',
        weakestCategories: ['Presentation Skills', 'User Interface Design', 'Innovation & Creativity'],
        submittedAt: '2026-03-20T15:00:00.000Z'
      },
      {
        id: 'eval-demo-3',
        eventId: 'event-demo-1',
        participantId: 'part-demo-3',
        judgeId: 'judge-2',
        scores: {
          'Innovation & Creativity': 92,
          'Technical Implementation': 88,
          'Code Quality': 85,
          'Presentation Skills': 95,
          'User Interface Design': 90
        },
        comments: 'Outstanding performance across all categories! Excellent presentation skills and highly innovative solution. Keep up the great work!',
        totalScore: 90,
        weightedScore: 90,
        performanceLevel: 'green',
        readinessLevel: 'advanced',
        weakestCategories: ['Code Quality', 'Technical Implementation', 'Innovation & Creativity'],
        submittedAt: '2026-03-20T16:00:00.000Z'
      }
    ];
    localStorage.setItem('evalytics_evaluations', JSON.stringify(demoEvaluations));
  }
};

// User operations
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('evalytics_users') || '[]');
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(u => u.id === id);
};

export const getUsersByRole = (role: User['role']): User[] => {
  return getUsers().filter(u => u.role === role);
};

export const authenticateUser = (username: string, password: string): User | null => {
  const users = getUsers();
  return users.find(u => u.username === username && u.password === password) || null;
};

export const createUser = (user: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `${user.role}-${Date.now()}`
  };
  users.push(newUser);
  localStorage.setItem('evalytics_users', JSON.stringify(users));
  return newUser;
};

// Event operations
export const getEvents = (): Event[] => {
  return JSON.parse(localStorage.getItem('evalytics_events') || '[]');
};

export const getEventById = (id: string): Event | undefined => {
  return getEvents().find(e => e.id === id);
};

export const getEventsByJudge = (judgeId: string): Event[] => {
  return getEvents().filter(e => e.assignedJudges.includes(judgeId));
};

export const createEvent = (event: Omit<Event, 'id' | 'createdAt'>): Event => {
  const events = getEvents();
  const newEvent: Event = {
    ...event,
    id: `event-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  events.push(newEvent);
  localStorage.setItem('evalytics_events', JSON.stringify(events));
  return newEvent;
};

export const updateEvent = (id: string, updates: Partial<Event>): Event | null => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  events[index] = { ...events[index], ...updates };
  localStorage.setItem('evalytics_events', JSON.stringify(events));
  return events[index];
};

// Participant operations
export const getParticipants = (): Participant[] => {
  return JSON.parse(localStorage.getItem('evalytics_participants') || '[]');
};

export const getParticipantsByEvent = (eventId: string): Participant[] => {
  return getParticipants().filter(p => p.eventId === eventId);
};

export const getParticipantsByUser = (userId: string): Participant[] => {
  return getParticipants().filter(p => p.userId === userId);
};

export const createParticipant = (participant: Omit<Participant, 'id'>): Participant => {
  const participants = getParticipants();
  const newParticipant: Participant = {
    ...participant,
    id: `participant-${Date.now()}`
  };
  participants.push(newParticipant);
  localStorage.setItem('evalytics_participants', JSON.stringify(participants));
  return newParticipant;
};

// Evaluation operations
export const getEvaluations = (): Evaluation[] => {
  return JSON.parse(localStorage.getItem('evalytics_evaluations') || '[]');
};

export const getEvaluationsByEvent = (eventId: string): Evaluation[] => {
  return getEvaluations().filter(e => e.eventId === eventId);
};

export const getEvaluationByParticipant = (participantId: string): Evaluation | undefined => {
  return getEvaluations().find(e => e.participantId === participantId);
};

export const getEvaluationsByJudge = (judgeId: string): Evaluation[] => {
  return getEvaluations().filter(e => e.judgeId === judgeId);
};

export const calculatePerformanceLevel = (score: number): Evaluation['performanceLevel'] => {
  if (score <= 40) return 'red';
  if (score <= 60) return 'orange';
  if (score <= 80) return 'yellow';
  return 'green';
};

export const calculateReadinessLevel = (score: number): Evaluation['readinessLevel'] => {
  if (score <= 50) return 'beginner';
  if (score <= 70) return 'intermediate';
  return 'advanced';
};

export const calculateWeakestCategories = (scores: Record<string, number>, categoryWeights: CategoryWeightage[]): string[] => {
  const weightedScores: Record<string, number> = {};
  for (const category in scores) {
    const weight = categoryWeights.find(cw => cw.category === category)?.weight || 0;
    weightedScores[category] = scores[category] * (weight / 100);
  }
  const sortedCategories = Object.entries(weightedScores).sort((a, b) => a[1] - b[1]);
  return sortedCategories.slice(0, 3).map(([category]) => category);
};

export const createEvaluation = (evaluation: Omit<Evaluation, 'id' | 'totalScore' | 'performanceLevel' | 'submittedAt' | 'weightedScore' | 'readinessLevel' | 'weakestCategories'>): Evaluation => {
  const evaluations = getEvaluations();
  const event = getEventById(evaluation.eventId);
  
  const scores = Object.values(evaluation.scores);
  const totalScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  
  // Calculate weighted score
  let weightedScore = 0;
  if (event && event.categoryWeights) {
    event.categoryWeights.forEach(cw => {
      const score = evaluation.scores[cw.category] || 0;
      weightedScore += (score * cw.weight) / 100;
    });
  } else {
    weightedScore = totalScore;
  }
  
  const newEvaluation: Evaluation = {
    ...evaluation,
    id: `eval-${Date.now()}`,
    totalScore: Math.round(totalScore * 100) / 100,
    weightedScore: Math.round(weightedScore * 100) / 100,
    performanceLevel: calculatePerformanceLevel(weightedScore),
    readinessLevel: calculateReadinessLevel(weightedScore),
    weakestCategories: calculateWeakestCategories(evaluation.scores, event?.categoryWeights || []),
    submittedAt: new Date().toISOString()
  };
  
  evaluations.push(newEvaluation);
  localStorage.setItem('evalytics_evaluations', JSON.stringify(evaluations));
  return newEvaluation;
};

export const updateEvaluation = (id: string, updates: Partial<Evaluation>): Evaluation | null => {
  const evaluations = getEvaluations();
  const index = evaluations.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  const updated = { ...evaluations[index], ...updates };
  
  // Recalculate if scores changed
  if (updates.scores) {
    const event = getEventById(updated.eventId);
    const scores = Object.values(updated.scores);
    updated.totalScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    // Calculate weighted score
    let weightedScore = 0;
    if (event && event.categoryWeights) {
      event.categoryWeights.forEach(cw => {
        const score = updated.scores[cw.category] || 0;
        weightedScore += (score * cw.weight) / 100;
      });
    } else {
      weightedScore = updated.totalScore;
    }
    updated.weightedScore = Math.round(weightedScore * 100) / 100;
    
    updated.performanceLevel = calculatePerformanceLevel(updated.weightedScore);
    updated.readinessLevel = calculateReadinessLevel(updated.weightedScore);
    updated.weakestCategories = calculateWeakestCategories(updated.scores, event?.categoryWeights || []);
  }
  
  evaluations[index] = updated;
  localStorage.setItem('evalytics_evaluations', JSON.stringify(evaluations));
  return updated;
};