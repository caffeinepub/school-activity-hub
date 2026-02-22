import { Activity, Category } from '../backend';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactElement } from 'react';

interface CalendarGridProps {
  activities: Activity[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date, activities: Activity[]) => void;
}

const categoryColors: Record<Category, string> = {
  [Category.sports]: 'bg-orange-500',
  [Category.academic]: 'bg-blue-500',
  [Category.arts]: 'bg-purple-500',
  [Category.social]: 'bg-teal-500',
};

export default function CalendarGrid({ activities, currentDate, onDateChange, onDayClick }: CalendarGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  const getActivitiesForDay = (day: number): Activity[] => {
    const dayDate = new Date(year, month, day);
    const dayStart = dayDate.getTime() * 1_000_000;
    const dayEnd = new Date(year, month, day + 1).getTime() * 1_000_000;

    return activities.filter((activity) => {
      const activityTime = Number(activity.date);
      return activityTime >= dayStart && activityTime < dayEnd;
    });
  };

  const days: ReactElement[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayActivities = getActivitiesForDay(day);
    const hasActivities = dayActivities.length > 0;
    const isToday =
      day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

    days.push(
      <button
        key={day}
        onClick={() => hasActivities && onDayClick(new Date(year, month, day), dayActivities)}
        className={`aspect-square p-2 rounded-lg border-2 transition-all ${
          isToday ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
        } ${hasActivities ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}`}
      >
        <div className="text-sm font-semibold text-gray-800 mb-1">{day}</div>
        {hasActivities && (
          <div className="flex flex-wrap gap-1 justify-center">
            {dayActivities.slice(0, 3).map((activity, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${categoryColors[activity.category]}`}
                title={activity.title}
              />
            ))}
            {dayActivities.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">+{dayActivities.length - 3}</div>
            )}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth} className="border-orange-200">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth} className="border-orange-200">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{days}</div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-600 mb-2">Categories:</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${categoryColors[Category.sports]}`} />
            <span className="text-sm text-gray-600">Sports</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${categoryColors[Category.academic]}`} />
            <span className="text-sm text-gray-600">Academic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${categoryColors[Category.arts]}`} />
            <span className="text-sm text-gray-600">Arts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${categoryColors[Category.social]}`} />
            <span className="text-sm text-gray-600">Social</span>
          </div>
        </div>
      </div>
    </div>
  );
}
