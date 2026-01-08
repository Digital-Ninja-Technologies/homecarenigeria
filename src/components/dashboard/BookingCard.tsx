import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: {
    id: string;
    service_type: string;
    start_date: string;
    start_time?: string;
    end_time?: string;
    location: string;
    status: string;
    amount: number;
    worker_name?: string;
    client_name?: string;
  };
  userType: 'client' | 'worker' | 'agency';
  onAction?: (action: string, bookingId: string) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  disputed: 'bg-orange-100 text-orange-800',
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const BookingCard = ({ booking, userType, onAction }: BookingCardProps) => {
  const showWorkerActions = userType === 'worker' && booking.status === 'pending';
  const showClientActions = userType === 'client' && booking.status === 'pending';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold capitalize">{booking.service_type}</h4>
              <Badge className={cn('text-xs', statusColors[booking.status])}>
                {booking.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {userType === 'client' ? booking.worker_name : booking.client_name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(booking.start_date).toLocaleDateString()}
              </div>
              {booking.start_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {booking.start_time} - {booking.end_time}
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {booking.location}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <p className="font-bold text-lg">{formatCurrency(booking.amount)}</p>

            {showWorkerActions && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction?.('decline', booking.id)}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAction?.('accept', booking.id)}
                >
                  Accept
                </Button>
              </div>
            )}

            {showClientActions && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction?.('cancel', booking.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
