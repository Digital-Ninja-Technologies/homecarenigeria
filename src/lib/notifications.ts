import { supabase } from '@/integrations/supabase/client';

type NotificationType = 'booking' | 'payment' | 'review' | 'system';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}

export async function createNotification({
  userId,
  title,
  message,
  type = 'booking',
}: CreateNotificationParams): Promise<boolean> {
  // Use the secure RPC function that validates business relationships
  // This prevents notification spam by only allowing notifications between
  // users who share a booking (client-worker pairs)
  const { error } = await supabase.rpc('create_booking_notification', {
    _target_user_id: userId,
    _title: title,
    _message: message,
    _type: type,
  });

  if (error) {
    console.error('Failed to create notification:', error.message);
    return false;
  }
  
  return true;
}

export function getBookingStatusMessage(
  status: string,
  isForClient: boolean,
  workerName?: string,
  clientName?: string,
  serviceType?: string
): { title: string; message: string } {
  const service = serviceType || 'service';
  
  switch (status) {
    case 'accepted':
      return isForClient
        ? {
            title: 'Booking Accepted!',
            message: `${workerName || 'The worker'} has accepted your ${service} booking. They will contact you shortly.`,
          }
        : {
            title: 'You accepted a booking',
            message: `You accepted the ${service} booking from ${clientName || 'a client'}.`,
          };
    case 'cancelled':
      return isForClient
        ? {
            title: 'Booking Declined',
            message: `Unfortunately, ${workerName || 'the worker'} has declined your ${service} booking. Please try another worker.`,
          }
        : {
            title: 'Booking Cancelled',
            message: `The ${service} booking from ${clientName || 'a client'} has been cancelled.`,
          };
    case 'completed':
      return isForClient
        ? {
            title: 'Job Completed!',
            message: `${workerName || 'The worker'} has marked your ${service} job as complete. Please release payment and leave a review.`,
          }
        : {
            title: 'Job Marked Complete',
            message: `You marked the ${service} job for ${clientName || 'the client'} as complete. Awaiting payment release.`,
          };
    case 'in_progress':
      return isForClient
        ? {
            title: 'Job Started',
            message: `${workerName || 'The worker'} has started working on your ${service} job.`,
          }
        : {
            title: 'Job In Progress',
            message: `You started the ${service} job for ${clientName || 'the client'}.`,
          };
    default:
      return {
        title: 'Booking Update',
        message: `Your booking status has been updated to ${status}.`,
      };
  }
}
