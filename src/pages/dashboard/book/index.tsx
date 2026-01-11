import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  Star, 
  Clock,
  Calendar as CalendarIcon,
  CreditCard,
  Building2,
  Wallet,
  Shield,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format, addDays, differenceInDays, differenceInHours } from 'date-fns';

type BookingType = 'hourly' | 'daily' | 'monthly';
type PaymentMethod = 'card' | 'bank_transfer' | 'wallet';

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

export default function BookWorker() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Booking details
  const [bookingType, setBookingType] = useState<BookingType>('hourly');
  const [selectedService, setSelectedService] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  useEffect(() => {
    if (workerId) {
      fetchWorker();
    }
  }, [workerId]);

  const fetchWorker = async () => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*, profiles!inner(full_name, avatar_url, location)')
        .eq('id', workerId)
        .single();

      if (error) throw error;
      setWorker(data);
      if (data.services?.length > 0) {
        setSelectedService(data.services[0]);
      }
    } catch (error) {
      console.error('Error fetching worker:', error);
      toast.error('Worker not found');
      navigate('/dashboard/search');
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = () => {
    if (!worker) return 0;
    
    switch (bookingType) {
      case 'hourly':
        if (startTime && endTime) {
          const hours = parseInt(endTime) - parseInt(startTime);
          return Math.max(hours, 1) * (worker.hourly_rate || 2000);
        }
        return worker.hourly_rate || 2000;
      case 'daily':
        if (startDate && endDate) {
          const days = differenceInDays(endDate, startDate) + 1;
          return Math.max(days, 1) * (worker.daily_rate || 15000);
        }
        return worker.daily_rate || 15000;
      case 'monthly':
        return worker.monthly_rate || 350000;
      default:
        return 0;
    }
  };

  const platformFee = Math.round(calculateAmount() * 0.1); // 10% platform fee
  const totalAmount = calculateAmount() + platformFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async () => {
    if (!user || !worker || !startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        client_id: user.id,
        worker_id: worker.id,
        service_type: selectedService as "nanny" | "housekeeper" | "cleaner" | "driver" | "caregiver" | "tutor",
        booking_type: bookingType,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        start_time: startTime,
        end_time: endTime,
        location: location,
        notes: notes,
        amount: calculateAmount(),
        platform_fee: platformFee,
        status: 'pending' as const,
        payment_status: 'pending'
      });

      if (error) throw error;

      toast.success('Booking request sent successfully!');
      navigate('/dashboard/bookings');
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedService && bookingType;
      case 2:
        return startDate && location;
      case 3:
        return paymentMethod;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <DashboardLayout type="client">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!worker) {
    return (
      <DashboardLayout type="client">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Worker not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="client">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard/search')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Book a Worker</h1>
            <p className="text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  s < step 
                    ? 'bg-accent text-accent-foreground' 
                    : s === step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s < step ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-accent' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Service & Duration</CardTitle>
                  <CardDescription>
                    Select the service you need and how long you need it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Select Service</Label>
                    <RadioGroup 
                      value={selectedService} 
                      onValueChange={setSelectedService}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    >
                      {worker.services?.map((service: string) => (
                        <Label
                          key={service}
                          className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all capitalize ${
                            selectedService === service
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value={service} className="sr-only" />
                          {service}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Booking Type</Label>
                    <RadioGroup 
                      value={bookingType} 
                      onValueChange={(v) => setBookingType(v as BookingType)}
                      className="grid grid-cols-3 gap-3"
                    >
                      <Label
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          bookingType === 'hourly'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="hourly" className="sr-only" />
                        <Clock className="h-5 w-5 mb-2" />
                        <span className="font-medium">Hourly</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(worker.hourly_rate || 2000)}/hr
                        </span>
                      </Label>
                      <Label
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          bookingType === 'daily'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="daily" className="sr-only" />
                        <CalendarIcon className="h-5 w-5 mb-2" />
                        <span className="font-medium">Daily</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(worker.daily_rate || 15000)}/day
                        </span>
                      </Label>
                      <Label
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          bookingType === 'monthly'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="monthly" className="sr-only" />
                        <CalendarIcon className="h-5 w-5 mb-2" />
                        <span className="font-medium">Monthly</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(worker.monthly_rate || 350000)}/mo
                        </span>
                      </Label>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Location</CardTitle>
                  <CardDescription>
                    Pick your preferred dates, times, and service location
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Start Date</Label>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-lg border"
                      />
                    </div>
                    
                    {bookingType === 'daily' && (
                      <div className="space-y-3">
                        <Label>End Date</Label>
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => !startDate || date < startDate}
                          className="rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {bookingType === 'hourly' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Select value={startTime} onValueChange={setStartTime}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Select value={endTime} onValueChange={setEndTime}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots
                              .filter((t) => t > startTime)
                              .map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <Label>Service Location (Address)</Label>
                    <Textarea
                      placeholder="Enter the full address where the service will be provided..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Notes (Optional)</Label>
                    <Textarea
                      placeholder="Any special instructions or requirements..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Choose how you'd like to pay. Payment is held securely until the job is completed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 text-accent">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">
                      Your payment is protected by our escrow system
                    </span>
                  </div>

                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    className="space-y-3"
                  >
                    <Label
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="card" className="sr-only" />
                      <div className="p-2 rounded-lg bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Debit/Credit Card</p>
                        <p className="text-sm text-muted-foreground">
                          Pay securely with your card via Paystack
                        </p>
                      </div>
                    </Label>

                    <Label
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="bank_transfer" className="sr-only" />
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">
                          Pay via direct bank transfer
                        </p>
                      </div>
                    </Label>

                    <Label
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'wallet'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="wallet" className="sr-only" />
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Platform Wallet</p>
                        <p className="text-sm text-muted-foreground">
                          Pay from your HomeCare Connect wallet balance
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Worker Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={worker.profiles?.avatar_url} />
                    <AvatarFallback>
                      {worker.profiles?.full_name?.charAt(0) || 'W'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold">{worker.profiles?.full_name}</p>
                      <CheckCircle className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {(worker.rating || 0).toFixed(1)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium capitalize">{selectedService || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">{bookingType}</span>
                  </div>
                  {startDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {format(startDate, 'MMM d, yyyy')}
                        {endDate && bookingType === 'daily' && ` - ${format(endDate, 'MMM d')}`}
                      </span>
                    </div>
                  )}
                  {bookingType === 'hourly' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{startTime} - {endTime}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>{formatCurrency(calculateAmount())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (10%)</span>
                    <span>{formatCurrency(platformFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {step < 3 ? (
                    <Button 
                      className="w-full" 
                      onClick={() => setStep(step + 1)}
                      disabled={!canProceed()}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handleSubmit}
                      disabled={submitting || !canProceed()}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Booking
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
