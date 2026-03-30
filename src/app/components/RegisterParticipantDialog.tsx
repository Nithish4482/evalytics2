import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserPlus } from 'lucide-react';
import { createParticipant, Event } from '../lib/storage';
import { toast } from 'sonner';

export default function RegisterParticipantDialog({ event, onParticipantAdded }: { event: Event; onParticipantAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [teamName, setTeamName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error('Please fill in all required fields');
      return;
    }

    createParticipant({
      name,
      email,
      eventId: event.id,
      teamName: event.evaluationType === 'team' ? teamName : undefined,
      userId: `participant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    toast.success('Participant registered successfully!');
    setOpen(false);
    resetForm();
    onParticipantAdded();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setTeamName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="size-4 mr-2" />
          Add Participant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Participant</DialogTitle>
          <DialogDescription>
            Add a new participant to {event.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="participant-name">Name *</Label>
            <Input
              id="participant-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Participant name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participant-email">Email *</Label>
            <Input
              id="participant-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="participant@email.com"
              required
            />
          </div>

          {event.evaluationType === 'team' && (
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Register</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
