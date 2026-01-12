-- Add DELETE policy for bookings table
-- Allow clients to delete their own pending bookings only
CREATE POLICY "Clients can delete pending bookings"
ON public.bookings FOR DELETE
USING (
  auth.uid() = client_id 
  AND status = 'pending'
);