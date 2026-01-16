-- Add 'errand' to the service_category enum
ALTER TYPE public.service_category ADD VALUE IF NOT EXISTS 'errand';