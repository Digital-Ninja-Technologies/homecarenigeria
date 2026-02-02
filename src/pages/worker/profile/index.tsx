import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import { z } from 'zod';

type ServiceCategory = Database["public"]["Enums"]["service_category"];

// Validation schema for worker profile
const SERVICE_CATEGORIES = ['nanny', 'housekeeper', 'cleaner', 'driver', 'caregiver', 'tutor', 'errand'] as const;

const workerProfileSchema = z.object({
  bio: z.string()
    .max(2000, 'Bio must be less than 2000 characters')
    .optional()
    .transform(val => val?.trim() || ''),
  hourly_rate: z.number()
    .int('Rate must be a whole number')
    .min(500, 'Minimum hourly rate is ₦500')
    .max(100000, 'Maximum hourly rate is ₦100,000')
    .nullable(),
  daily_rate: z.number()
    .int('Rate must be a whole number')
    .min(2000, 'Minimum daily rate is ₦2,000')
    .max(500000, 'Maximum daily rate is ₦500,000')
    .nullable(),
  monthly_rate: z.number()
    .int('Rate must be a whole number')
    .min(30000, 'Minimum monthly rate is ₦30,000')
    .max(5000000, 'Maximum monthly rate is ₦5,000,000')
    .nullable(),
  services: z.array(z.enum(SERVICE_CATEGORIES))
    .min(1, 'Please select at least one service'),
});

const serviceTypes: { id: ServiceCategory; label: string }[] = [
  { id: "nanny", label: "Nanny / Childcare" },
  { id: "housekeeper", label: "Housekeeper" },
  { id: "cleaner", label: "Cleaner" },
  { id: "driver", label: "Driver" },
  { id: "caregiver", label: "Elderly Caregiver" },
  { id: "tutor", label: "Home Tutor" },
  { id: "errand", label: "Errand / Personal Assistant" },
];

export default function WorkerProfile() {
  const { user, profile } = useAuth();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: '',
    dailyRate: '',
    monthlyRate: '',
    services: [] as ServiceCategory[],
  });

  useEffect(() => {
    if (user) {
      fetchWorker();
    }
  }, [user]);

  const fetchWorker = async () => {
    try {
      const { data } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setWorker(data);
        setFormData({
          bio: data.bio || '',
          hourlyRate: data.hourly_rate?.toString() || '',
          dailyRate: data.daily_rate?.toString() || '',
          monthlyRate: data.monthly_rate?.toString() || '',
          services: data.services || [],
        });
      }
    } catch (error) {
      // Silently handle fetch errors - user will see empty state
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: ServiceCategory) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare and validate data
      const profileData = {
        bio: formData.bio,
        hourly_rate: formData.hourlyRate ? parseInt(formData.hourlyRate) : null,
        daily_rate: formData.dailyRate ? parseInt(formData.dailyRate) : null,
        monthly_rate: formData.monthlyRate ? parseInt(formData.monthlyRate) : null,
        services: formData.services,
      };

      // Validate with zod schema
      const validatedData = workerProfileSchema.parse(profileData);

      const { error } = await supabase
        .from('workers')
        .update({
          bio: validatedData.bio,
          hourly_rate: validatedData.hourly_rate,
          daily_rate: validatedData.daily_rate,
          monthly_rate: validatedData.monthly_rate,
          services: validatedData.services,
        })
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      // Handle zod validation errors
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError?.message || 'Validation failed');
        return;
      }
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout type="worker">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage how clients see your profile
          </p>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {profile?.full_name?.charAt(0) || 'W'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{profile?.full_name}</h2>
                  <Badge variant={worker?.verification_status === 'verified' ? 'default' : 'secondary'}>
                    {worker?.verification_status || 'pending'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {worker?.working_areas?.[0] || 'Lagos'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {(worker?.rating || 0).toFixed(1)} ({worker?.total_jobs || 0} jobs)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tell clients about yourself, your experience, and what makes you great at your job..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Services I Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceTypes.map((service) => (
                <label
                  key={service.id}
                  htmlFor={`profile-service-${service.id}`}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.services.includes(service.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Checkbox 
                    id={`profile-service-${service.id}`}
                    checked={formData.services.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <span className="text-sm font-medium">{service.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rates */}
        <Card>
          <CardHeader>
            <CardTitle>My Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (₦)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="2000"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate (₦)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  placeholder="15000"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRate">Monthly Rate (₦)</Label>
                <Input
                  id="monthlyRate"
                  type="number"
                  placeholder="80000"
                  value={formData.monthlyRate}
                  onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
