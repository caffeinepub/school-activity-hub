import { useGetUserRegistrations, useGetActivityDetails } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ActivityCard from '../components/ActivityCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, List } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function MyActivitiesPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: registrationIds, isLoading } = useGetUserRegistrations(identity?.getPrincipal());

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Please log in to view your activities</p>
            <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <List className="w-8 h-8 text-orange-500" />
          My Registered Activities
        </h1>
        <p className="text-gray-600">Activities you've signed up for</p>
      </div>

      {!registrationIds || registrationIds.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center py-12">
            <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No registered activities yet</h3>
            <p className="text-gray-500 mb-6">Start exploring and register for activities that interest you</p>
            <Button
              onClick={() => navigate({ to: '/' })}
              className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white"
            >
              Browse Activities
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrationIds.map((activityId) => (
            <ActivityDetailCard key={activityId.toString()} activityId={activityId} />
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityDetailCard({ activityId }: { activityId: bigint }) {
  const { data: activity, isLoading } = useGetActivityDetails(activityId);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="pt-6">
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!activity) return null;

  return <ActivityCard activity={activity} />;
}
