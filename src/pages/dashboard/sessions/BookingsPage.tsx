import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookingTable } from '@/modules/scheduler/BookingTable';
import { schedulerApi } from '@/modules/scheduler/schedulerApi';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await schedulerApi.getBookings(user.id);
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Session Title',
      'Date',
      'Start Time',
      'End Time',
      'Timezone',
      'Contact Name',
      'Contact Email',
      'Contact Phone',
      'Status',
      'Payment Status',
      'Booked At',
      'Notes'
    ];

    const rows = bookings.map(booking => [
      booking.meet_windows.meet_offerings.title,
      new Date(booking.meet_windows.start_time).toLocaleDateString(),
      new Date(booking.meet_windows.start_time).toLocaleTimeString(),
      new Date(booking.meet_windows.end_time).toLocaleTimeString(),
      booking.meet_windows.timezone,
      booking.contact_info.name,
      booking.contact_info.email,
      booking.contact_info.phone || '',
      booking.status,
      booking.payment_status,
      new Date(booking.created_at).toLocaleString(),
      booking.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nil-session-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast({
      title: "Export Complete",
      description: "Bookings data has been exported to CSV",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/sessions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all your NIL session bookings
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <BookingTable
        bookings={bookings}
        isLoading={isLoading}
        onExportCSV={exportToCSV}
      />
    </div>
  );
}