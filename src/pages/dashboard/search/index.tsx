import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Star, Filter, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const serviceCategories = [
  { id: 'all', label: 'All Services' },
  { id: 'nanny', label: 'Nanny' },
  { id: 'housekeeper', label: 'Housekeeper' },
  { id: 'cleaner', label: 'Cleaner' },
  { id: 'driver', label: 'Driver' },
  { id: 'caregiver', label: 'Caregiver' },
  { id: 'tutor', label: 'Tutor' },
];

const locations = [
  'All Locations',
  'Lekki',
  'Victoria Island',
  'Ikoyi',
  'Ikeja',
  'Surulere',
  'Yaba',
  'Ajah',
];

export default function SearchWorkers() {
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  useEffect(() => {
    fetchWorkers();
  }, [selectedCategory, selectedLocation]);

  const fetchWorkers = async () => {
    try {
      let query = supabase
        .from('workers')
        .select('*, profiles!inner(full_name, avatar_url, location)')
        .eq('verification_status', 'verified');

      if (selectedCategory !== 'all') {
        query = query.contains('services', [selectedCategory]);
      }

      const { data } = await query;

      if (data) {
        let filtered = data;
        if (selectedLocation !== 'All Locations') {
          filtered = data.filter(w => 
            w.working_areas?.some((area: string) => 
              area.toLowerCase().includes(selectedLocation.toLowerCase())
            )
          );
        }
        setWorkers(filtered);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    if (!searchQuery) return true;
    const profile = worker.profiles;
    return profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout type="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Find Workers</h1>
          <p className="text-muted-foreground">
            Browse verified domestic workers in Lagos
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading workers...
          </div>
        ) : filteredWorkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map((worker) => (
              <Card key={worker.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={worker.profiles?.avatar_url} />
                      <AvatarFallback>
                        {worker.profiles?.full_name?.charAt(0) || 'W'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">
                          {worker.profiles?.full_name}
                        </h3>
                        <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {worker.working_areas?.[0] || 'Lagos'}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {(worker.rating || 0).toFixed(1)}
                        <span className="text-muted-foreground">
                          ({worker.total_jobs || 0} jobs)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {worker.services?.slice(0, 3).map((service: string) => (
                      <Badge key={service} variant="secondary" className="text-xs capitalize">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-semibold">
                        {formatCurrency(worker.hourly_rate || 2000)}/hr
                      </p>
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/dashboard/book/${worker.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No workers found matching your criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSelectedCategory('all');
              setSelectedLocation('All Locations');
              setSearchQuery('');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
