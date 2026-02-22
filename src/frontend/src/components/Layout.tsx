import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Calendar, Home, Plus, List, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const currentPath = routerState.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    ...(isAuthenticated
      ? [
          { to: '/my-activities', label: 'My Activities', icon: List },
          { to: '/create', label: 'Create Activity', icon: Plus },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                  School Activity Hub
                </h1>
                <p className="text-xs text-gray-500">Organize & Connect</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.to;
                return (
                  <Link key={link.to} to={link.to}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white hover:from-orange-600 hover:to-teal-600'
                          : 'hover:bg-orange-50'
                      }
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Auth Button & Mobile Menu */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAuth}
                disabled={loginStatus === 'logging-in'}
                className={
                  isAuthenticated
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    : 'bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white'
                }
              >
                {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-2 flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.to;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white'
                          : 'hover:bg-orange-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">School Activity Hub</h3>
              <p className="text-sm text-gray-600">
                Connecting students through organized activities and events. Build community, discover opportunities,
                and make memories.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">
                    Browse Activities
                  </Link>
                </li>
                <li>
                  <Link to="/calendar" className="text-gray-600 hover:text-orange-600 transition-colors">
                    View Calendar
                  </Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link to="/create" className="text-gray-600 hover:text-orange-600 transition-colors">
                      Create Activity
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Connect With Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook className="w-4 h-4 text-orange-600" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-teal-100 hover:bg-teal-200 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <SiX className="w-4 h-4 text-teal-600" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="w-4 h-4 text-orange-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} School Activity Hub. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
