import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Activity, ActivityInput, ActivityID } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

// Get upcoming activities
export function useGetUpcomingActivities() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUpcomingActivities();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Get activity details
export function useGetActivityDetails(activityId: ActivityID) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Activity | null>({
    queryKey: ['activity', activityId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getActivityDetails(activityId);
    },
    enabled: !!actor && !actorFetching,
  });
}

// Create activity
export function useCreateActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ActivityInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createActivity(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

// Register for activity
export function useRegisterForActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: ActivityID) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerForActivity(activityId);
    },
    onSuccess: (_, activityId) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', activityId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
    },
  });
}

// Get user registrations
export function useGetUserRegistrations(user: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ActivityID[]>({
    queryKey: ['userRegistrations', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getUserRegistrations(user);
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}
