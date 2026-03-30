import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Progress } from '../components/ui/progress';
import { LogOut, Award, FileDown, Clock } from 'lucide-react';
import PerformanceBadge from '../components/PerformanceBadge';
import { getParticipantsByUser, getEventById, getEvaluationByParticipant, Participant, Event, Evaluation } from '../lib/storage';
import { generateEvaluationPDF } from '../utils/pdfGenerator';
import { toast } from 'sonner';

export default function ParticipantDashboard() {
  const { user, logout } = useAuth();
  const [participantRecords, setParticipantRecords] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    if (user) {
      const records = getParticipantsByUser(user.id);
      setParticipantRecords(records);
    }
  }, [user]);

  const selectedEvent = selectedParticipant ? getEventById(selectedParticipant.eventId) : null;
  const selectedEvaluation = selectedParticipant ? getEvaluationByParticipant(selectedParticipant.id) : null;

  const handleDownloadReport = () => {
    if (!selectedParticipant || !selectedEvent || !selectedEvaluation) {
      toast.error('Unable to generate report');
      return;
    }

    generateEvaluationPDF(selectedParticipant, selectedEvent, selectedEvaluation);
    toast.success('Report downloaded!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">EVALYTICS</h1>
            <p className="text-sm text-gray-600">Participant Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-600">Participant</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Events */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>My Events</CardTitle>
              <CardDescription>Events you're registered for</CardDescription>
            </CardHeader>
            <CardContent>
              {participantRecords.length === 0 ? (
                <div className="py-8 text-center">
                  <Award className="size-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">Not registered for any events yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {participantRecords.map((record) => {
                    const event = getEventById(record.eventId);
                    const evaluation = getEvaluationByParticipant(record.id);
                    
                    if (!event) return null;

                    return (
                      <div
                        key={record.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedParticipant?.id === record.id ? 'bg-blue-50 border-blue-300' : ''
                        }`}
                        onClick={() => setSelectedParticipant(record)}
                      >
                        <p className="font-medium">{event.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                          {evaluation ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                              Evaluated
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="size-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Evaluation Results</CardTitle>
              <CardDescription>
                {selectedEvent ? selectedEvent.name : 'Select an event to view results'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedParticipant ? (
                <div className="py-12 text-center">
                  <Award className="size-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Select an event from the list to view your results</p>
                </div>
              ) : !selectedEvaluation ? (
                <div className="py-12 text-center">
                  <Clock className="size-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Your evaluation is pending</p>
                  <p className="text-sm text-gray-500 mt-2">Results will appear here once the judge completes the evaluation</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Performance */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Overall Performance</p>
                    <p className="text-4xl font-bold mb-4">{selectedEvaluation.totalScore.toFixed(1)}/100</p>
                    <PerformanceBadge 
                      level={selectedEvaluation.performanceLevel} 
                      score={selectedEvaluation.totalScore}
                    />
                  </div>

                  {/* Category Breakdown */}
                  <div>
                    <h3 className="font-semibold mb-4">Category Breakdown</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedEvaluation.scores).map(([category, score]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{category}</span>
                            <span className="font-medium">{score}/100</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  {selectedEvaluation.comments && (
                    <div>
                      <h3 className="font-semibold mb-2">Judge's Feedback</h3>
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-sm text-gray-700">{selectedEvaluation.comments}</p>
                      </div>
                    </div>
                  )}

                  {/* Download Report */}
                  <div className="pt-4 border-t flex justify-end">
                    <Button onClick={handleDownloadReport}>
                      <FileDown className="size-4 mr-2" />
                      Download PDF Report
                    </Button>
                  </div>

                  {/* Performance Legend */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3 text-sm">Performance Levels</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Needs Improvement (0-40)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span>Average (41-60)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>Good (61-80)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Excellent (81-100)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
