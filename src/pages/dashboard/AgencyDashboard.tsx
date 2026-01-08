import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Calendar,
  Wallet,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function AgencyDashboard() {
  const { user, profile } = useAuth();
  const [agency, setAgency] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalWorkers: 0,
    activeWorkers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
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
      // Fetch agency profile
      const { data: agencyData } = await supabase
        .from('agencies')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (agencyData) {
        setAgency(agencyData);

        // Fetch workers under this agency
        const { data: workersData } = await supabase
          .from('workers')
          .select('*')
          .eq('agency_id', agencyData.id);

        if (workersData) {
          // Fetch worker profiles
          const workerUserIds = workersData.map(w => w.user_id);
          const { data: workerProfiles } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url')
            .in('user_id', workerUserIds);

          const workersWithProfiles = workersData.map(w => ({
            ...w,
            profiles: workerProfiles?.find(p => p.user_id === w.user_id),
          }));
          setWorkers(workersWithProfiles);
          
          const workerIds = workersData.map(w => w.id);
          
          // Fetch bookings for agency workers
          if (workerIds.length > 0) {
            const { data: bookings } = await supabase
              .from('bookings')
              .select('*')
              .in('worker_id', workerIds)
              .order('created_at', { ascending: false });

            if (bookings) {
              // Fetch client names
              const clientIds = [...new Set(bookings.map(b => b.client_id))];
              const { data: clientProfiles } = await supabase
                .from('profiles')
                .select('user_id, full_name')
                .in('user_id', clientIds);

              const clientNameMap = new Map();
              clientProfiles?.forEach(p => {
                clientNameMap.set(p.user_id, p.full_name);
              });

              const workerNameMap = new Map();
              workersWithProfiles.forEach(w => {
                workerNameMap.set(w.id, w.profiles?.full_name || 'Unknown');
              });

              const pending = bookings.filter(b => b.status === 'pending').length;
              const totalEarnings = bookings
                .filter(b => b.payment_status === 'released')
                .reduce((sum, b) => sum + b.amount, 0);

              setStats({
                totalWorkers: workersData.length,
                activeWorkers: workersData.filter(w => w.verification_status === 'verified').length,
                totalBookings: bookings.length,
                pendingBookings: pending,
                totalEarnings,
              });

              setRecentBookings(
                bookings.slice(0, 5).map(b => ({
                  ...b,
                  worker_name: workerNameMap.get(b.worker_id) || 'Unknown',
                  client_name: clientNameMap.get(b.client_id) || 'Unknown',
                }))
              );
            }
          } else {
            setStats({
              totalWorkers: 0,
              activeWorkers: 0,
              totalBookings: 0,
              pendingBookings: 0,
              totalEarnings: 0,
            });
          }
        }
      }

      // Fetch wallet
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (walletData) {
        setWallet(walletData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
    <DashboardLayout type="agency">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {agency?.name || 'Agency Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              Manage your workers and bookings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={agency?.verification_status === 'verified' ? 'default' : 'secondary'}
              className="gap-1"
            >
              {agency?.verification_status === 'verified' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {agency?.verification_status || 'Pending'}
            </Badge>
          </div>
        </div>

        {/* Verification Banner */}
        {agency && agency.verification_status !== 'verified' && (
          <Card className="border-yellow-500 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800">
                    Complete Agency Verification
                  </h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Verify your agency to build trust and start receiving bookings.
                  </p>
                  <Button size="sm" asChild>
                    <Link to="/agency/profile">Complete Verification</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Workers"
            value={stats.totalWorkers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            icon={<Clock className="w-6 h-6" />}
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<Calendar className="w-6 h-6" />}
          />
          <StatCard
            title="Total Earnings"
            value={formatCurrency(stats.totalEarnings)}
            icon={<Wallet className="w-6 h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/agency/bookings">
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
                    userType="agency"
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No bookings yet. Add workers to start receiving requests.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workers Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                My Workers
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/agency/workers">
                  <Plus className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {workers.length > 0 ? (
                <div className="space-y-3">
                  {workers.slice(0, 5).map((worker) => (
                    <div
                      key={worker.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={worker.profiles?.avatar_url} />
                        <AvatarFallback>
                          {worker.profiles?.full_name?.charAt(0) || 'W'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {worker.profiles?.full_name || 'Unknown'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">
                            {worker.services?.[0] || 'No service'}
                          </span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {worker.rating?.toFixed(1) || '0.0'}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={worker.verification_status === 'verified' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {worker.verification_status}
                      </Badge>
                    </div>
                  ))}
                  {workers.length > 5 && (
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/agency/workers">
                        View All {workers.length} Workers
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-3">
                    No workers added yet
                  </p>
                  <Button size="sm" asChild>
                    <Link to="/agency/workers">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Workers
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Performance charts will appear here as you receive more bookings.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
