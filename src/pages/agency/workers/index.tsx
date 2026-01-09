import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Star, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function AgencyWorkers() {
  const { user } = useAuth();
  const [agency, setAgency] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: agencyData } = await supabase
        .from('agencies')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (agencyData) {
        setAgency(agencyData);

        const { data: workersData } = await supabase
          .from('workers')
          .select('*, profiles!inner(full_name, avatar_url, location)')
          .eq('agency_id', agencyData.id);

        setWorkers(workersData || []);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="agency">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Workers</h1>
            <p className="text-muted-foreground">
              Manage workers in your agency
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Worker
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading workers...
          </div>
        ) : workers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker) => (
              <Card key={worker.id}>
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
                        {worker.verification_status === 'verified' ? (
                          <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
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
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="font-semibold text-lg mb-2">No workers yet</h3>
              <p className="text-muted-foreground mb-4">
                Add workers to your agency to get started
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Worker
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
