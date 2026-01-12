import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schema for reviews
const reviewSchema = z.object({
  rating: z.number()
    .int('Rating must be a whole number')
    .min(1, 'Please select a rating')
    .max(5, 'Rating must be between 1 and 5'),
  comment: z.string()
    .max(1000, 'Comment must be less than 1000 characters')
    .optional()
    .transform(val => val?.trim() || ''),
});

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    worker_id: string;
    worker_name?: string;
    service_type: string;
  };
  onSuccess?: () => void;
}

export function ReviewDialog({ open, onOpenChange, booking, onSuccess }: ReviewDialogProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }

    try {
      // Validate with zod schema
      const validatedData = reviewSchema.parse({ rating, comment });

      setSubmitting(true);

      const { error } = await supabase.from('reviews').insert({
        booking_id: booking.id,
        client_id: user.id,
        worker_id: booking.worker_id,
        rating: validatedData.rating,
        comment: validatedData.comment || null,
      });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      // Handle zod validation errors
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError?.message || 'Validation failed');
        return;
      }
      
      // Handle duplicate review error
      if (error.code === '23505') {
        toast.error('You have already reviewed this booking');
        return;
      }
      
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setRating(0);
      setHoverRating(0);
      setComment('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {booking.worker_name || 'this worker'} for your{' '}
            <span className="capitalize">{booking.service_type}</span> booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  disabled={submitting}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share details about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/1000 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
