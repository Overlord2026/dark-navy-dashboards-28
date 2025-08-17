import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface BookingData {
  id: string;
  status: string;
  payment_status: string;
  contact_info: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: string;
  created_at: string;
  meet_windows: {
    start_time: string;
    end_time: string;
    timezone: string;
    meet_offerings: {
      title: string;
    };
  };
}

interface BookingTableProps {
  bookings: BookingData[];
  isLoading?: boolean;
  onExportCSV?: () => void;
}

export function BookingTable({ bookings, isLoading, onExportCSV }: BookingTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      reserved: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'outline'
    };
    
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      paid: 'default',
      unpaid: 'secondary',
      refunded: 'destructive'
    };
    
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Session Bookings ({bookings.length})
          </CardTitle>
          {bookings.length > 0 && onExportCSV && (
            <Button variant="outline" size="sm" onClick={onExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bookings yet</p>
            <p className="text-sm">Bookings will appear here once fans start scheduling sessions</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Booked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">
                        {booking.meet_windows.meet_offerings.title}
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Note: {booking.notes}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(booking.meet_windows.start_time), 'MMM d, yyyy')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(booking.meet_windows.start_time), 'h:mm a')} - {' '}
                            {format(new Date(booking.meet_windows.end_time), 'h:mm a')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.meet_windows.timezone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">{booking.contact_info.name}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {booking.contact_info.email}
                          </div>
                          {booking.contact_info.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {booking.contact_info.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(booking.payment_status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(booking.created_at), 'MMM d, h:mm a')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}