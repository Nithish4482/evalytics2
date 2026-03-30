import { Badge } from './ui/badge';
import { Evaluation } from '../lib/storage';

interface PerformanceBadgeProps {
  level: Evaluation['performanceLevel'];
  score: number;
}

export default function PerformanceBadge({ level, score }: PerformanceBadgeProps) {
  const config = {
    red: {
      label: 'Needs Improvement',
      className: 'bg-red-500 hover:bg-red-600 text-white'
    },
    orange: {
      label: 'Average',
      className: 'bg-orange-500 hover:bg-orange-600 text-white'
    },
    yellow: {
      label: 'Good',
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
    },
    green: {
      label: 'Excellent',
      className: 'bg-green-500 hover:bg-green-600 text-white'
    }
  };

  const { label, className } = config[level];

  return (
    <Badge className={className}>
      {label} ({score.toFixed(1)})
    </Badge>
  );
}
