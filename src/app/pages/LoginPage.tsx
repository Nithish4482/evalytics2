import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, Award } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'judge') navigate('/judge');
      else if (user.role === 'participant') navigate('/participant');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white rounded-full p-3">
              <Award className="size-8" />
            </div>
          </div>
          <CardTitle className="text-3xl">EVALYTICS</CardTitle>
          <CardDescription>Smart Event Evaluation System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Judge:</strong> judge1 / judge123</p>
              <p><strong>Participant:</strong> participant1 / part123</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 text-xs">
            <p className="font-semibold text-blue-900 mb-2">✨ New Advanced Features:</p>
            <ul className="space-y-1 text-blue-800">
              <li>• Category Weightage System</li>
              <li>• AI-Powered Skill Recommendations</li>
              <li>• Competition Readiness Indicator</li>
              <li>• Peer Comparison & Rankings</li>
              <li>• Growth Tracking Dashboard</li>
              <li>• Certificate Generation</li>
              <li>• Advanced Analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}