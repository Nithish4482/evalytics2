import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LogOut, Award, FileDown, Clock, TrendingUp, Target, Brain, Medal, Award as CertificateIcon } from 'lucide-react';
import PerformanceBadge from '../components/PerformanceBadge';
import { getParticipantsByUser, getEventById, getEvaluationByParticipant, Participant, Evaluation } from '../lib/storage';
import { getPeerComparison } from '../lib/analytics';
import { getSkillRecommendations } from '../lib/skillRecommendations';
import { generateEvaluationPDF } from '../utils/pdfGenerator';
import { generateCertificate } from '../utils/certificateGenerator';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export default function EnhancedParticipantDashboard() {
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
  const peerComparison = selectedParticipant ? getPeerComparison(selectedParticipant.id) : null;
  const skillRecommendations = selectedEvaluation ? getSkillRecommendations(selectedEvaluation.weakestCategories) : [];

  // Growth tracking data
  const growthData = participantRecords
    .map(record => {
      const event = getEventById(record.eventId);
      const evaluation = getEvaluationByParticipant(record.id);
      if (!event || !evaluation) return null;
      return {
        eventName: event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name,
        score: evaluation.weightedScore,
        date: new Date(evaluation.submittedAt).toLocaleDateString()
      };
    })
    .filter(d => d !== null)
    .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime());

  const handleDownloadReport = () => {
    if (!selectedParticipant || !selectedEvent || !selectedEvaluation) {
      toast.error('Unable to generate report');
      return;
    }
    generateEvaluationPDF(selectedParticipant, selectedEvent, selectedEvaluation);
    toast.success('Report downloaded!');
  };

  const handleDownloadCertificate = () => {
    if (!selectedParticipant || !selectedEvent || !selectedEvaluation) {
      toast.error('Unable to generate certificate');
      return;
    }
    generateCertificate(selectedParticipant, selectedEvent, selectedEvaluation);
    toast.success('Certificate downloaded!');
  };

  // Category radar data
  const radarData = selectedEvaluation && selectedEvent
    ? Object.entries(selectedEvaluation.scores).map(([category, score]) => ({
        category: category.length > 20 ? category.substring(0, 20) + '...' : category,
        score,
        fullMark: 100
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EVALYTICS
            </h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* My Events Sidebar */}
          <Card className="lg:col-span-1 shadow-lg border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="size-5 text-blue-600" />
                My Events
              </CardTitle>
              <CardDescription>Your registered events</CardDescription>
            </CardHeader>
            <CardContent>
              {participantRecords.length === 0 ? (
                <div className="py-8 text-center">
                  <Award className="size-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">No events yet</p>
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
                        className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                          selectedParticipant?.id === record.id
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md'
                            : 'bg-white hover:border-blue-200'
                        }`}
                        onClick={() => setSelectedParticipant(record)}
                      >
                        <p className="font-medium text-sm">{event.name}</p>
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
                        {evaluation && (
                          <div className="mt-2 text-xs font-medium text-blue-600">
                            Score: {evaluation.weightedScore.toFixed(1)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Results Section */}
          <div className="lg:col-span-3 space-y-6">
            {!selectedParticipant ? (
              <Card className="shadow-lg">
                <CardContent className="py-24 text-center">
                  <Award className="size-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Welcome to Your Dashboard</h3>
                  <p className="text-gray-600">Select an event from the list to view your detailed results</p>
                </CardContent>
              </Card>
            ) : !selectedEvaluation ? (
              <Card className="shadow-lg">
                <CardContent className="py-24 text-center">
                  <Clock className="size-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Evaluation Pending</h3>
                  <p className="text-gray-600">Your evaluation is being processed</p>
                  <p className="text-sm text-gray-500 mt-2">Results will appear here once the judge completes the evaluation</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  <TabsTrigger value="growth">Growth</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Performance Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="shadow-lg border-t-4 border-t-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-600">Weighted Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{selectedEvaluation.weightedScore.toFixed(1)}</div>
                        <p className="text-xs text-gray-500 mt-1">Out of 100</p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-t-4 border-t-blue-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-600">Performance Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PerformanceBadge 
                          level={selectedEvaluation.performanceLevel} 
                          score={selectedEvaluation.weightedScore}
                        />
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-t-4 border-t-purple-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-600 flex items-center gap-1">
                          <Target className="size-4" />
                          Readiness Level
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className={`text-sm ${
                          selectedEvaluation.readinessLevel === 'advanced' ? 'bg-purple-600' :
                          selectedEvaluation.readinessLevel === 'intermediate' ? 'bg-blue-600' :
                          'bg-orange-600'
                        }`}>
                          {selectedEvaluation.readinessLevel.toUpperCase()}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Radar Chart */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Performance Radar</CardTitle>
                      <CardDescription>Visual breakdown of your scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar 
                            name="Your Score" 
                            dataKey="score" 
                            stroke="#3b82f6" 
                            fill="#3b82f6" 
                            fillOpacity={0.6} 
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button onClick={handleDownloadReport} className="flex-1 shadow-lg">
                      <FileDown className="size-4 mr-2" />
                      Download PDF Report
                    </Button>
                    <Button onClick={handleDownloadCertificate} variant="outline" className="flex-1 shadow-lg">
                      <CertificateIcon className="size-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                </TabsContent>

                {/* Details Tab - Will continue in next part */}
                <TabsContent value="details" className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Category Breakdown</CardTitle>
                      <CardDescription>Detailed scores for each evaluation category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(selectedEvaluation.scores).map(([category, score]) => {
                          const weight = selectedEvent?.categoryWeights.find(cw => cw.category === category);
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{category}</span>
                                  {weight && (
                                    <Badge variant="outline" className="text-xs">
                                      {weight.weight}% weight
                                    </Badge>
                                  )}
                                </div>
                                <span className="font-bold text-blue-600">{score}/100</span>
                              </div>
                              <Progress value={score} className="h-3" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Areas to Improve */}
                  <Card className="shadow-lg border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="size-5 text-orange-600" />
                        Areas to Improve
                      </CardTitle>
                      <CardDescription>Focus on these categories to boost your performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedEvaluation.weakestCategories.map((category, index) => (
                          <div key={category} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <Badge variant="outline" className="bg-white">{index + 1}</Badge>
                            <span className="font-medium text-orange-900">{category}</span>
                            <span className="ml-auto text-sm text-orange-700">
                              Score: {selectedEvaluation.scores[category]}/100
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Judge Feedback */}
                  {selectedEvaluation.comments && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>Judge's Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedEvaluation.comments}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Comparison Tab */}
                <TabsContent value="comparison" className="space-y-6">
                  {peerComparison && (
                    <>
                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Medal className="size-5 text-yellow-600" />
                            Peer Comparison
                          </CardTitle>
                          <CardDescription>See how you compare with others in this event</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-gray-600 mb-1">Your Score</p>
                              <p className="text-3xl font-bold text-blue-600">{peerComparison.yourScore.toFixed(1)}</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600 mb-1">Average Score</p>
                              <p className="text-3xl font-bold text-gray-600">{peerComparison.averageScore.toFixed(1)}</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm text-gray-600 mb-1">Top Score</p>
                              <p className="text-3xl font-bold text-green-600">{peerComparison.topScore.toFixed(1)}</p>
                            </div>
                          </div>

                          <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-sm text-gray-600 mb-1">Your Rank</p>
                              <p className="text-2xl font-bold text-purple-600">
                                {peerComparison.rank} / {peerComparison.totalParticipants}
                              </p>
                            </div>
                            <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                              <p className="text-sm text-gray-600 mb-1">Percentile</p>
                              <p className="text-2xl font-bold text-indigo-600">{peerComparison.percentile}th</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle>Comparison Chart</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={[
                                { name: 'Your Score', value: peerComparison.yourScore, fill: '#3b82f6' },
                                { name: 'Average', value: peerComparison.averageScore, fill: '#6b7280' },
                                { name: 'Top Score', value: peerComparison.topScore, fill: '#22c55e' }
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Bar dataKey="value" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                {/* Growth Tab */}
                <TabsContent value="growth" className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="size-5 text-green-600" />
                        Growth Tracking
                      </CardTitle>
                      <CardDescription>Your performance across all events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {growthData.length === 0 ? (
                        <div className="py-12 text-center">
                          <TrendingUp className="size-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Participate in more events to track your growth</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={350}>
                          <LineChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="eventName" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="#3b82f6" 
                              strokeWidth={3}
                              dot={{ fill: '#3b82f6', r: 6 }}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="size-5 text-purple-600" />
                        Skill Recommendations
                      </CardTitle>
                      <CardDescription>Personalized suggestions based on your performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {skillRecommendations.length === 0 ? (
                        <div className="py-12 text-center">
                          <Brain className="size-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Great job! No specific recommendations at this time</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {skillRecommendations.map((recommendation, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-lg mb-3 text-purple-900 flex items-center gap-2">
                                <Badge variant="outline" className="bg-white">{index + 1}</Badge>
                                {recommendation.category}
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">Recommended Skills:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {recommendation.skills.map((skill, idx) => (
                                      <Badge key={idx} className="bg-purple-600">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">Learning Resources:</p>
                                  <ul className="space-y-1">
                                    {recommendation.resources.map((resource, idx) => (
                                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                        <span className="text-purple-600 mt-1">•</span>
                                        <span>{resource}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
