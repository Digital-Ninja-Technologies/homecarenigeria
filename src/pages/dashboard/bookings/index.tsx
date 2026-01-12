import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { ReviewDialog } from '@/components/dashboard/ReviewDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createNotification, getBookingStatusMessage } from '@/lib/notifications';

export default function ClientBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (bookingsData) {
        // Fetch workers
        const workerIds = [...new Set(bookingsData.map(b => b.worker_id))];
        const { data: workers } = await supabase
          .from('workers')
          .select('id, user_id')
          .in('id', workerIds);

        // Fetch profiles for worker names
        const workerUserIds = workers?.map(w => w.user_id) || [];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', workerUserIds);

        // Fetch existing reviews for these bookings
        const bookingIds = bookingsData.map(b => b.id);
        const { data: reviews } = await supabase
          .from('reviews')
          .select('booking_id')
          .in('booking_id', bookingIds);

        const reviewedBookingIds = new Set(reviews?.map(r => r.booking_id) || []);

        const workerNameMap = new Map();
        const workerUserIdMap = new Map();
        workers?.forEach(w => {
          const profile = profiles?.find(p => p.user_id === w.user_id);
          workerNameMap.set(w.id, profile?.full_name || 'Unknown');
          workerUserIdMap.set(w.id, w.user_id);
        });

        setBookings(
          bookingsData.map(b => ({
            ...b,
            worker_name: workerNameMap.get(b.worker_id) || 'Unknown',
            worker_user_id: workerUserIdMap.get(b.worker_id),
            has_review: reviewedBookingIds.has(b.id),
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
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      // Get client's name for notification
      const { data: clientProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user?.id)
        .single();

      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (!error) {
        // Notify the worker about the cancellation
        if (booking.worker_user_id) {
          await createNotification({
            userId: booking.worker_user_id,
            title: 'Booking Cancelled',
            message: `${clientProfile?.full_name || 'A client'} has cancelled their ${booking.service_type} booking.`,
            type: 'booking',
          });
        }
        toast.info('Booking cancelled');
        fetchBookings();
      } else {
        toast.error('Failed to cancel booking');
      }
    }

    if (action === 'review') {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        setSelectedBooking(booking);
        setReviewDialogOpen(true);
      }
    }
  };

  const handleReviewSuccess = () => {
    fetchBookings();
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
                  onAction={handleAction}
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

      {/* Review Dialog */}
      {selectedBooking && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          booking={selectedBooking}
          onSuccess={handleReviewSuccess}
        />
      )}
    </DashboardLayout>
  );
}
