import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function ClientBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (bookingsData) {
        const workerIds = [...new Set(bookingsData.map(b => b.worker_id))];
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

        setBookings(
          bookingsData.map(b => ({
            ...b,
            worker_name: workerNameMap.get(b.worker_id) || 'Unknown',
          }))
        );
      }
    } catch (error) {
      // Silently handle fetch errors - user will see empty state
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, bookingId: string) => {
    if (action === 'cancel') {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (!error) {
        fetchBookings();
      }
    }
  };

  const activeBookings = bookings.filter(b => 
    ['pending', 'accepted', 'in_progress'].includes(b.status)
  );
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  return (
    <DashboardLayout type="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage all your bookings in one place
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : activeBookings.length > 0 ? (
              activeBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userType="client"
                  onAction={handleAction}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No active bookings
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userType="client"
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No completed bookings yet
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4 mt-4">
            {cancelledBookings.length > 0 ? (
              cancelledBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userType="client"
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No cancelled bookings
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
