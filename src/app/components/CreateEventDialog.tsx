import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Plus } from 'lucide-react';
import { createEvent, Event, EVALUATION_CATEGORIES, getUsersByRole, CategoryWeightage } from '../lib/storage';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';

export default function CreateEventDialog({ onEventCreated }: { onEventCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<Event['type']>('hackathon');
  const [description, setDescription] = useState('');
  const [evaluationType, setEvaluationType] = useState<'individual' | 'team'>('individual');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryWeights, setCategoryWeights] = useState<Record<string, number>>({});
  const [selectedJudges, setSelectedJudges] = useState<string[]>([]);

  const judges = getUsersByRole('judge');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || selectedCategories.length === 0) {
      toast.error('Please fill in all required fields and select at least one category');
      return;
    }

    // Validate weights sum to 100
    const totalWeight = selectedCategories.reduce((sum, cat) => sum + (categoryWeights[cat] || 0), 0);
    if (Math.abs(totalWeight - 100) > 0.01 && selectedCategories.length > 0) {
      toast.error('Category weights must sum to 100%');
      return;
    }

    const weights: CategoryWeightage[] = selectedCategories.map(cat => ({
      category: cat,
      weight: categoryWeights[cat] || (100 / selectedCategories.length)
    }));

    createEvent({
      name,
      type,
      description,
      categories: selectedCategories,
      categoryWeights: weights,
      evaluationType,
      assignedJudges: selectedJudges,
      status: 'active'
    });

    toast.success('Event created successfully!');
    setOpen(false);
    resetForm();
    onEventCreated();
  };

  const resetForm = () => {
    setName('');
    setType('hackathon');
    setDescription('');
    setEvaluationType('individual');
    setSelectedCategories([]);
    setCategoryWeights({});
    setSelectedJudges([]);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleJudge = (judgeId: string) => {
    setSelectedJudges(prev =>
      prev.includes(judgeId)
        ? prev.filter(j => j !== judgeId)
        : [...prev, judgeId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Set up a new event for evaluation
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Spring Hackathon 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as Event['type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="quiz">Quiz Competition</SelectItem>
                  <SelectItem value="coding">Coding Contest</SelectItem>
                  <SelectItem value="paper-presentation">Paper Presentation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Evaluation Type *</Label>
              <RadioGroup value={evaluationType} onValueChange={(v) => setEvaluationType(v as 'individual' | 'team')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="font-normal">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team" className="font-normal">Team</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Evaluation Categories * (Select at least one)</Label>
              <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                {EVALUATION_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={category} className="font-normal cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {selectedCategories.length} categories
              </p>
            </div>

            {selectedCategories.length > 0 && (
              <div className="space-y-2">
                <Label>Category Weightage (Must sum to 100%)</Label>
                <div className="border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                  {selectedCategories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Label className="flex-1 text-sm">{category}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={categoryWeights[category] || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setCategoryWeights(prev => ({ ...prev, [category]: value }));
                        }}
                        placeholder="0"
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const equalWeight = 100 / selectedCategories.length;
                      const weights: Record<string, number> = {};
                      selectedCategories.forEach(cat => {
                        weights[cat] = parseFloat(equalWeight.toFixed(2));
                      });
                      setCategoryWeights(weights);
                    }}
                  >
                    Distribute Equally
                  </Button>
                  <span className={`font-medium ${
                    Math.abs(selectedCategories.reduce((sum, cat) => sum + (categoryWeights[cat] || 0), 0) - 100) < 0.01
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    Total: {selectedCategories.reduce((sum, cat) => sum + (categoryWeights[cat] || 0), 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Assign Judges</Label>
              <div className="border rounded-lg p-4 space-y-2">
                {judges.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No judges available</p>
                ) : (
                  judges.map((judge) => (
                    <div key={judge.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={judge.id}
                        checked={selectedJudges.includes(judge.id)}
                        onCheckedChange={() => toggleJudge(judge.id)}
                      />
                      <Label htmlFor={judge.id} className="font-normal cursor-pointer">
                        {judge.name} (@{judge.username})
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">Create Event</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}