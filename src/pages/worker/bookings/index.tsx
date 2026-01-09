import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function WorkerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkerAndBookings();
    }
  }, [user]);

  const fetchWorkerAndBookings = async () => {
    try {
      const { data: workerData } = await supabase
        .from('workers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (workerData) {
        setWorker(workerData);

        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('worker_id', workerData.id)
          .order('created_at', { ascending: false });

        if (bookingsData) {
          const clientIds = [...new Set(bookingsData.map(b => b.client_id))];
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, full_name')
            .in('user_id', clientIds);

          const clientNameMap = new Map();
          profiles?.forEach(p => {
            clientNameMap.set(p.user_id, p.full_name);
          });

          setBookings(
            bookingsData.map(b => ({
              ...b,
              client_name: clientNameMap.get(b.client_id) || 'Unknown',
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, bookingId: string) => {
    const newStatus = action === 'accept' ? 'accepted' : 'cancelled';
    
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (!error) {
      fetchWorkerAndBookings();
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => 
    ['accepted', 'in_progress'].includes(b.status)
  );
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <DashboardLayout type="worker">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your job requests and bookings
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : pendingBookings.length > 0 ? (
              pendingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userType="worker"
                  onAction={handleAction}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pending requests
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-4">
            {activeBookings.length > 0 ? (
              activeBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userType="worker"
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No active jobs
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
                  userType="worker"
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No completed jobs yet
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
