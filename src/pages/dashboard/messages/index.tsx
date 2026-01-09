import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface MessagesPageProps {
  userType?: 'client' | 'worker' | 'agency';
}

export default function MessagesPage({ userType = 'client' }: MessagesPageProps) {
  return (
    <DashboardLayout type={userType}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with your {userType === 'client' ? 'workers' : 'clients'}
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              Messages with your {userType === 'client' ? 'workers' : 'clients'} will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
