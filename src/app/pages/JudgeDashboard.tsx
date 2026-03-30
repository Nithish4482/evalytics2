import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LogOut, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import EvaluationForm from '../components/EvaluationForm';
import { getEventsByJudge, getParticipantsByEvent, getEvaluationByParticipant, Event, Participant } from '../lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function JudgeDashboard() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (user) {
      const assignedEvents = getEventsByJudge(user.id);
      setEvents(assignedEvents);
    }
  }, [user, refresh]);

  const participants = selectedEvent ? getParticipantsByEvent(selectedEvent.id) : [];
  
  const evaluatedCount = participants.filter(p => 
    getEvaluationByParticipant(p.id)
  ).length;

  const handleEvaluationSubmit = () => {
    setRefresh(r => r + 1);
    setSelectedParticipant(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">EVALYTICS</h1>
            <p className="text-sm text-gray-600">Judge Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-600">Judge</p>
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
              My Events
            </TabsTrigger>
            <TabsTrigger value="evaluate">
              <Users className="size-4 mr-2" />
              Evaluate
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <h2 className="text-xl font-semibold">Assigned Events</h2>

            {events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="size-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No events assigned yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                  const eventParticipants = getParticipantsByEvent(event.id);
                  const eventEvaluatedCount = eventParticipants.filter(p => 
                    getEvaluationByParticipant(p.id)
                  ).length;
                  
                  return (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mt-2">
                            {event.type}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">{event.description}</p>
                          <div className="pt-2 border-t">
                            <p><strong>Categories:</strong> {event.categories.length}</p>
                            <p><strong>Participants:</strong> {eventParticipants.length}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ 
                                    width: `${eventParticipants.length > 0 ? (eventEvaluatedCount / eventParticipants.length) * 100 : 0}%` 
                                  }}
                                />
                              </div>
                              <span className="text-xs">
                                {eventEvaluatedCount}/{eventParticipants.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Evaluate Tab */}
          <TabsContent value="evaluate" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Event Selection */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Select Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {events.map((event) => (
                    <Button
                      key={event.id}
                      variant={selectedEvent?.id === event.id ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedEvent(event);
                        setSelectedParticipant(null);
                      }}
                      className="w-full justify-start"
                    >
                      {event.name}
                    </Button>
                  ))}
                  {events.length === 0 && (
                    <p className="text-sm text-gray-600 text-center py-4">
                      No events assigned
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Participant Selection */}
              {selectedEvent && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Participants</CardTitle>
                    <CardDescription>
                      Progress: {evaluatedCount}/{participants.length} evaluated
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {participants.length === 0 ? (
                      <div className="py-12 text-center">
                        <Users className="size-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No participants registered yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {participants.map((participant) => {
                          const isEvaluated = !!getEvaluationByParticipant(participant.id);
                          return (
                            <div
                              key={participant.id}
                              className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                                selectedParticipant?.id === participant.id ? 'bg-blue-50 border-blue-300' : ''
                              }`}
                              onClick={() => setSelectedParticipant(participant)}
                            >
                              <div>
                                <p className="font-medium">{participant.name}</p>
                                {participant.teamName && (
                                  <p className="text-sm text-gray-600">{participant.teamName}</p>
                                )}
                              </div>
                              {isEvaluated ? (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  <CheckCircle className="size-3 mr-1" />
                                  Evaluated
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <Clock className="size-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Evaluation Form */}
            {selectedEvent && selectedParticipant && user && (
              <div className="mt-4">
                <EvaluationForm
                  event={selectedEvent}
                  participant={selectedParticipant}
                  judgeId={user.id}
                  onSubmit={handleEvaluationSubmit}
                />
              </div>
            )}

            {!selectedEvent && events.length > 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="size-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Select an event to start evaluating</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
