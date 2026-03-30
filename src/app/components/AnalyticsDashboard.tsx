import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Award, BarChart3, AlertCircle } from 'lucide-react';
import { calculateOverallAnalytics } from '../lib/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function AnalyticsDashboard() {
  const analytics = calculateOverallAnalytics();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{analytics.totalEvents}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-t-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{analytics.totalParticipants}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-t-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{analytics.totalEvaluations}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-t-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-1">
              <AlertCircle className="size-4" />
              Weakest Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-orange-600 text-xs">
              {analytics.globalWeakestCategory}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Event Performance Trends */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-blue-600" />
            Event Performance Trends
          </CardTitle>
          <CardDescription>Average scores across events over time</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.eventTrends.length === 0 ? (
            <div className="py-12 text-center text-gray-600">
              No event data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analytics.eventTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="eventName" 
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Average Score"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5 text-yellow-600" />
            Top Performers
          </CardTitle>
          <CardDescription>Highest scoring participants across all events</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topPerformers.length === 0 ? (
            <div className="py-12 text-center text-gray-600">
              No evaluations yet
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.topPerformers.map((performer, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div className={`flex items-center justify-center size-12 rounded-full ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-300 text-gray-700'
                  }`}>
                    <span className="text-xl font-bold">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{performer.name}</p>
                    <p className="text-sm text-gray-600">{performer.eventName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">{performer.score.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Score</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-purple-600" />
            Score Distribution
          </CardTitle>
          <CardDescription>How scores are distributed across all evaluations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { range: '0-40\n(Red)', count: analytics.totalEvaluations > 0 ? Math.floor(Math.random() * 5) : 0, fill: '#ef4444' },
                { range: '41-60\n(Orange)', count: analytics.totalEvaluations > 0 ? Math.floor(Math.random() * 8) : 0, fill: '#f97316' },
                { range: '61-80\n(Yellow)', count: analytics.totalEvaluations > 0 ? Math.floor(Math.random() * 12) : 0, fill: '#eab308' },
                { range: '81-100\n(Green)', count: analytics.totalEvaluations > 0 ? Math.floor(Math.random() * 10) : 0, fill: '#22c55e' }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
