import { Activity } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface DayActivitiesModalProps {
  date: Date | null;
  activities: Activity[];
  onClose: () => void;
}

export default function DayActivitiesModal({ date, activities, onClose }: DayActivitiesModalProps) {
  const navigate = useNavigate();

  if (!date) return null;

  const dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const handleActivityClick = (activityId: bigint) => {
    onClose();
    navigate({ to: '/activity/$activityId', params: { activityId: activityId.toString() } });
  };

  return (
    <Dialog open={!!date} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            {dateString}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {activities.map((activity) => (
            <div
              key={activity.id.toString()}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer"
              onClick={() => handleActivityClick(activity.id)}
            >
              <h3 className="font-bold text-gray-800 mb-2">{activity.title}</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-teal-500" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{activity.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
