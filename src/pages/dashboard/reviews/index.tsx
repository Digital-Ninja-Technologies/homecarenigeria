import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ReviewsPageProps {
  userType?: 'client' | 'worker';
}

export default function ReviewsPage({ userType = 'client' }: ReviewsPageProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('*, bookings(service_type)')
        .eq(userType === 'client' ? 'client_id' : 'worker_id', user?.id)
        .order('created_at', { ascending: false });

      setReviews(data || []);
    } catch (error) {
      // Silently handle fetch errors - user will see empty state
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type={userType}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {userType === 'client' ? 'My Reviews' : 'Reviews'}
          </h1>
          <p className="text-muted-foreground">
            {userType === 'client' 
              ? 'Reviews you have given' 
              : 'Reviews from your clients'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">
                          {review.bookings?.service_type || 'Service'}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {review.comment || 'No comment provided'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">
                {userType === 'client'
                  ? 'Complete bookings to leave reviews'
                  : 'Your reviews from clients will appear here'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
