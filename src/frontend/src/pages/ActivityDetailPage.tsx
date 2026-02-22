import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetActivityDetails, useRegisterForActivity, useGetUserRegistrations } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ArrowLeft, UserCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Category } from '../backend';

const categoryColors: Record<Category, { bg: string; text: string; border: string }> = {
  [Category.sports]: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  [Category.academic]: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  [Category.arts]: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  [Category.social]: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
};

export default function ActivityDetailPage() {
  const { activityId } = useParams({ from: '/activity/$activityId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: activity, isLoading } = useGetActivityDetails(BigInt(activityId));
  const registerMutation = useRegisterForActivity();
  const { data: userRegistrations } = useGetUserRegistrations(identity?.getPrincipal());

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Activity not found</p>
            <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const colors = categoryColors[activity.category];
  const isRegistered = userRegistrations?.some((id) => id === activity.id) || false;
  const isOrganizer = identity?.getPrincipal().toString() === activity.organizer.toString();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleRegister = async () => {
    if (!identity) {
      toast.error('Please log in to register');
      return;
    }

    try {
      await registerMutation.mutateAsync(activity.id);
      toast.success('Successfully registered for activity!');
    } catch (error: any) {
      if (error.message?.includes('Unauthorized')) {
        toast.error('Please log in to register');
      } else {
        toast.error('Failed to register for activity');
      }
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Activities
      </Button>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-2 border-orange-100">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-teal-50 pb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-3">{activity.title}</CardTitle>
                <Badge className={`${colors.bg} ${colors.text} border ${colors.border} text-sm`}>
                  {activity.category}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-800 mb-2">About This Activity</h3>
              <p className="text-gray-600 leading-relaxed">{activity.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Date</p>
                  <p className="text-gray-600">{formatDate(activity.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg">
                <Clock className="w-5 h-5 text-teal-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Time</p>
                  <p className="text-gray-600">{activity.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Location</p>
                  <p className="text-gray-600">{activity.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg">
                <Users className="w-5 h-5 text-teal-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Participants</p>
                  <p className="text-gray-600">{Number(activity.participantCount)} registered</p>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <UserCircle className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Organized by</p>
                  <p className="text-gray-600 text-xs font-mono">{activity.organizer.toString()}</p>
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {identity && !isOrganizer && (
              <div className="pt-4">
                <Button
                  onClick={handleRegister}
                  disabled={isRegistered || registerMutation.isPending}
                  className={`w-full ${
                    isRegistered
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white'
                  }`}
                  size="lg"
                >
                  {registerMutation.isPending
                    ? 'Registering...'
                    : isRegistered
                    ? '✓ Already Registered'
                    : 'Register for Activity'}
                </Button>
              </div>
            )}

            {isOrganizer && (
              <div className="pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-blue-700 font-medium">You are the organizer of this activity</p>
                </div>
              </div>
            )}

            {!identity && (
              <div className="pt-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <p className="text-orange-700 font-medium">Please log in to register for this activity</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
