import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Wallet,
  Star,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function WorkerDashboard() {
  const { user, profile } = useAuth();
  const [worker, setWorker] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    pendingRequests: 0,
    rating: 0,
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
      // Fetch worker profile
      const { data: workerData } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (workerData) {
        setWorker(workerData);

        // Fetch bookings
        const { data: bookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('worker_id', workerData.id)
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

          const pending = bookings.filter(b => b.status === 'pending').length;
          const active = bookings.filter(b => 
            ['accepted', 'in_progress'].includes(b.status)
          ).length;
          const completed = bookings.filter(b => b.status === 'completed').length;

          setStats({
            totalJobs: workerData.total_jobs,
            activeJobs: active,
            completedJobs: completed,
            pendingRequests: pending,
            rating: workerData.rating || 0,
          });

          setRecentBookings(
            bookings.slice(0, 5).map(b => ({
              ...b,
              client_name: clientNameMap.get(b.client_id) || 'Unknown',
            }))
          );
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
    } catch {
      // Error fetching dashboard data - silently fail and show empty state
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (action: string, bookingId: string) => {
    const newStatus = action === 'accept' ? 'accepted' : 'cancelled';
    
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (!error) {
      fetchDashboardData();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const verificationProgress = worker
    ? ((worker.nimc_verified ? 1 : 0) + (worker.police_verified ? 1 : 0)) / 2 * 100
    : 0;

  return (
    <DashboardLayout type="worker">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-muted-foreground">
              Here's your performance overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={worker?.verification_status === 'verified' ? 'default' : 'secondary'}
              className="gap-1"
            >
              {worker?.verification_status === 'verified' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {worker?.verification_status || 'Pending'}
            </Badge>
          </div>
        </div>

        {/* Verification Banner */}
        {worker && worker.verification_status !== 'verified' && (
          <Card className="border-yellow-500 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800">
                    Complete Your Verification
                  </h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Upload your documents to get verified and start receiving bookings.
                  </p>
                  <Progress value={verificationProgress} className="h-2 mb-2" />
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link to="/worker/documents">Upload Documents</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={<Clock className="w-6 h-6" />}
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={<Calendar className="w-6 h-6" />}
          />
          <StatCard
            title="Available Balance"
            value={formatCurrency(wallet?.balance || 0)}
            icon={<Wallet className="w-6 h-6" />}
          />
          <StatCard
            title="Rating"
            value={stats.rating.toFixed(1)}
            icon={<Star className="w-6 h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/worker/bookings">
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
                    userType="worker"
                    onAction={handleBookingAction}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No bookings yet. Complete your profile to start receiving requests!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Earnings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(wallet?.balance || 0)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="font-semibold">
                    {formatCurrency(wallet?.total_earned || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Withdrawn</p>
                  <p className="font-semibold">
                    {formatCurrency(wallet?.total_withdrawn || 0)}
                  </p>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link to="/worker/earnings">View Earnings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
