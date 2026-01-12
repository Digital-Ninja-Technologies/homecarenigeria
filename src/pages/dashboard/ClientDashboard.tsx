import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Star, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function ClientDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (bookings) {
        // Fetch worker names for each booking
        const workerIds = [...new Set(bookings.map(b => b.worker_id))];
        const { data: workers } = await supabase
          .from('workers')
          .select('id, user_id')
          .in('id', workerIds);

        const workerUserIds = workers?.map(w => w.user_id) || [];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', workerUserIds);

        const workerNameMap = new Map();
        workers?.forEach(w => {
          const profile = profiles?.find(p => p.user_id === w.user_id);
          workerNameMap.set(w.id, profile?.full_name || 'Unknown');
        });

        const total = bookings.length;
        const active = bookings.filter(b => 
          ['pending', 'accepted', 'in_progress'].includes(b.status)
        ).length;
        const completed = bookings.filter(b => b.status === 'completed').length;
        const spent = bookings
          .filter(b => b.payment_status === 'released')
          .reduce((sum, b) => sum + b.amount, 0);

        setStats({
          totalBookings: total,
          activeBookings: active,
          completedBookings: completed,
          totalSpent: spent,
        });

        setRecentBookings(
          bookings.slice(0, 5).map(b => ({
            ...b,
            worker_name: workerNameMap.get(b.worker_id) || 'Unknown',
          }))
        );
      }
    } catch {
      // Error fetching dashboard data - silently fail and show empty state
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout type="client">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your bookings
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/search">
              <Search className="w-4 h-4 mr-2" />
              Find Workers
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<Calendar className="w-6 h-6" />}
          />
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings}
            icon={<Clock className="w-6 h-6" />}
          />
          <StatCard
            title="Completed"
            value={stats.completedBookings}
            icon={<Star className="w-6 h-6" />}
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(stats.totalSpent)}
            icon={<span className="text-lg font-bold">₦</span>}
          />
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/bookings">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userType="client"
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No bookings yet. Start by finding a worker!
                </p>
                <Button asChild>
                  <Link to="/dashboard/search">Find Workers</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardContent className="p-6">
              <Link to="/dashboard/search?category=nanny" className="block">
                <div className="text-3xl mb-2">👶</div>
                <h3 className="font-semibold">Find a Nanny</h3>
                <p className="text-sm text-muted-foreground">
                  Professional childcare providers
                </p>
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardContent className="p-6">
              <Link to="/dashboard/search?category=cleaner" className="block">
                <div className="text-3xl mb-2">🧹</div>
                <h3 className="font-semibold">Book a Cleaner</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your home spotless
                </p>
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardContent className="p-6">
              <Link to="/dashboard/search?category=driver" className="block">
                <div className="text-3xl mb-2">🚗</div>
                <h3 className="font-semibold">Hire a Driver</h3>
                <p className="text-sm text-muted-foreground">
                  Safe and reliable transport
                </p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
