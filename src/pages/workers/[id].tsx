import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  ArrowLeft, 
  CheckCircle, 
  MapPin, 
  Star, 
  Clock,
  Calendar as CalendarIcon,
  Shield,
  Languages,
  Briefcase,
  MessageSquare,
  Phone,
  Loader2,
  BadgeCheck,
  FileCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function WorkerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  
  const [worker, setWorker] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (id) {
      fetchWorkerData();
    }
  }, [id]);

  const fetchWorkerData = async () => {
    try {
      // Fetch worker with profile
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('*, profiles!inner(full_name, avatar_url, location, phone)')
        .eq('id', id)
        .single();

      if (workerError) throw workerError;
      setWorker(workerData);

      // Fetch reviews for this worker
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, profiles:client_id(full_name, avatar_url)')
        .eq('worker_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsData) {
        // Need to fetch client profiles separately since we're using client_id
        const reviewsWithProfiles = await Promise.all(
          reviewsData.map(async (review) => {
            const { data: profile } = await supabase
              .from('public_profiles')
              .select('full_name, avatar_url')
              .eq('user_id', review.client_id)
              .single();
            return { ...review, client_profile: profile };
          })
        );
        setReviews(reviewsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching worker:', error);
      toast.error('Worker not found');
      navigate('/');
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

  const handleBookNow = () => {
    if (!user) {
      // Redirect to login with return URL to booking page
      navigate(`/login?redirect=/book/${id}`);
      return;
    }
    if (role !== 'client') {
      toast.error('Only clients can book workers');
      return;
    }
    navigate(`/dashboard/book/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Worker not found</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const availability = worker.availability as Record<string, boolean> | null;
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                    <AvatarImage src={worker.profiles?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {worker.profiles?.full_name?.charAt(0) || 'W'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold">{worker.profiles?.full_name}</h1>
                        {worker.verification_status === 'verified' && (
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {worker.agency_id && (
                          <Badge variant="outline">Agency Worker</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {worker.working_areas?.[0] || worker.profiles?.location || 'Lagos'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {worker.experience_years || 0} years exp.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">
                          {(worker.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({worker.total_jobs || 0} jobs)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {worker.services?.map((service: string) => (
                        <Badge key={service} variant="secondary" className="capitalize">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for different sections */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6 mt-6">
                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {worker.bio || 'No bio provided yet. This worker is verified and ready to help with your domestic needs.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Verification & Trust */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verification & Trust</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${worker.nimc_verified ? 'bg-accent/10' : 'bg-muted'}`}>
                        <div className={`p-2 rounded-full ${worker.nimc_verified ? 'bg-accent/20 text-accent' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                          <BadgeCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">NIMC Verified</p>
                          <p className="text-sm text-muted-foreground">
                            {worker.nimc_verified ? 'Identity confirmed' : 'Pending verification'}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${worker.police_verified ? 'bg-accent/10' : 'bg-muted'}`}>
                        <div className={`p-2 rounded-full ${worker.police_verified ? 'bg-accent/20 text-accent' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                          <FileCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">Police Clearance</p>
                          <p className="text-sm text-muted-foreground">
                            {worker.police_verified ? 'Background checked' : 'Pending verification'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Languages & Areas */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {worker.languages?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Languages className="h-5 w-5" />
                          Languages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {worker.languages.map((lang: string) => (
                            <Badge key={lang} variant="outline" className="capitalize">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {worker.working_areas?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Service Areas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {worker.working_areas.map((area: string) => (
                            <Badge key={area} variant="outline">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={review.client_profile?.avatar_url} />
                                <AvatarFallback>
                                  {review.client_profile?.full_name?.charAt(0) || 'C'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">
                                    {review.client_profile?.full_name || 'Anonymous'}
                                  </p>
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                                    />
                                  ))}
                                </div>
                                {review.comment && (
                                  <p className="mt-2 text-muted-foreground">
                                    {review.comment}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No reviews yet</p>
                        <p className="text-sm">Be the first to hire and review this worker!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability" className="mt-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Weekly Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {daysOfWeek.map((day) => {
                          const isAvailable = availability?.[day] !== false;
                          return (
                            <div 
                              key={day} 
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                isAvailable ? 'bg-accent/10' : 'bg-muted'
                              }`}
                            >
                              <span className="capitalize font-medium">{day}</span>
                              <Badge variant={isAvailable ? 'default' : 'secondary'}>
                                {isAvailable ? 'Available' : 'Unavailable'}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Check Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-lg border"
                      />
                      {selectedDate && (
                        <div className="mt-4 p-3 rounded-lg bg-accent/10 text-accent">
                          <p className="text-sm font-medium">
                            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                          </p>
                          <p className="text-sm">
                            Worker is likely available on this date
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Hire This Worker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Hourly Rate</span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(worker.hourly_rate || 2000)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Daily Rate</span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(worker.daily_rate || 15000)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Monthly Rate</span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(worker.monthly_rate || 350000)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Trust Badges */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 text-accent">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Secure escrow payment protection
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleBookNow}>
                    Book Now
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={user ? '/dashboard/messages' : '/login'}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  You won't be charged until the worker accepts your booking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
