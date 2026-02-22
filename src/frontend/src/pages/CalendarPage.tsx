import { useState } from 'react';
import { useGetUpcomingActivities } from '../hooks/useQueries';
import CalendarGrid from '../components/CalendarGrid';
import DayActivitiesModal from '../components/DayActivitiesModal';
import { Activity } from '../backend';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
  const { data: activities, isLoading } = useGetUpcomingActivities();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  const handleDayClick = (date: Date, dayActivities: Activity[]) => {
    setSelectedDate(date);
    setSelectedActivities(dayActivities);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedActivities([]);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Activity Calendar</h1>
        <p className="text-gray-600">View all activities in a monthly calendar view</p>
      </div>

      <CalendarGrid
        activities={activities || []}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onDayClick={handleDayClick}
      />

      <DayActivitiesModal date={selectedDate} activities={selectedActivities} onClose={handleCloseModal} />
    </div>
  );
}
