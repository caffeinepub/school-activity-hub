import { Activity, Category } from '../backend';
import { FilterState } from '../components/ActivityFilters';

export function useActivityFilter(activities: Activity[], filters: FilterState): Activity[] {
  return activities.filter((activity) => {
    // Category filter
    if (filters.category !== 'all' && activity.category !== filters.category) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = activity.title.toLowerCase().includes(query);
      const matchesDescription = activity.description.toLowerCase().includes(query);
      const matchesLocation = activity.location.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesLocation) {
        return false;
      }
    }

    // Date range filter
    const activityDate = new Date(Number(activity.date) / 1_000_000);
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      if (activityDate < fromDate) {
        return false;
      }
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (activityDate > toDate) {
        return false;
      }
    }

    return true;
  });
}
