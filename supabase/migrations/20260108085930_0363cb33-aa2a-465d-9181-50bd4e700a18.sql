
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'worker', 'agency');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed');

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Create enum for service categories
CREATE TYPE public.service_category AS ENUM ('nanny', 'housekeeper', 'cleaner', 'driver', 'caregiver', 'tutor');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Create agencies table
CREATE TABLE public.agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    verification_status verification_status DEFAULT 'pending' NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create workers table
CREATE TABLE public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
    bio TEXT,
    services service_category[] NOT NULL DEFAULT '{}',
    hourly_rate INTEGER,
    daily_rate INTEGER,
    monthly_rate INTEGER,
    experience_years INTEGER DEFAULT 0,
    languages TEXT[] DEFAULT '{}',
    working_areas TEXT[] DEFAULT '{}',
    availability JSONB DEFAULT '{}',
    nimc_verified BOOLEAN DEFAULT false,
    police_verified BOOLEAN DEFAULT false,
    verification_status verification_status DEFAULT 'pending' NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    total_jobs INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
    service_type service_category NOT NULL,
    booking_type TEXT NOT NULL CHECK (booking_type IN ('one_time', 'weekly', 'monthly')),
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    location TEXT NOT NULL,
    notes TEXT,
    amount INTEGER NOT NULL,
    platform_fee INTEGER DEFAULT 0,
    status booking_status DEFAULT 'pending' NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'released', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL UNIQUE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create wallet/earnings table for workers
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    balance INTEGER DEFAULT 0 NOT NULL,
    total_earned INTEGER DEFAULT 0 NOT NULL,
    total_withdrawn INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal', 'refund')),
    amount INTEGER NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable"
ON public.profiles FOR SELECT
USING (true);

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role on signup"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Agencies policies
CREATE POLICY "Anyone can view verified agencies"
ON public.agencies FOR SELECT
USING (verification_status = 'verified' OR auth.uid() = user_id);

CREATE POLICY "Agency owners can update their agency"
ON public.agencies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their agency"
ON public.agencies FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Workers policies
CREATE POLICY "Anyone can view verified workers"
ON public.workers FOR SELECT
USING (verification_status = 'verified' OR auth.uid() = user_id);

CREATE POLICY "Workers can update their own profile"
ON public.workers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their worker profile"
ON public.workers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agency can view their workers"
ON public.workers FOR SELECT
USING (
  agency_id IN (
    SELECT id FROM public.agencies WHERE user_id = auth.uid()
  )
);

-- Bookings policies
CREATE POLICY "Clients can view their bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Workers can view their bookings"
ON public.bookings FOR SELECT
USING (
  worker_id IN (
    SELECT id FROM public.workers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Clients can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = client_id);

CREATE POLICY "Workers can update booking status"
ON public.bookings FOR UPDATE
USING (
  worker_id IN (
    SELECT id FROM public.workers WHERE user_id = auth.uid()
  )
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Clients can create reviews for their bookings"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- Wallets policies
CREATE POLICY "Users can view their own wallet"
ON public.wallets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
ON public.wallets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their wallet"
ON public.wallets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON public.agencies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workers_updated_at
    BEFORE UPDATE ON public.workers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update worker rating after review
CREATE OR REPLACE FUNCTION public.update_worker_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.workers
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.reviews
        WHERE worker_id = NEW.worker_id
    )
    WHERE id = NEW.worker_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_worker_rating_trigger
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_worker_rating();
