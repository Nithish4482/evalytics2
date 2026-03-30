import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { LogOut, Calendar, Users, Award, FileDown, BarChart3 } from 'lucide-react';
import CreateEventDialog from '../components/CreateEventDialog';
import RegisterParticipantDialog from '../components/RegisterParticipantDialog';
import PerformanceBadge from '../components/PerformanceBadge';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { getEvents, getParticipantsByEvent, getEvaluationsByEvent, getEvaluationByParticipant, getUserById, Event } from '../lib/storage';
import { generateEvaluationPDF } from '../utils/pdfGenerator';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    loadEvents();
  }, [refresh]);

  const loadEvents = () => {
    setEvents(getEvents());
  };

  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;
  const participants = selectedEvent ? getParticipantsByEvent(selectedEvent.id) : [];
  const evaluations = selectedEvent ? getEvaluationsByEvent(selectedEvent.id) : [];

  const handleDownloadReport = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    const evaluation = getEvaluationByParticipant(participantId);
    
    if (!participant || !evaluation || !selectedEvent) {
      toast.error('Unable to generate report');
      return;
    }

    generateEvaluationPDF(participant, selectedEvent, evaluation);
    toast.success('Report downloaded!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">EVALYTICS</h1>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-600">Administrator</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events">
              <Calendar className="size-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="results">
              <Award className="size-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="size-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Events</h2>
              <CreateEventDialog onEventCreated={() => setRefresh(r => r + 1)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mt-2">
                        {event.type}
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        {event.evaluationType}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">{event.description}</p>
                      <div className="pt-2 border-t">
                        <p><strong>Categories:</strong> {event.categories.length}</p>
                        <p><strong>Judges:</strong> {event.assignedJudges.length}</p>
                        <p><strong>Participants:</strong> {getParticipantsByEvent(event.id).length}</p>
                      </div>
                      <div className="pt-2">
                        <RegisterParticipantDialog 
                          event={event} 
                          onParticipantAdded={() => setRefresh(r => r + 1)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {events.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="size-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No events yet. Create your first event!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Evaluation Results</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Select Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3">
                  {events.map((event) => (
                    <Button
                      key={event.id}
                      variant={selectedEventId === event.id ? 'default' : 'outline'}
                      onClick={() => setSelectedEventId(event.id)}
                      className="justify-start"
                    >
                      {event.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Results: {selectedEvent.name}</CardTitle>
                  <CardDescription>
                    Total Participants: {participants.length} | Evaluated: {evaluations.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {participants.length === 0 ? (
                    <div className="py-12 text-center">
                      <Users className="size-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No participants registered yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          {selectedEvent.evaluationType === 'team' && <TableHead>Team</TableHead>}
                          <TableHead>Email</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Performance</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((participant) => {
                          const evaluation = getEvaluationByParticipant(participant.id);
                          return (
                            <TableRow key={participant.id}>
                              <TableCell>{participant.name}</TableCell>
                              {selectedEvent.evaluationType === 'team' && (
                                <TableCell>{participant.teamName || '-'}</TableCell>
                              )}
                              <TableCell>{participant.email}</TableCell>
                              <TableCell>
                                {evaluation ? `${evaluation.totalScore.toFixed(1)}/100` : '-'}
                              </TableCell>
                              <TableCell>
                                {evaluation ? (
                                  <PerformanceBadge 
                                    level={evaluation.performanceLevel} 
                                    score={evaluation.totalScore} 
                                  />
                                ) : (
                                  <Badge variant="outline">Not Evaluated</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {evaluation && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDownloadReport(participant.id)}
                                  >
                                    <FileDown className="size-4 mr-2" />
                                    PDF
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            </div>

            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}