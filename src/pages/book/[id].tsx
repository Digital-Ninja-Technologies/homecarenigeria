import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * Public booking route that handles authentication redirect
 * If user is logged in as client, redirects to dashboard booking
 * If not logged in, redirects to login with return URL
 */
export default function PublicBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in - redirect to login with return URL
      navigate(`/login?redirect=/book/${id}`);
      return;
    }

    if (role === 'client') {
      // Logged in as client - redirect to dashboard booking
      navigate(`/dashboard/book/${id}`, { replace: true });
    } else {
      // Logged in but not as client - show error and redirect
      navigate(`/workers/${id}`, { replace: true });
    }
  }, [user, role, loading, id, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to booking...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
