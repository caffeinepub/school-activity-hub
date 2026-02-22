import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreateActivityPage from './pages/CreateActivityPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import MyActivitiesPage from './pages/MyActivitiesPage';
import CalendarPage from './pages/CalendarPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: LayoutWrapper,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const createActivityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateActivityPage,
});

const activityDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/activity/$activityId',
  component: ActivityDetailPage,
});

const myActivitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-activities',
  component: MyActivitiesPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: CalendarPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  createActivityRoute,
  activityDetailRoute,
  myActivitiesRoute,
  calendarRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { loginStatus } = useInternetIdentity();

  if (loginStatus === 'initializing') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading School Activity Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
