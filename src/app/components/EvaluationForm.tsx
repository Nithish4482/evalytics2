import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Event, Participant, createEvaluation, getEvaluationByParticipant, updateEvaluation } from '../lib/storage';
import { toast } from 'sonner';
import { Save, CheckCircle } from 'lucide-react';

interface EvaluationFormProps {
  event: Event;
  participant: Participant;
  judgeId: string;
  onSubmit: () => void;
}

export default function EvaluationForm({ event, participant, judgeId, onSubmit }: EvaluationFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if already evaluated
    const existingEval = getEvaluationByParticipant(participant.id);
    if (existingEval) {
      setScores(existingEval.scores);
      setComments(existingEval.comments);
      setIsSubmitted(true);
    } else {
      // Initialize scores to 0
      const initialScores: Record<string, number> = {};
      event.categories.forEach(cat => {
        initialScores[cat] = 0;
      });
      setScores(initialScores);
    }
  }, [participant.id, event.categories]);

  const handleScoreChange = (category: string, value: string) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    setScores(prev => ({ ...prev, [category]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all scores are entered
    const allScoresEntered = event.categories.every(cat => scores[cat] !== undefined && scores[cat] >= 0);
    if (!allScoresEntered) {
      toast.error('Please enter scores for all categories');
      return;
    }

    const existingEval = getEvaluationByParticipant(participant.id);
    
    if (existingEval) {
      updateEvaluation(existingEval.id, { scores, comments });
      toast.success('Evaluation updated successfully!');
    } else {
      createEvaluation({
        eventId: event.id,
        participantId: participant.id,
        judgeId,
        scores,
        comments
      });
      toast.success('Evaluation submitted successfully!');
    }

    setIsSubmitted(true);
    onSubmit();
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / event.categories.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Evaluate: {participant.name}
          {participant.teamName && ` (${participant.teamName})`}
        </CardTitle>
        <CardDescription>
          Score each category from 0 to 100
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {event.categories.map((category) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={category}>{category}</Label>
                  <span className="text-sm text-muted-foreground">
                    {scores[category] || 0}/100
                  </span>
                </div>
                <Input
                  id={category}
                  type="number"
                  min="0"
                  max="100"
                  value={scores[category] || 0}
                  onChange={(e) => handleScoreChange(category, e.target.value)}
                  disabled={isSubmitted}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="comments">Comments/Feedback</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your feedback here..."
              rows={4}
              disabled={isSubmitted}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">{totalScore.toFixed(2)}/100</p>
            </div>
            {!isSubmitted ? (
              <Button type="submit">
                <Save className="size-4 mr-2" />
                Submit Evaluation
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="size-5" />
                <span>Evaluation Submitted</span>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
