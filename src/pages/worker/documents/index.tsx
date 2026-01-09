import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const requiredDocs = [
  { id: 'nimc', label: 'NIMC ID / NIN Slip', field: 'nimc_verified' },
  { id: 'police', label: 'Police Clearance Certificate', field: 'police_verified' },
];

const optionalDocs = [
  { id: 'address', label: 'Proof of Address' },
  { id: 'certificates', label: 'Professional Certificates' },
];

export default function WorkerDocuments() {
  const { user } = useAuth();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error('Error fetching worker:', error);
    } finally {
      setLoading(false);
    }
  };

  const verificationProgress = worker
    ? ((worker.nimc_verified ? 1 : 0) + (worker.police_verified ? 1 : 0)) / 2 * 100
    : 0;

  const getStatusIcon = (verified: boolean | null) => {
    if (verified === true) {
      return <CheckCircle className="w-5 h-5 text-accent" />;
    }
    return <Clock className="w-5 h-5 text-muted-foreground" />;
  };

  const getStatusBadge = (verified: boolean | null) => {
    if (verified === true) {
      return <Badge className="bg-accent">Verified</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <DashboardLayout type="worker">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your verification documents
          </p>
        </div>

        {/* Verification Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Verification Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Complete your verification to start receiving bookings
                </p>
              </div>
              <Badge variant={worker?.verification_status === 'verified' ? 'default' : 'secondary'}>
                {worker?.verification_status || 'pending'}
              </Badge>
            </div>
            <Progress value={verificationProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {verificationProgress}% complete
            </p>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>
              These documents are required for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requiredDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(worker?.[doc.field])}
                  <div>
                    <p className="font-medium">{doc.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {worker?.[doc.field] ? 'Document verified' : 'Upload required'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(worker?.[doc.field])}
                  {!worker?.[doc.field] && (
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Optional Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Optional Documents</CardTitle>
            <CardDescription>
              Additional documents to boost your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {optionalDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.label}</p>
                    <p className="text-sm text-muted-foreground">Optional</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
