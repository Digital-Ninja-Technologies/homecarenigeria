import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Calendar,
  MessageSquare,
  Wallet,
  Settings,
  Users,
  Briefcase,
  Star,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Building2,
  Search,
  FileText,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  type: 'client' | 'worker' | 'agency';
}

const clientNavItems = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/search', label: 'Find Workers', icon: Search },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/reviews', label: 'My Reviews', icon: Star },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const workerNavItems = [
  { href: '/worker/dashboard', label: 'Overview', icon: Home },
  { href: '/worker/bookings', label: 'Bookings', icon: Calendar },
  { href: '/worker/earnings', label: 'Earnings', icon: Wallet },
  { href: '/worker/messages', label: 'Messages', icon: MessageSquare },
  { href: '/worker/reviews', label: 'Reviews', icon: Star },
  { href: '/worker/profile', label: 'My Profile', icon: User },
  { href: '/worker/documents', label: 'Documents', icon: FileText },
  { href: '/worker/settings', label: 'Settings', icon: Settings },
];

const agencyNavItems = [
  { href: '/agency/dashboard', label: 'Overview', icon: Home },
  { href: '/agency/workers', label: 'My Workers', icon: Users },
  { href: '/agency/bookings', label: 'Bookings', icon: Calendar },
  { href: '/agency/earnings', label: 'Earnings', icon: Wallet },
  { href: '/agency/messages', label: 'Messages', icon: MessageSquare },
  { href: '/agency/profile', label: 'Agency Profile', icon: Building2 },
  { href: '/agency/settings', label: 'Settings', icon: Settings },
];

export const DashboardLayout = ({ children, type }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const navItems = type === 'client' 
    ? clientNavItems 
    : type === 'worker' 
    ? workerNavItems 
    : agencyNavItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardTitle = type === 'client' 
    ? 'Client Dashboard' 
    : type === 'worker' 
    ? 'Worker Dashboard' 
    : 'Agency Dashboard';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-primary">HomeCare</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-background border-r z-40 transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-primary block">HomeCare</span>
              <span className="text-xs text-muted-foreground">{dashboardTitle}</span>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
