import { Activity, Category } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface ActivityCardProps {
  activity: Activity;
}

const categoryColors: Record<Category, { bg: string; text: string; border: string }> = {
  [Category.sports]: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  [Category.academic]: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  [Category.arts]: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  [Category.social]: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const navigate = useNavigate();
  const colors = categoryColors[activity.category];

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleClick = () => {
    navigate({ to: '/activity/$activityId', params: { activityId: activity.id.toString() } });
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-orange-300 group"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
            {activity.title}
          </CardTitle>
          <Badge className={`${colors.bg} ${colors.text} border ${colors.border} shrink-0`}>
            {activity.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{formatDate(activity.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-teal-500" />
            <span>{activity.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="line-clamp-1">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-teal-500" />
            <span>{Number(activity.participantCount)} participants</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
