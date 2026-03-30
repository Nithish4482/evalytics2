// Analytics utilities for advanced insights

import { Event, Evaluation, Participant, getEvaluations, getParticipants, getEvents } from './storage';

export interface EventAnalytics {
  eventId: string;
  eventName: string;
  totalParticipants: number;
  evaluatedParticipants: number;
  averageScore: number;
  topScore: number;
  weakestCategory: string;
  categoryAverages: Record<string, number>;
}

export interface OverallAnalytics {
  totalEvents: number;
  totalParticipants: number;
  totalEvaluations: number;
  globalWeakestCategory: string;
  topPerformers: Array<{ name: string; score: number; eventName: string }>;
  eventTrends: Array<{ eventName: string; averageScore: number; date: string }>;
}

export const calculateEventAnalytics = (eventId: string): EventAnalytics | null => {
  const evaluations = getEvaluations().filter(e => e.eventId === eventId);
  const participants = getParticipants().filter(p => p.eventId === eventId);
  const event = getEvents().find(e => e.id === eventId);

  if (!event) return null;

  if (evaluations.length === 0) {
    return {
      eventId,
      eventName: event.name,
      totalParticipants: participants.length,
      evaluatedParticipants: 0,
      averageScore: 0,
      topScore: 0,
      weakestCategory: '',
      categoryAverages: {}
    };
  }

  const averageScore = evaluations.reduce((sum, e) => sum + e.totalScore, 0) / evaluations.length;
  const topScore = Math.max(...evaluations.map(e => e.totalScore));

  // Calculate category averages
  const categoryAverages: Record<string, number> = {};
  event.categories.forEach(category => {
    const scores = evaluations
      .map(e => e.scores[category])
      .filter(score => score !== undefined);
    categoryAverages[category] = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
  });

  // Find weakest category
  const weakestCategory = Object.entries(categoryAverages)
    .sort((a, b) => a[1] - b[1])[0]?.[0] || '';

  return {
    eventId,
    eventName: event.name,
    totalParticipants: participants.length,
    evaluatedParticipants: evaluations.length,
    averageScore: Math.round(averageScore * 100) / 100,
    topScore: Math.round(topScore * 100) / 100,
    weakestCategory,
    categoryAverages
  };
};

export const calculateOverallAnalytics = (): OverallAnalytics => {
  const events = getEvents();
  const evaluations = getEvaluations();
  const participants = getParticipants();

  // Global category scores
  const globalCategoryScores: Record<string, number[]> = {};
  evaluations.forEach(evaluation => {
    Object.entries(evaluation.scores).forEach(([category, score]) => {
      if (!globalCategoryScores[category]) {
        globalCategoryScores[category] = [];
      }
      globalCategoryScores[category].push(score);
    });
  });

  // Calculate global category averages
  const globalCategoryAverages: Record<string, number> = {};
  Object.entries(globalCategoryScores).forEach(([category, scores]) => {
    globalCategoryAverages[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  });

  // Find global weakest category
  const globalWeakestCategory = Object.entries(globalCategoryAverages)
    .sort((a, b) => a[1] - b[1])[0]?.[0] || 'N/A';

  // Top performers (top 5)
  const topPerformers = evaluations
    .map(evaluation => {
      const participant = participants.find(p => p.id === evaluation.participantId);
      const event = events.find(e => e.id === evaluation.eventId);
      return {
        name: participant?.name || 'Unknown',
        score: evaluation.totalScore,
        eventName: event?.name || 'Unknown Event'
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Event trends
  const eventTrends = events
    .map(event => {
      const eventEvaluations = evaluations.filter(e => e.eventId === event.id);
      const averageScore = eventEvaluations.length > 0
        ? eventEvaluations.reduce((sum, e) => sum + e.totalScore, 0) / eventEvaluations.length
        : 0;
      return {
        eventName: event.name,
        averageScore: Math.round(averageScore * 100) / 100,
        date: event.createdAt
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    totalEvents: events.length,
    totalParticipants: participants.length,
    totalEvaluations: evaluations.length,
    globalWeakestCategory,
    topPerformers,
    eventTrends
  };
};

export const getPeerComparison = (participantId: string) => {
  const evaluation = getEvaluations().find(e => e.participantId === participantId);
  if (!evaluation) return null;

  const eventEvaluations = getEvaluations().filter(e => e.eventId === evaluation.eventId);
  if (eventEvaluations.length === 0) return null;

  const scores = eventEvaluations.map(e => e.totalScore);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const topScore = Math.max(...scores);
  
  const rank = eventEvaluations
    .sort((a, b) => b.totalScore - a.totalScore)
    .findIndex(e => e.participantId === participantId) + 1;

  return {
    yourScore: evaluation.totalScore,
    averageScore: Math.round(averageScore * 100) / 100,
    topScore: Math.round(topScore * 100) / 100,
    rank,
    totalParticipants: eventEvaluations.length,
    percentile: Math.round(((eventEvaluations.length - rank + 1) / eventEvaluations.length) * 100)
  };
};
