// Skill recommendation system based on weak categories

export interface SkillRecommendation {
  category: string;
  skills: string[];
  resources: string[];
}

export const SKILL_RECOMMENDATIONS: Record<string, SkillRecommendation> = {
  'Innovation & Creativity': {
    category: 'Innovation & Creativity',
    skills: ['Creative Thinking', 'Brainstorming Techniques', 'Design Thinking', 'Ideation Methods'],
    resources: ['Take design thinking courses', 'Practice creative problem solving', 'Study innovative products']
  },
  'Technical Implementation': {
    category: 'Technical Implementation',
    skills: ['Programming', 'Algorithm Design', 'Software Architecture', 'System Design'],
    resources: ['Practice coding challenges', 'Build side projects', 'Study software design patterns']
  },
  'Problem Solving': {
    category: 'Problem Solving',
    skills: ['Analytical Thinking', 'Debugging', 'Root Cause Analysis', 'Critical Thinking'],
    resources: ['Solve algorithmic problems', 'Practice competitive programming', 'Learn problem decomposition']
  },
  'Code Quality': {
    category: 'Code Quality',
    skills: ['Clean Code', 'Code Reviews', 'Testing', 'Refactoring'],
    resources: ['Read Clean Code by Robert Martin', 'Practice code refactoring', 'Learn SOLID principles']
  },
  'User Interface Design': {
    category: 'User Interface Design',
    skills: ['UI/UX Design', 'Visual Design', 'Prototyping', 'Figma/Adobe XD'],
    resources: ['Study UI design principles', 'Practice with design tools', 'Analyze popular app designs']
  },
  'User Experience': {
    category: 'User Experience',
    skills: ['User Research', 'Usability Testing', 'User Journey Mapping', 'Accessibility'],
    resources: ['Learn UX research methods', 'Conduct user interviews', 'Study HCI principles']
  },
  'Presentation Skills': {
    category: 'Presentation Skills',
    skills: ['Public Speaking', 'Storytelling', 'Slide Design', 'Audience Engagement'],
    resources: ['Join Toastmasters', 'Practice presentations', 'Watch TED talks for techniques']
  },
  'Team Collaboration': {
    category: 'Team Collaboration',
    skills: ['Communication', 'Conflict Resolution', 'Agile/Scrum', 'Version Control (Git)'],
    resources: ['Learn agile methodologies', 'Practice pair programming', 'Improve active listening']
  },
  'Project Completion': {
    category: 'Project Completion',
    skills: ['Time Management', 'Project Planning', 'Prioritization', 'Deadline Management'],
    resources: ['Use project management tools', 'Learn time boxing', 'Practice sprint planning']
  },
  'Scalability': {
    category: 'Scalability',
    skills: ['Distributed Systems', 'Load Balancing', 'Caching', 'Database Optimization'],
    resources: ['Study scalability patterns', 'Learn cloud architecture', 'Practice system design']
  },
  'Documentation': {
    category: 'Documentation',
    skills: ['Technical Writing', 'API Documentation', 'Code Comments', 'README Creation'],
    resources: ['Study technical writing', 'Read documentation best practices', 'Practice writing guides']
  },
  'Originality': {
    category: 'Originality',
    skills: ['Innovation', 'Research', 'Trend Analysis', 'Unique Value Proposition'],
    resources: ['Stay updated with tech trends', 'Research existing solutions', 'Think outside the box']
  },
  'Business Viability': {
    category: 'Business Viability',
    skills: ['Business Analysis', 'Market Research', 'Revenue Models', 'Competitive Analysis'],
    resources: ['Study business models', 'Learn startup fundamentals', 'Practice market analysis']
  },
  'Impact & Relevance': {
    category: 'Impact & Relevance',
    skills: ['Problem Identification', 'Social Impact', 'Stakeholder Analysis', 'Value Creation'],
    resources: ['Study real-world problems', 'Understand user needs', 'Learn impact measurement']
  },
  'Research Quality': {
    category: 'Research Quality',
    skills: ['Literature Review', 'Data Collection', 'Research Methods', 'Citation'],
    resources: ['Learn research methodologies', 'Practice academic writing', 'Use scholarly databases']
  },
  'Data Analysis': {
    category: 'Data Analysis',
    skills: ['Statistics', 'Data Visualization', 'Excel/Python', 'SQL'],
    resources: ['Learn data analysis tools', 'Practice with datasets', 'Study statistical methods']
  },
  'Communication': {
    category: 'Communication',
    skills: ['Written Communication', 'Verbal Communication', 'Active Listening', 'Clarity'],
    resources: ['Practice writing regularly', 'Improve vocabulary', 'Learn effective communication']
  },
  'Time Management': {
    category: 'Time Management',
    skills: ['Planning', 'Prioritization', 'Focus', 'Productivity Tools'],
    resources: ['Use time tracking apps', 'Learn Pomodoro technique', 'Practice task batching']
  },
  'Functionality': {
    category: 'Functionality',
    skills: ['Feature Development', 'Testing', 'Bug Fixing', 'Requirements Analysis'],
    resources: ['Practice full-stack development', 'Learn testing frameworks', 'Study feature planning']
  },
  'Security & Best Practices': {
    category: 'Security & Best Practices',
    skills: ['Cybersecurity', 'Authentication', 'Encryption', 'Secure Coding'],
    resources: ['Learn OWASP Top 10', 'Practice secure coding', 'Study security protocols']
  }
};

export const getSkillRecommendations = (weakCategories: string[]): SkillRecommendation[] => {
  return weakCategories
    .map(category => SKILL_RECOMMENDATIONS[category])
    .filter(rec => rec !== undefined);
};
