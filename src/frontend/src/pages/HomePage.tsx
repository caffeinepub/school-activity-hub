import { useState } from 'react';
import { useGetUpcomingActivities } from '../hooks/useQueries';
import ActivityCard from '../components/ActivityCard';
import ActivityFilters, { FilterState } from '../components/ActivityFilters';
import { useActivityFilter } from '../hooks/useActivityFilter';
import { Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { data: activities, isLoading } = useGetUpcomingActivities();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
  });

  const filteredActivities = useActivityFilter(activities || [], filters);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden shadow-xl">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Students collaborating"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-teal-600/90 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover School Activities</h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              Connect with your school community through exciting events and activities
            </p>
            {identity && (
              <Button
                size="lg"
                onClick={() => navigate({ to: '/create' })}
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Create New Activity
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <ActivityFilters filters={filters} onFiltersChange={setFilters} />

      {/* Activities Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'Activity' : 'Activities'} Found
          </h2>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No activities found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or create a new activity</p>
            {identity && (
              <Button
                onClick={() => navigate({ to: '/create' })}
                className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white"
              >
                Create Activity
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id.toString()} activity={activity} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
